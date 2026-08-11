"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadMaterial() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      router.push(`/materials/${data.materialId}`);
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          📄
        </div>

        <div>
          <h2 className="font-semibold text-white">Upload Study Material</h2>

          <p className="mt-1 text-sm text-slate-400">
            Upload a PDF and let Kognii turn it into study tools.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
          }}
          className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-400"
        />

        <p className="mt-3 text-xs text-slate-500">PDF only · Maximum 10MB</p>
      </div>

      {file && (
        <div className="mt-4 rounded-xl bg-slate-950 p-4">
          <p className="text-sm font-medium text-slate-200">Selected file</p>

          <p className="mt-1 truncate text-sm text-slate-500">{file.name}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-5 w-full rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Processing PDF..." : "Upload & Study"}
      </button>
    </div>
  );
}
