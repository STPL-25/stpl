export interface RequisitionItem {
  id: string;
  itemDescription: string;
  specification: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  totalCost: number;
  remarks: string;
}