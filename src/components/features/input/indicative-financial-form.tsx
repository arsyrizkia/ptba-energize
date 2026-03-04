"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, DollarSign } from "lucide-react";
import { EnergyProject } from "@/lib/types";

interface IndicativeFinancialFormProps {
  project: EnergyProject;
}

export function IndicativeFinancialForm({ project }: IndicativeFinancialFormProps) {
  const [form, setForm] = useState(project.financial);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert("Indicative Financial saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <DollarSign className="w-4 h-4 text-ptba-gold" />
          <h3 className="font-semibold text-ptba-navy text-sm">Financial Note</h3>
        </div>
        <Textarea
          value={form.financialNote}
          onChange={(e) => handleChange("financialNote", e.target.value)}
          placeholder="Financial analysis notes..."
          className="min-h-[120px]"
        />
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
          Key Financial Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="NPV (Rp)"
            type="number"
            value={form.npv}
            onChange={(e) => handleChange("npv", Number(e.target.value))}
          />
          <Input
            label="IRR (%)"
            type="number"
            step="0.1"
            value={form.irr}
            onChange={(e) => handleChange("irr", Number(e.target.value))}
          />
          <Input
            label="Payback Period"
            value={form.paybackPeriod}
            onChange={(e) => handleChange("paybackPeriod", e.target.value)}
          />
          <Input
            label="WACC Calculation (%)"
            type="number"
            step="0.1"
            value={form.waccCalculation}
            onChange={(e) => handleChange("waccCalculation", Number(e.target.value))}
          />
          <Input
            label="Capital Expenditure (CAPEX) (Rp)"
            type="number"
            value={form.capitalExpenditure}
            onChange={(e) => handleChange("capitalExpenditure", Number(e.target.value))}
          />
          <Input
            label="Tariff"
            value={form.tariff}
            onChange={(e) => handleChange("tariff", e.target.value)}
          />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-ptba-navy text-sm border-b border-gray-100 pb-2">
          Main Criteria Indication
        </h3>
        <Textarea
          value={form.mainCriteriaIndication}
          onChange={(e) => handleChange("mainCriteriaIndication", e.target.value)}
          placeholder="Main criteria indication..."
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
