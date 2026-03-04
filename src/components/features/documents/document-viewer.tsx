"use client";

import { useState } from "react";
import { FileText, Download, Calendar, HardDrive, FileSpreadsheet, Presentation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentCategory, ProjectDocument } from "@/lib/types";
import { mockDocuments } from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils/cn";

const categories: DocumentCategory[] = [
  "Risk Money",
  "Pitch Deck",
  "Business Pitch Deck",
  "RMM",
  "BOL",
  "External Data",
];

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "XLSX":
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    case "PPTX":
      return <Presentation className="w-5 h-5 text-ptba-orange" />;
    default:
      return <FileText className="w-5 h-5 text-ptba-red" />;
  }
}

function DocumentCard({ doc }: { doc: ProjectDocument }) {
  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-ptba-section-bg flex items-center justify-center shrink-0">
          {getFileIcon(doc.fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-ptba-navy truncate mb-0.5">
            {doc.title}
          </h4>
          <p className="text-xs text-ptba-gray mb-2 line-clamp-2">
            {doc.description}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-ptba-gray">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {doc.updatedAt}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {doc.fileSize}
            </span>
            <Badge variant="neutral" className="text-[10px] py-0">
              {doc.fileType}
            </Badge>
          </div>
          <p className="text-[11px] text-ptba-steel-blue mt-1.5 font-medium">
            {doc.projectName}
          </p>
        </div>
        <button
          onClick={() => alert(`Download: ${doc.title}`)}
          className="shrink-0 w-9 h-9 rounded-lg bg-ptba-navy/5 hover:bg-ptba-navy hover:text-white text-ptba-navy flex items-center justify-center transition-all duration-200"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

export function DocumentViewer() {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>("Risk Money");

  const filteredDocs = mockDocuments.filter((d) => d.category === activeCategory);

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl border border-gray-100 mb-6 overflow-x-auto">
        {categories.map((cat) => {
          const count = mockDocuments.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                activeCategory === cat
                  ? "bg-ptba-navy text-white shadow-sm"
                  : "text-ptba-gray hover:text-ptba-navy hover:bg-ptba-section-bg"
              )}
            >
              {cat}
              <span
                className={cn(
                  "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                  activeCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-ptba-gray"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-children">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 py-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-ptba-gray text-sm">No documents in this category</p>
          </div>
        ) : (
          filteredDocs.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
      </div>
    </div>
  );
}
