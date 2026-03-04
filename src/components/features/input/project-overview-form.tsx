"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Save, X } from "lucide-react";
import { EnergyProject } from "@/lib/types";

interface ProjectOverviewFormProps {
  project: EnergyProject;
}

export function ProjectOverviewForm({ project }: ProjectOverviewFormProps) {
  const [form, setForm] = useState(project.overview);
  const [imagePreview, setImagePreview] = useState<string>(project.overview.projectImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, projectImage: url }));
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setForm((prev) => ({ ...prev, projectImage: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    alert("Project Overview saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
            Basic Information
          </h3>
          <Input
            label="Project Name"
            value={form.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
          />
          <Input
            label="Capacity"
            value={form.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <Input
            label="PLN Connection"
            value={form.plnConnection}
            onChange={(e) => handleChange("plnConnection", e.target.value)}
          />
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
            Project Image
          </h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Project preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-red-50 text-ptba-gray hover:text-ptba-red rounded-full flex items-center justify-center shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-ptba-steel-blue transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-ptba-gray">
                Click to upload project image
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
          Description & Analysis
        </h3>
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Project description..."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Textarea
            label="Key Advantage"
            value={form.keyAdvantage}
            onChange={(e) => handleChange("keyAdvantage", e.target.value)}
          />
          <Textarea
            label="Competitive Advantage"
            value={form.competitiveAdvantage}
            onChange={(e) => handleChange("competitiveAdvantage", e.target.value)}
          />
        </div>
        <Textarea
          label="Background"
          value={form.background}
          onChange={(e) => handleChange("background", e.target.value)}
        />
      </Card>

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
