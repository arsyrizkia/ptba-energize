"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Save,
  Trash2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  HardDrive,
  Calendar,
} from "lucide-react";
import { EnergyProject, ProjectDocument, DocumentCategory } from "@/lib/types";

interface ProjectDocumentsFormProps {
  project: EnergyProject;
}

const ACCEPTED_TYPES = ".pdf,.pptx,.xlsx,.docx,.png,.jpg,.jpeg";

const CATEGORIES: DocumentCategory[] = [
  "Risk Money",
  "Pitch Deck",
  "Business Pitch Deck",
  "RMM",
  "BOL",
  "External Data",
];

function getFileIcon(fileType: string) {
  switch (fileType.toUpperCase()) {
    case "XLSX":
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    case "PPTX":
      return <Presentation className="w-5 h-5 text-ptba-orange" />;
    case "PNG":
    case "JPG":
    case "JPEG":
      return <Image className="w-5 h-5 text-ptba-steel-blue" />;
    default:
      return <FileText className="w-5 h-5 text-ptba-red" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileExtension(name: string): string {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

export function ProjectDocumentsForm({ project }: ProjectDocumentsFormProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>(project.documents || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList) => {
    const newDocs: ProjectDocument[] = Array.from(files).map((file, i) => ({
      id: `new-doc-${Date.now()}-${i}`,
      projectId: project.id,
      projectName: project.overview.projectName,
      category: "External Data" as DocumentCategory,
      title: file.name.replace(/\.[^.]+$/, ""),
      description: "",
      fileType: getFileExtension(file.name),
      fileSize: formatFileSize(file.size),
      updatedAt: new Date().toISOString().split("T")[0],
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const updateDoc = (id: string, field: keyof ProjectDocument, value: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const removeDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    alert("Documents saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <Card className="p-5">
        <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2 mb-4">
          Upload Documents
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? "border-ptba-steel-blue bg-ptba-steel-blue/5"
              : "border-gray-200 hover:border-ptba-steel-blue"
          }`}
        >
          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-ptba-gray">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, PPTX, XLSX, DOCX, PNG, JPG
          </p>
        </div>
      </Card>

      {/* Document list */}
      {documents.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2 mb-4">
            Documents ({documents.length})
          </h3>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-ptba-section-bg flex items-center justify-center shrink-0 mt-1">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Input
                        label="Title"
                        value={doc.title}
                        onChange={(e) => updateDoc(doc.id, "title", e.target.value)}
                      />
                      <Input
                        label="Description"
                        value={doc.description}
                        onChange={(e) => updateDoc(doc.id, "description", e.target.value)}
                        placeholder="Brief description..."
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={doc.category}
                        onChange={(e) => updateDoc(doc.id, "category", e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-ptba-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-ptba-steel-blue"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <span className="flex items-center gap-1 text-[11px] text-ptba-gray">
                        <HardDrive className="w-3 h-3" />
                        {doc.fileSize}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-ptba-gray">
                        <Calendar className="w-3 h-3" />
                        {doc.updatedAt}
                      </span>
                      <Badge variant="neutral" className="text-[10px] py-0">
                        {doc.fileType}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="shrink-0 w-8 h-8 rounded-lg text-ptba-gray hover:bg-red-50 hover:text-ptba-red flex items-center justify-center transition-colors"
                    title="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-ptba-navy text-white text-sm font-semibold rounded-lg hover:bg-ptba-navy-light transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Submit
        </button>
      </div>
    </div>
  );
}
