import fs from 'fs/promises';
import path from 'path';

// Interface untuk data storage
export interface StorageData<T> {
  data: T[];
  lastUpdated: string;
}

function getGitHubRepo() {
  return process.env.GITHUB_REPO || 'ramaahmadi/skrtmedia';
}

function getGitHubBranch() {
  return process.env.GITHUB_BRANCH || 'main';
}

function getGitHubToken() {
  return process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
}

function getGitHubApiUrl(path: string) {
  return `https://api.github.com/repos/${getGitHubRepo()}/contents/${path}`;
}

async function githubRequest(url: string, init: RequestInit) {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('GITHUB_TOKEN is required for GitHub storage');
  }

  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {})
    }
  });
}

// Class untuk mengelola file storage lokal
export class FileStorage<T> {
  private filePath: string;
  private data: T[] = [];
  private lastLoaded: string = '';

  constructor(fileName: string) {
    // Always use public/data directory for both development and production
    const dataDir = path.join(process.cwd(), 'public', 'data');
    this.filePath = path.join(dataDir, `${fileName}.json`);
  }

  // Load data dari file
  async load(): Promise<T[]> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      // Check if file exists
      const fileExists = await fs.access(this.filePath).then(() => true).catch(() => false);
      
      if (!fileExists) {
        // Create initial file with empty data
        await this.save([]);
        return [];
      }

      // Read file
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      const parsed: StorageData<T> = JSON.parse(fileContent);
      
      this.data = parsed.data || [];
      this.lastLoaded = new Date().toISOString();
      
      console.log(`Loaded ${this.data.length} items from ${this.filePath}`);
      return this.data;
    } catch (error) {
      console.error(`Error loading data from ${this.filePath}:`, error);
      // Return empty array if error
      this.data = [];
      return [];
    }
  }

  // Save data ke file
  async save(data: T[]): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      // Prepare data for storage
      const storageData: StorageData<T> = {
        data: data,
        lastUpdated: new Date().toISOString()
      };

      // Write to file with atomic operation
      const tempPath = `${this.filePath}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(storageData, null, 2));
      await fs.rename(tempPath, this.filePath);
      
      this.data = data;
      console.log(`Saved ${data.length} items to ${this.filePath}`);
    } catch (error) {
      console.error(`Error saving data to ${this.filePath}:`, error);
      throw error;
    }
  }

  // Get all data
  async getAll(): Promise<T[]> {
    await this.load();
    return this.data;
  }

  // Add new item
  async add(item: T): Promise<T> {
    const currentData = await this.getAll();
    const newData = [...currentData, item];
    await this.save(newData);
    return item;
  }

  // Update item by ID
  async update(id: string | number, updates: Partial<T>): Promise<T | null> {
    const currentData = await this.getAll();
    const index = currentData.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedItem = { ...currentData[index], ...updates };
    currentData[index] = updatedItem;
    await this.save(currentData);
    
    return updatedItem;
  }

  // Delete item by ID
  async delete(id: string | number): Promise<boolean> {
    const currentData = await this.getAll();
    const index = currentData.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return false;
    }

    currentData.splice(index, 1);
    await this.save(currentData);
    
    return true;
  }

  // Get item by ID
  async findById(id: string | number): Promise<T | null> {
    const currentData = await this.getAll();
    return currentData.find((item: any) => item.id === id) || null;
  }
}

export class GitHubFileStorage<T> {
  private githubPath: string;
  private data: T[] = [];
  private sha?: string;

  constructor(fileName: string) {
    this.githubPath = `public/data/${fileName}.json`;
  }

  private async fetchFile() {
    const url = `${getGitHubApiUrl(this.githubPath)}?ref=${getGitHubBranch()}`;
    const response = await githubRequest(url, { method: 'GET' });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub read failed: ${response.status} - ${text}`);
    }

    const payload = await response.json();
    return payload;
  }

  // Load data dari GitHub repo file
  async load(): Promise<T[]> {
    try {
      const payload = await this.fetchFile();
      if (!payload) {
        await this.save([]);
        return [];
      }

      this.sha = payload.sha;
      const content = Buffer.from(payload.content, 'base64').toString('utf-8');
      const parsed: StorageData<T> = JSON.parse(content);
      this.data = parsed.data || [];
      console.log(`Loaded ${this.data.length} items from GitHub path ${this.githubPath}`);
      return this.data;
    } catch (error) {
      console.error(`Error loading GitHub storage for ${this.githubPath}:`, error);
      this.data = [];
      return [];
    }
  }

  // Save data to GitHub repo file
  async save(data: T[]): Promise<void> {
    try {
      const storageData: StorageData<T> = {
        data,
        lastUpdated: new Date().toISOString()
      };
      const content = Buffer.from(JSON.stringify(storageData, null, 2)).toString('base64');
      const url = getGitHubApiUrl(this.githubPath);
      const body: any = {
        message: `Update ${this.githubPath}`,
        content,
        branch: getGitHubBranch()
      };
      if (this.sha) {
        body.sha = this.sha;
      }

      const response = await githubRequest(url, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`GitHub save failed: ${response.status} - ${text}`);
      }

      const payload = await response.json();
      this.sha = payload.content?.sha;
      this.data = data;
      console.log(`Saved ${data.length} items to GitHub path ${this.githubPath}`);
    } catch (error) {
      console.error(`Error saving GitHub storage for ${this.githubPath}:`, error);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    await this.load();
    return this.data;
  }

  async add(item: T): Promise<T> {
    const currentData = await this.getAll();
    const newData = [...currentData, item];
    await this.save(newData);
    return item;
  }

  async update(id: string | number, updates: Partial<T>): Promise<T | null> {
    const currentData = await this.getAll();
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return null;
    }

    const updatedItem = { ...currentData[index], ...updates };
    currentData[index] = updatedItem;
    await this.save(currentData);
    return updatedItem;
  }

  async delete(id: string | number): Promise<boolean> {
    const currentData = await this.getAll();
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return false;
    }

    currentData.splice(index, 1);
    await this.save(currentData);
    return true;
  }

  async findById(id: string | number): Promise<T | null> {
    const currentData = await this.getAll();
    return currentData.find((item: any) => item.id === id) || null;
  }
}

// Singleton instances untuk setiap data type
let kegiatanStorage: FileStorage<any> | GitHubFileStorage<any> | null = null;
let anggotaStorage: FileStorage<any> | null = null;
let artikelStorage: FileStorage<any> | null = null;
let beritaStorage: FileStorage<any> | null = null;
let notulensiStorage: FileStorage<any> | null = null;

// Get storage instances
export function getKegiatanStorage(): FileStorage<any> | GitHubFileStorage<any> {
  if (!kegiatanStorage) {
    const token = getGitHubToken();
    if (token) {
      kegiatanStorage = new GitHubFileStorage<any>('kegiatan');
    } else {
      kegiatanStorage = new FileStorage<any>('kegiatan');
    }
  }
  return kegiatanStorage;
}

export function getAnggotaStorage(): FileStorage<any> {
  if (!anggotaStorage) {
    anggotaStorage = new FileStorage<any>('anggota');
  }
  return anggotaStorage;
}

export function getArtikelStorage(): FileStorage<any> {
  if (!artikelStorage) {
    artikelStorage = new FileStorage<any>('artikel');
  }
  return artikelStorage;
}

export function getBeritaStorage(): FileStorage<any> {
  if (!beritaStorage) {
    beritaStorage = new FileStorage<any>('berita');
  }
  return beritaStorage;
}

export function getNotulensiStorage(): FileStorage<any> {
  if (!notulensiStorage) {
    notulensiStorage = new FileStorage<any>('notulensi');
  }
  return notulensiStorage;
}
