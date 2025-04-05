
import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onFileUpload(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${dragActive ? 'border-bookverse-secondary bg-bookverse-secondary/10' : 'border-gray-300 hover:border-bookverse-secondary/50 hover:bg-gray-50'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept="application/pdf" 
        className="hidden" 
        onChange={handleChange}
      />
      
      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {selectedFile ? (
          <>Selected: <span className="font-medium">{selectedFile.name}</span></>
        ) : (
          <>Drag & drop your PDF here, or <span className="text-bookverse-secondary">browse</span></>
        )}
      </p>
      <p className="mt-1 text-xs text-gray-500">Supported format: PDF</p>
    </div>
  );
};

export default PDFUploader;
