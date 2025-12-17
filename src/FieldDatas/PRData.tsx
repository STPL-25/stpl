import React from "react";
import { CalendarDays, Plus, Eye } from "lucide-react";
import { useAppState } from "@/globalState/hooks/useAppState";
// --- Types ---
type SelectOption = { value: string; label: string };

type FieldType = "text" | "number" | "date" | "textarea" | "select" | "email";

interface Field {
  field: string;
  label: string;
  placeholder?: string;
  require?: boolean;
  view?: boolean;
  type: FieldType;
  input?: boolean;
  options?: SelectOption[];
  gridSpan?: string;
  defaultValue?: string | number;
}

type Priority = { value: string; label: string; color: string };

type TabItem = { id: string; label: string; icon: React.ComponentType<any> };

// --- Constants ---
const reasons: SelectOption[] = [
  { value: "Equipment Replacement", label: "Equipment Replacement" },
  { value: "New Equipment Purchase", label: "New Equipment Purchase" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Maintenance & Repair", label: "Maintenance & Repair" },
  { value: "Software License", label: "Software License" },
  { value: "Professional Services", label: "Professional Services" },
  { value: "Marketing Materials", label: "Marketing Materials" },
  { value: "Training & Development", label: "Training & Development" },
  { value: "Other", label: "Other" },
];

const priorities: Priority[] = [
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
];

const tabs: TabItem[] = [
  { id: "basic", label: "Basic Info", icon: CalendarDays },
  { id: "items", label: "Items", icon: Plus },
  { id: "summary", label: "Summary", icon: Eye },
];

const supplierFields: Field[] = [
  { field: "name", label: "Company Name", placeholder: "Company name", require: true, view: true, type: "text", input: true },
  { field: "contactPerson", label: "Contact Person", placeholder: "Contact person", require: true, view: true, type: "text", input: true },
  { field: "phone", label: "Phone", placeholder: "Phone number", require: true, view: true, type: "text", input: true },
  { field: "email", label: "Email", placeholder: "Email address", require: true, view: true, type: "email", input: true },
  { field: "address", label: "Address", placeholder: "Complete address", require: true, view: true, type: "textarea", input: true },
];

const itemFields: Field[] = [
  { field: "PR_PRODUCT", label: "Product", placeholder: "Item description", require: true, view: true, type: "text", input: true },
  { field: "PR_QTY", label: "Quantity", placeholder: "Item Quantity", require: true, view: true, type: "number", input: true },
  { field: "UOM_SNO_DATA", label: "UOM", placeholder: "UOM", require: true, view: true, type: "text", input: true },
  { field: "SPECS", label: "Specifications", placeholder: "Specifications", require: true, view: true, type: "textarea", input: true },
];

// --- Hook ---
const useBasicInfoFields = (): Field[] => {
  const { companyDetails, divDetails, branchDetails } = useAppState();

  return [
    { field: "REQ_DATE", label: "Required Date", type: "date", require: true },
    {
      field: "PRIORITY",
      label: "Priority",
      type: "select",
      require: true,
      options: priorities.map((p) => ({ label: p.label, value: p.value })),
    },
    { field: "REASON", label: "Reason", type: "select", require: true, options: reasons, gridSpan: "sm:col-span-2" },
  ];
};

export type { Field, SelectOption, Priority, TabItem };
export { itemFields, supplierFields, useBasicInfoFields, tabs, priorities };
