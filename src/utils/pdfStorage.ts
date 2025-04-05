
/**
 * Utility functions for storing and retrieving PDF files in localStorage
 * Note: localStorage has size limitations (usually 5-10MB), so large PDFs may cause issues
 */

/**
 * Stores a PDF file in localStorage
 * @param file The PDF file to store
 * @returns A promise that resolves with the file's storage key
 */
export const storePDFInLocalStorage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/pdf') {
      reject(new Error('Invalid file. Please provide a PDF file.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') {
        reject(new Error('Failed to read file'));
        return;
      }
      
      try {
        // Generate a unique key for this PDF
        const timestamp = new Date().getTime();
        const fileKey = `pdf_${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        
        // Store file metadata
        const metadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dateAdded: timestamp
        };
        
        // Store the metadata and file content separately
        localStorage.setItem(`${fileKey}_metadata`, JSON.stringify(metadata));
        localStorage.setItem(fileKey, event.target.result);
        
        console.log(`PDF "${file.name}" stored in localStorage with key: ${fileKey}`);
        resolve(fileKey);
      } catch (error) {
        console.error('Error storing PDF in localStorage:', error);
        reject(new Error('Failed to store PDF. It may be too large for localStorage.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read file as data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Retrieves a PDF file from localStorage
 * @param fileKey The key of the stored PDF
 * @returns An object with the file metadata and data URL
 */
export const getPDFFromLocalStorage = (fileKey: string) => {
  try {
    const dataUrl = localStorage.getItem(fileKey);
    const metadataStr = localStorage.getItem(`${fileKey}_metadata`);
    
    if (!dataUrl || !metadataStr) {
      throw new Error('PDF not found in localStorage');
    }
    
    const metadata = JSON.parse(metadataStr);
    
    return {
      metadata,
      dataUrl
    };
  } catch (error) {
    console.error('Error retrieving PDF from localStorage:', error);
    throw new Error('Failed to retrieve PDF from localStorage');
  }
};

/**
 * Lists all stored PDFs in localStorage
 * @returns An array of PDF metadata objects
 */
export const listStoredPDFs = () => {
  const pdfs = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.endsWith('_metadata')) {
      try {
        const fileKey = key.replace('_metadata', '');
        const metadata = JSON.parse(localStorage.getItem(key) || '{}');
        pdfs.push({
          fileKey,
          metadata
        });
      } catch (error) {
        console.error('Error parsing PDF metadata:', error);
      }
    }
  }
  
  return pdfs;
};

/**
 * Removes a PDF from localStorage
 * @param fileKey The key of the PDF to remove
 */
export const removePDFFromLocalStorage = (fileKey: string) => {
  try {
    localStorage.removeItem(fileKey);
    localStorage.removeItem(`${fileKey}_metadata`);
    console.log(`PDF with key ${fileKey} removed from localStorage`);
  } catch (error) {
    console.error('Error removing PDF from localStorage:', error);
    throw new Error('Failed to remove PDF from localStorage');
  }
};
