import fs from 'fs/promises';
import path from 'path';

// Interface untuk data storage
export interface StorageData<T> {
  data: T[];
  lastUpdated: string;
}

// Class untuk mengelola file storage
export class FileStorage<T> {
  private filePath: string;
  private data: T[] = [];
  private lastLoaded: string = '';

  constructor(fileName: string) {
    // Use /tmp directory for production (Vercel), public/data for development
    const isProduction = process.env.NODE_ENV === 'production';
    const dataDir = isProduction ? '/tmp' : path.join(process.cwd(), 'public', 'data');
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
      // Fallback to memory-only if file write fails
      this.data = data;
      console.log('Fallback: Data kept in memory only');
    }
  }

  // Get all data
  async getAll(): Promise<T[]> {
    if (this.data.length === 0) {
      await this.load();
    }
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

// Singleton instances untuk setiap data type
let kegiatanStorage: FileStorage<any> | null = null;
let anggotaStorage: FileStorage<any> | null = null;
let artikelStorage: FileStorage<any> | null = null;
let beritaStorage: FileStorage<any> | null = null;
let notulensiStorage: FileStorage<any> | null = null;

// Get storage instances
export function getKegiatanStorage(): FileStorage<any> {
  if (!kegiatanStorage) {
    kegiatanStorage = new FileStorage<any>('kegiatan');
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
