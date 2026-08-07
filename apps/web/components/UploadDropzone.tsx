"use client";

import { useCallback, useState } from "react";
import { apiUploadPhoto } from "@/lib/api-client";

interface UploadDropzoneProps {
  onUploaded: (url: string) => void;
}

export default function UploadDropzone({ onUploaded }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError("");
      setPreview(URL.createObjectURL(file));
      setUploading(true);
      try {
        const { url } = await apiUploadPhoto(file);
        onUploaded(url);
      } catch (err: unknown) {
        setUploadError(
          err instanceof Error ? err.message : "Upload failed"
        );
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`relative w-full h-full min-h-[300px] border-2 flex flex-col items-center justify-center transition-colors ${
        dragActive
          ? "border-black border-solid bg-linen"
          : "border-black border-dashed bg-cream"
      }`}
    >
      {preview ? (
        <div className="absolute inset-8">
          <div className="w-full h-full border-2 border-black bg-white p-3 shadow-md flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="text-center px-6">
          <p className="font-sans text-sm uppercase tracking-widest text-muted mb-2">
            {uploading ? "Uploading…" : "Drop photo here"}
          </p>
          <p className="font-sans text-xs uppercase tracking-widest text-muted">
            or click to browse
          </p>
        </div>
      )}

      {/* Invisible file input over the whole zone */}
      <input
        id="photo-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleInputChange}
      />

      {uploading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <p className="font-sans text-xs uppercase tracking-widest text-cream animate-pulse">
            Uploading…
          </p>
        </div>
      )}

      {uploadError && (
        <p className="absolute bottom-2 left-2 right-2 font-sans text-[10px] text-terracotta text-center">
          {uploadError}
        </p>
      )}
    </div>
  );
}
