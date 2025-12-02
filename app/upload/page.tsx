"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GradientOrbs } from "@/components/GradientOrbs";
import {
  Upload,
  Globe,
  FileJson,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

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
    <div className="relative min-h-screen">
      <GradientOrbs variant="section" />

      <div className="container mx-auto p-8 max-w-2xl relative">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-btn-primary rounded-wonderful-xl flex items-center justify-center shadow-md mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-text-primary bg-clip-text text-transparent mb-2">New Screening</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Upload your LinkedIn candidate data to start screening</p>
        </div>

        {/* Main Card */}
        <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm rounded-wonderful-2xl shadow-wonderful-xl border border-white/20 dark:border-gray-800/50 p-8">
          {/* Country Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wide flex items-center space-x-2">
              <Globe className="w-4 h-4 text-wonderful-purple-600" />
              <span>Target Country (Optional)</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200"
            >
              <option value="">-- No Country --</option>
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
            className={`border-2 border-dashed rounded-wonderful-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-wonderful-purple-500 bg-wonderful-purple-50 dark:bg-wonderful-purple-900/20'
                : file
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-wonderful-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
              <div>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">File Selected</p>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FileJson className="w-5 h-5" />
                  <span>{file.name}</span>
                </div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-wonderful-purple-600 dark:text-wonderful-purple-400 hover:text-wonderful-purple-700 font-semibold mt-4 inline-block"
                >
                  Choose a different file
                </label>
              </div>
            ) : (
              <div>
                <FileJson className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Drag and drop your JSON file here
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">or</p>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-wonderful-purple-100 dark:bg-wonderful-purple-900/30 text-wonderful-purple-700 dark:text-wonderful-purple-400 px-6 py-3 rounded-wonderful-lg font-semibold hover:bg-wonderful-purple-200 dark:hover:bg-wonderful-purple-900/50 transition-all duration-200 inline-block"
                >
                  Browse Files
                </label>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-wonderful-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-8 w-full bg-btn-primary hover:bg-btn-primary-hover text-white py-4 rounded-wonderful-lg font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Upload & Start Screening</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a JSON file containing an array of LinkedIn profile data.
          </p>
        </div>
      </div>
    </div>
  );
}
