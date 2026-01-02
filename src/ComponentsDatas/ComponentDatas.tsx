import { lazy, LazyExoticComponent, ComponentType } from "react";
import { Home, X, LogOut, BarChart3, Users, ShoppingCart, Calendar, Settings,
  ChevronDown, ChevronRight, Menu, Building2, GitBranch, Network, FileText, ShieldCheck,
  Package, Globe, Search, Bell, User, DollarSign, Eye, Plus, Edit, Trash,IdCard } from "lucide-react";
// import PurchaseRequisitionPage from "@/Application/PR/PurchaseRequisitionPage";
// Lazy-loaded components
 export const MasterComponents = lazy(() => import(".././Application/Master-Screen/MasterPageScreen"));
// const PurchaseRequisitionForm = lazy(() => import("../MasterDataManagement/PurchaseRequisitionForm"));
// const PurchaseApproval = lazy(() => import("../MasterDataManagement/PurchaseApprovalScreen"));
// const PurReqAuthorization = lazy(() => import("../MasterDataManagement/PurchaseRequisitionApproval"));
// const HodApproval = lazy(() => import("../MasterDataManagement/PurchaseReqHeadApproval"));
// const BudgetRequest = lazy(() => import("../MasterDataManagement/BudgetRequestPage"));
 export const KYCEntry = lazy(() => import("../Application/Kyc-Screen/KycEntry"));
 export const RoleApproval = lazy(() => import("../Application/RoleApproval/UserRoleApprovalScreen"));
 export const KYCDataView = lazy(() => import("../Application/Kyc-Screen/KYCDataView"));
 export const PurchaseRequisitionPage = lazy(() => import("../Application/PR/PurchaseRequisitionPage"));
 export const ApprovalWorkflowPage = lazy(() => import("../Application/RoleApproval/ApprovalWorkflowManager"));
// Interface for the component map
export interface SectionComponentsMap {
  [key: string]: LazyExoticComponent<ComponentType<any>>;
}

// Strongly typed map
export const sectionComponents: SectionComponentsMap = {
//   PurchaseApproval,
//   PurRequisitionForm: PurchaseRequisitionForm,
  masters: MasterComponents,
  RoleApproval: RoleApproval,
//   PurReqAuthorization,
//   HodApproval,
//   BudgetRequest,
KYCEntry,
KYCDataView,
PurchaseRequisitionPage,
ApprovalWorkflowPage
};
