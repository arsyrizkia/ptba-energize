"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Scale } from "lucide-react";
import { EnergyProject } from "@/lib/types";

interface LegalAspectFormProps {
  project: EnergyProject;
}

export function LegalAspectForm({ project }: LegalAspectFormProps) {
  const [form, setForm] = useState(project.legal);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert("Legal Aspect saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <Scale className="w-4 h-4 text-ptba-navy" />
            <h3 className="font-semibold text-ptba-navy text-sm">Legal & Compliance</h3>
          </div>
          <Textarea
            label="Legal Aspect"
            value={form.legalAspect1}
            onChange={(e) => handleChange("legalAspect1", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Notariat"
            value={form.notariat}
            onChange={(e) => handleChange("notariat", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Material"
            value={form.material}
            onChange={(e) => handleChange("material", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Lingkungan"
            value={form.lingkungan}
            onChange={(e) => handleChange("lingkungan", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Keamanan"
            value={form.keamanan}
            onChange={(e) => handleChange("keamanan", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Perizinan"
            value={form.perizinan}
            onChange={(e) => handleChange("perizinan", e.target.value)}
            className="min-h-[80px]"
          />
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
            Regulatory & Insurance
          </h3>
          <Textarea
            label="Labor"
            value={form.labor}
            onChange={(e) => handleChange("labor", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Keselamatan"
            value={form.keselamatan}
            onChange={(e) => handleChange("keselamatan", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Regulasi"
            value={form.regulasi}
            onChange={(e) => handleChange("regulasi", e.target.value)}
            className="min-h-[80px]"
          />
          <Textarea
            label="Asuransi"
            value={form.asuransi}
            onChange={(e) => handleChange("asuransi", e.target.value)}
            className="min-h-[80px]"
          />
        </Card>
      </div>

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
