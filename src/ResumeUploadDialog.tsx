import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';

interface ResumeUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeUploadDialog({ open, onOpenChange }: ResumeUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Access the function (assuming it's namespaced under tigris)
  const uploadToTigris = useAction(api.tigris.uploadResume.uploadResume);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Convert file to base64 string using FileReader
      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Call the Convex mutation to upload the file to Tigris
      await uploadToTigris({
        fileName: file.name,
        fileContent: base64File,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
      });

      setUploadComplete(true);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {uploadComplete ? "Upload Successful!" : "Upload Your Resume"}
          </DialogTitle>
        </DialogHeader>
        {!uploadComplete ? (
          <div className="space-y-4 py-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
            <p className="text-xs text-gray-500">
              Supported format: PDF only. Max size: 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-green-600">
              ✅ Job description uploaded successfully!
            </p>
            <p className="text-gray-600">
              You can now start chatting to see if Charles would be a good fit for this role.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              Start Chatting
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
