// Utility function untuk export data ke format text/note, Excel, dan PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export interface ExportOptions {
  title: string;
  data: any[];
  filename?: string;
}

/**
 * Export data array ke format text file
 * @param options - Konfigurasi export (title, data, filename)
 */
export function exportToText(options: ExportOptions): void {
  const { title, data, filename } = options;
  
  // Generate filename jika tidak disediakan
  const defaultFilename = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
  const finalFilename = filename || defaultFilename;
  
  // Buat konten text
  let content = `${'='.repeat(50)}\n`;
  content += `${title.toUpperCase()}\n`;
  content += `${'='.repeat(50)}\n`;
  content += `Tanggal Export: ${new Date().toLocaleString('id-ID')}\n`;
  content += `Total Data: ${data.length}\n`;
  content += `${'='.repeat(50)}\n\n`;
  
  if (data.length === 0) {
    content += 'Tidak ada data untuk ditampilkan.\n';
  } else {
    // Loop setiap item data
    data.forEach((item, index) => {
      content += `${'-'.repeat(40)}\n`;
      content += `Data #${index + 1}\n`;
      content += `${'-'.repeat(40)}\n`;
      
      // Loop setiap field dalam item
      Object.keys(item).forEach(key => {
        const value = item[key];
        let formattedValue = value;
        
        // Format nilai berdasarkan tipe
        if (value === null || value === undefined) {
          formattedValue = '-';
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'Ya' : 'Tidak';
        } else if (Array.isArray(value)) {
          formattedValue = value.length > 0 ? value.join(', ') : '-';
        } else if (typeof value === 'object') {
          formattedValue = JSON.stringify(value, null, 2);
        }
        
        // Format key menjadi lebih readable
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        content += `${formattedKey}: ${formattedValue}\n`;
      });
      
      content += '\n';
    });
  }
  
  content += `${'='.repeat(50)}\n`;
  content += `End of Report\n`;
  content += `${'='.repeat(50)}\n`;
  
  // Download file
  downloadTextFile(content, finalFilename);
}

/**
 * Download string sebagai file text
 */
function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data Anggota ke format text
 */
export function exportAnggotaToText(members: any[]): void {
  exportToText({
    title: 'Data Anggota',
    data: members,
    filename: `anggota-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export data Pembukuan ke format text
 */
export function exportPembukuanToText(records: any[]): void {
  exportToText({
    title: 'Data Pembukuan Keuangan',
    data: records,
    filename: `pembukuan-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export data Notulensi ke format text
 */
export function exportNotulensiToText(notes: any[]): void {
  exportToText({
    title: 'Data Notulensi Rapat',
    data: notes,
    filename: `notulensi-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export data Kegiatan ke format text
 */
export function exportKegiatanToText(activities: any[]): void {
  exportToText({
    title: 'Data Kegiatan',
    data: activities,
    filename: `kegiatan-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export data Berita ke format text
 */
export function exportBeritaToText(news: any[]): void {
  exportToText({
    title: 'Data Berita & Pengumuman',
    data: news,
    filename: `berita-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export data Artikel ke format text
 */
export function exportArtikelToText(articles: any[]): void {
  exportToText({
    title: 'Data Artikel',
    data: articles,
    filename: `artikel-${new Date().toISOString().split('T')[0]}.txt`
  });
}

/**
 * Export single item ke format text
 */
export function exportSingleItemToText(item: any, title: string, itemName: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${itemName}-${timestamp}.txt`;
  
  let content = `${'='.repeat(50)}\n`;
  content += `${title.toUpperCase()}\n`;
  content += `${'='.repeat(50)}\n`;
  content += `Tanggal Export: ${new Date().toLocaleString('id-ID')}\n`;
  content += `${'='.repeat(50)}\n\n`;
  
  content += `${'-'.repeat(40)}\n`;
  content += `Detail Item\n`;
  content += `${'-'.repeat(40)}\n`;
  
  // Loop setiap field dalam item
  Object.keys(item).forEach(key => {
    const value = item[key];
    let formattedValue = value;
    
    // Format nilai berdasarkan tipe
    if (value === null || value === undefined) {
      formattedValue = '-';
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Ya' : 'Tidak';
    } else if (Array.isArray(value)) {
      formattedValue = value.length > 0 ? value.join(', ') : '-';
    } else if (typeof value === 'object') {
      formattedValue = JSON.stringify(value, null, 2);
    }
    
    // Format key menjadi lebih readable
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    content += `${formattedKey}: ${formattedValue}\n`;
  });
  
  content += `\n${'='.repeat(50)}\n`;
  content += `End of Report\n`;
  content += `${'='.repeat(50)}\n`;
  
  // Download file
  downloadTextFile(content, filename);
}

/**
 * Export single item ke format Excel
 */
export function exportSingleItemToExcel(item: any, title: string, itemName: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${itemName}-${timestamp}.xlsx`;
  
  // Convert item ke format worksheet
  const worksheetData = Object.keys(item).map(key => {
    const value = item[key];
    let formattedValue = value;
    
    if (value === null || value === undefined) {
      formattedValue = '-';
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Ya' : 'Tidak';
    } else if (Array.isArray(value)) {
      formattedValue = value.length > 0 ? value.join(', ') : '-';
    } else if (typeof value === 'object') {
      formattedValue = JSON.stringify(value);
    }
    
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    return {
      'Field': formattedKey,
      'Value': formattedValue
    };
  });
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
  // Download file
  XLSX.writeFile(workbook, filename);
}

/**
 * Export single item ke format PDF
 */
export function exportSingleItemToPDF(item: any, title: string, itemName: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${itemName}-${timestamp}.pdf`;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title.toUpperCase(), 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Tanggal Export: ${new Date().toLocaleString('id-ID')}`, 105, 30, { align: 'center' });
  
  // Add content
  doc.setFontSize(12);
  let yPosition = 45;
  
  Object.keys(item).forEach(key => {
    const value = item[key];
    let formattedValue = value;
    
    if (value === null || value === undefined) {
      formattedValue = '-';
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Ya' : 'Tidak';
    } else if (Array.isArray(value)) {
      formattedValue = value.length > 0 ? value.join(', ') : '-';
    } else if (typeof value === 'object') {
      formattedValue = JSON.stringify(value);
    }
    
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    
    // Check if need new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(11);
    doc.text(`${formattedKey}:`, 20, yPosition);
    doc.setFontSize(10);
    
    // Handle long values by wrapping text
    const maxWidth = 170;
    const lines = doc.splitTextToSize(String(formattedValue), maxWidth);
    
    lines.forEach((line: string, index: number) => {
      if (index === 0) {
        doc.text(line, 50, yPosition);
      } else {
        yPosition += 7;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 50, yPosition);
      }
    });
    
    yPosition += 15;
  });
  
  // Download file
  doc.save(filename);
}
