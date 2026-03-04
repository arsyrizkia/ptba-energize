import { FileText } from "lucide-react";
import { DocumentViewer } from "@/components/features/documents/document-viewer";

export default function DocumentsPage() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-ptba-red/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-ptba-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ptba-navy">Documents</h1>
            <p className="text-sm text-ptba-gray">
              View and download project documents
            </p>
          </div>
        </div>
      </div>

      <DocumentViewer />
    </div>
  );
}
