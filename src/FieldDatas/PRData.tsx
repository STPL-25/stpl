import { useMemo } from "react";
import type {FieldType} from "./fieldType/fieldType";
import { useMasterOptions } from "../hooks/ReUsableHook/useMasterOptions";



export const usePRBasicInfoFields = (formData?: any): FieldType[] => {
  const {options, loading} = useMasterOptions(['BranchMaster','DeptMaster','PRBudget','PriorityMaster']);
  
  return useMemo<FieldType[]>(
    () => [
      { field: "pr_basic_sno", label: "PR Basic ID", require: false, view: true, type: "text", input: false },
      
      { field: "brn_sno", label: "Branch", require: true, view: false, type: "select", options: options?.BranchMaster, input: true },
      { field: "brn_name", label: "Branch", require: true, view: true, type: "select", options: options?.BranchMaster, input: false },
      
      { field: "dept_sno", label: "Department", require: true, view: false, type: "select", options: options?.DeptMaster, input: true },
      { field: "dept_name", label: "Department", require: true, view: true, type: "select", options: options?.DeptMaster, input: false },
      
      { field: "budget_sno", label: "Budget", require: true, view: false, type: "select", options: options?.PRBudget, input: true },
      { field: "budget_name", label: "Budget", require: true, view: true, type: "select", options: options?.PRBudget, input: false },
      
      { field: "budget_code", label: "Budget Code", require: false, view: true, type: "text", input: false },
      
      { field: "req_date", label: "Request Date", require: true, view: true, type: "date", input: true },
      { field: "required_date", label: "Required Date", require: true, view: true, type: "date", input: true }  ,
      
      { field: "priority_sno", label: "Priority", require: true, view: false, type: "select", options: options?.PriorityMaster, input: true },
      { field: "priority_name", label: "Priority", require: true, view: true, type: "select", options: options?.PriorityMaster, input: false },
      
      { field: "purpose", label: "Purpose", require: false, view: true, type: "textarea", input: true },
      
      { field: "is_active", label: "Active Status", require: false, view: false, type: "text", input: false },
      
      
    ],
    [options, loading]
  );
};

export const usePRItemDetailsFields = (formData?: any): FieldType[] => {
  const {options, loading} = useMasterOptions(['ProductMaster','UomMaster','PRBasicInfo','PRBudget']);
  
  return useMemo<FieldType[]>(
    () => [
      { field: "pr_item_sno", label: "PR Item ID", require: false, view: true, type: "text", input: false },
      
      { field: "pr_basic_sno", label: "PR Basic", require: true, view: false, type: "select", options: options?.PRBasicInfo, input: true },
      { field: "pr_basic_name", label: "PR Basic", require: true, view: true, type: "select", options: options?.PRBasicInfo, input: false },
      
      { field: "prod_sno", label: "Product", require: true, view: false, type: "select", options: options?.ProductMaster, input: true },
      { field: "prod_name", label: "Product", require: true, view: true, type: "select", options: options?.ProductMaster, input: false },
      
      
      
      { field: "qty", label: "Quantity", require: true, view: true, type: "number", input: true },
      
      { field: "unit", label: "Unit", require: true, view: false, type: "select", options: options?.UomMaster, input: true },
      { field: "unit_name", label: "Unit", require: true, view: true, type: "select", options: options?.UomMaster, input: false },
      
      { field: "est_cost", label: "Estimated Cost", require: false, view: true, type: "number", input: true },
      { field: "total_cost", label: "Total Cost", require: false, view: true, type: "number", input: true },
      
      { field: "remarks", label: "Remarks", require: false, view: true, type: "textarea", input: true },
      
      { field: "is_active", label: "Active Status", require: false, view: false, type: "text", input: false },
      
      // { field: "created_date", label: "Created Date", require: false, view: true, type: "date", input: false },
      // { field: "created_by", label: "Created By", require: false, view: true, type: "text", input: false },
      // { field: "modified_date", label: "Modified Date", require: false, view: false, type: "date", input: false },
      // { field: "modified_by", label: "Modified By", require: false, view: false, type: "text", input: false },
    ],
    [options, loading]
  );
};
