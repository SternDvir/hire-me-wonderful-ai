"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileJson,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Link,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type TabMode = "scrape" | "upload";

export default function UploadPage() {
  const router = useRouter();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabMode>("scrape");

  // Scrape mode state
  const [urlInput, setUrlInput] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapeProgress, setScrapeProgress] = useState<string | null>(null);

  // Upload mode state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Parse URLs from input
  const parseUrls = (input: string): string[] => {
    return input
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
  };

  const urlCount = parseUrls(urlInput).length;

  // Handle scrape submission
  const handleScrape = async () => {
    const urls = parseUrls(urlInput);
    if (urls.length === 0) {
      setScrapeError("Please enter at least one LinkedIn URL");
      return;
    }

    setScraping(true);
    setScrapeError(null);
    setScrapeProgress("Starting LinkedIn scrape...");

    try {
      setScrapeProgress(`Scraping ${urls.length} profiles... This may take a few minutes.`);

      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Scraping failed");
      }

      setScrapeProgress("Scraping complete! Redirecting...");

      // Show invalid URLs warning if any
      if (data.invalidUrls && data.invalidUrls.length > 0) {
        console.warn("Some URLs were invalid or failed:", data.invalidUrls);
      }

      router.push(`/screenings/${data.sessionId}`);
    } catch (error) {
      console.error("Scrape error:", error);
      setScrapeError(error instanceof Error ? error.message : "Scraping failed");
      setScrapeProgress(null);
    } finally {
      setScraping(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  // Handle drag events
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
        setUploadError(null);
      } else {
        setUploadError("Please upload a JSON file");
      }
    }
  };

  // Handle JSON upload
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);
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
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
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
        setUploadError(error.message);
      } else {
        setUploadError("Error uploading file");
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
          <h1 className="text-display text-text-primary">Add Candidates</h1>
          <p className="text-body text-text-secondary mt-2">
            Scrape LinkedIn profiles or upload existing JSON data
          </p>
        </div>

        {/* Main Card */}
        <div className="card p-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab("scrape")}
              className={`flex items-center gap-2 px-4 py-3 text-body font-medium border-b-2 transition-colors ${
                activeTab === "scrape"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Link className="w-4 h-4" />
              Scrape LinkedIn
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 py-3 text-body font-medium border-b-2 transition-colors ${
                activeTab === "upload"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <FileJson className="w-4 h-4" />
              Upload JSON
            </button>
          </div>

          {/* Scrape Tab Content */}
          {activeTab === "scrape" && (
            <div className="animate-fade-in">
              <label className="block text-small text-text-secondary mb-2">
                LinkedIn Profile URLs (one per line)
              </label>
              <textarea
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setScrapeError(null);
                }}
                placeholder="https://www.linkedin.com/in/williamhgates&#10;https://www.linkedin.com/in/jeffweiner08&#10;..."
                className="w-full h-48 p-4 bg-background-tertiary/50 border border-border rounded-lg text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150 font-mono text-small resize-none"
                disabled={scraping}
              />

              {/* URL Count */}
              <div className="mt-2 flex justify-between items-center text-small">
                <span className="text-text-tertiary">
                  {urlCount} URL{urlCount !== 1 ? "s" : ""} detected
                </span>
                {urlCount > 0 && (
                  <button
                    onClick={() => setUrlInput("")}
                    className="text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Progress Message */}
              {scrapeProgress && (
                <div className="mt-4 p-4 bg-accent-muted border border-accent/20 text-accent rounded-lg flex items-center gap-3 animate-slide-up">
                  <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                  <span className="text-small">{scrapeProgress}</span>
                </div>
              )}

              {/* Error Message */}
              {scrapeError && (
                <div className="mt-4 p-4 bg-danger-muted border border-danger-border text-danger-light rounded-lg flex items-start gap-3 animate-slide-up">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-small">{scrapeError}</span>
                </div>
              )}

              {/* Scrape Button */}
              <Button
                onClick={handleScrape}
                disabled={urlCount === 0 || scraping}
                fullWidth
                size="lg"
                className="mt-6"
                loading={scraping}
              >
                {scraping ? (
                  'Scraping Profiles...'
                ) : (
                  <>
                    Scrape & Start Screening
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-tiny text-text-tertiary mt-4">
                Scraping is powered by Apify. Each profile typically takes 5-15 seconds.
              </p>
            </div>
          )}

          {/* Upload Tab Content */}
          {activeTab === "upload" && (
            <div className="animate-fade-in">
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
              {uploadError && (
                <div className="mt-5 p-4 bg-danger-muted border border-danger-border text-danger-light rounded-lg flex items-start gap-3 animate-slide-up">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-small">{uploadError}</span>
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

              <p className="text-center text-tiny text-text-tertiary mt-4">
                Upload a JSON file containing an array of LinkedIn profile data (Apify format)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
