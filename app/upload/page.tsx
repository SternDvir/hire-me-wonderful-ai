"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Globe,
  FileJson,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [countries, setCountries] = useState<{id: string, name: string}[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetch("/api/countries")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          setCountries([]);
        }
      })
      .catch(err => {
        console.error(err);
        setCountries([]);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.json')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a JSON file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const text = await file.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("File must contain valid JSON");
      }

      if (!Array.isArray(json)) {
        throw new Error("File must contain a JSON array of candidates");
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidates: json,
          createdBy: "user",
          countryId: selectedCountry || null
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload error details:", errorData);
        const errorMsg = errorData.message
          ? `${errorData.error}: ${errorData.message}`
          : errorData.error || "Upload failed";
        throw new Error(errorMsg);
      }

      const data = await res.json();
      router.push(`/screenings/${data.sessionId}`);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error uploading file");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-gradient min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-display text-text-primary">Upload Candidates</h1>
          <p className="text-body text-text-secondary mt-2">
            Upload a JSON file with LinkedIn profile data to start screening
          </p>
        </div>

        {/* Main Card */}
        <div className="card p-6">
          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-small text-text-secondary mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Target Country (Optional)
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-11 px-4 bg-background-tertiary/50 border border-border rounded-lg text-body text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150"
            >
              <option value="">No country selected</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
              dragActive
                ? 'border-accent bg-accent-muted shadow-glow'
                : file
                  ? 'border-success bg-success-muted shadow-glow-success'
                  : 'border-border hover:border-border-focus hover:bg-background-tertiary/30'
            }`}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            {file ? (
              <div className="animate-fade-in">
                <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-success-light" />
                </div>
                <p className="text-h3 text-text-primary mb-2">File Selected</p>
                <div className="flex items-center justify-center gap-2 text-text-secondary mb-4">
                  <FileJson className="w-4 h-4" />
                  <span className="text-small font-mono">{file.name}</span>
                </div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-accent hover:text-accent-hover text-small font-medium transition-colors"
                >
                  Choose a different file
                </label>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 rounded-xl bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-text-tertiary" />
                </div>
                <p className="text-h3 text-text-primary mb-2">
                  Drop JSON file here
                </p>
                <p className="text-small text-text-tertiary mb-5">or click to browse</p>
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center justify-center font-medium rounded-lg h-10 px-5 text-body gap-2 bg-background-tertiary/50 hover:bg-background-tertiary border border-border hover:border-border-focus text-text-primary cursor-pointer transition-all duration-150"
                >
                  Browse Files
                </label>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-5 p-4 bg-danger-muted border border-danger-border text-danger-light rounded-lg flex items-start gap-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-small">{error}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            fullWidth
            size="lg"
            className="mt-6"
            loading={uploading}
          >
            {uploading ? (
              'Processing...'
            ) : (
              <>
                Upload & Start Screening
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-small text-text-tertiary mt-6">
          Upload a JSON file containing an array of LinkedIn profile data
        </p>
      </div>
    </div>
  );
}
