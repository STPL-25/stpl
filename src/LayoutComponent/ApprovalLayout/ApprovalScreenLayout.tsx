


// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { CheckCircle2, XCircle, Clock, User, Calendar, DollarSign, FileText, ArrowRight, Scale, AlertCircle, ChevronRight } from 'lucide-react';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { usePrApprovalSideCardDatas } from '@/FieldDatas/PrApprovalData';
// import { FieldType } from '@/FieldDatas/SignUpData';
// interface ApprovalScreenLayoutProps {
//   approvalName: string;
//   prList: any[];
//   selectedPR: any;
//   handlePRSelect: (pr: any) => void;
//   handleAction: (action: string) => void;
//   showApprovalDialog: boolean;
//   setShowApprovalDialog: (show: boolean) => void;
//   action: string;
//   comments: string;
//   setComments: (comments: string) => void;
//   handleSubmit: () => void;
//   loading: boolean;
//   actionType: 'approve' | 'reject';
// }

// function ApprovalScreenLayout({
//   approvalName,
//   prList,
//   selectedPR,
//   handlePRSelect,
//   handleAction,
//   showApprovalDialog,
//   setShowApprovalDialog,
//   action,
//   comments,
//   setComments,
//   handleSubmit,
//   loading,
//   actionType
// }: ApprovalScreenLayoutProps) {
//   const sideCardFieldsForPr = usePrApprovalSideCardDatas();

//   // Helper function to get field value with fallback to alternate fields
//   const getFieldValue = (pr: any, field: FieldType): any => {
//     if (pr[field.field] !== undefined && pr[field.field] !== null) {
//       return pr[field.field];
//     }

//     // Try alternate fields if available
//     // if (field.alternateFields) {
//     //   for (const altField of field.alternateFields) {
//     //     if (pr[altField] !== undefined && pr[altField] !== null) {
//     //       return pr[altField];
//     //     }
//     //   }
//     // }

//     return null;
//   };

//   // Helper function to format field values
//   const renderFieldValue = (field: FieldType, value: any): string => {
//     if (value === null || value === undefined) return '-';

//     // Currency formatting for cost/amount fields
//     if (field.field.includes('cost') || 
//         field.field.includes('amount') || 
//         field.field.includes('price')) {
//       const numValue = Number(value);
//       return isNaN(numValue) ? '-' : `₹${numValue.toLocaleString('en-IN')}`;
//     }

//     // Date formatting
//     if (field.type === 'date' && value) {
//       try {
//         return new Date(value).toLocaleDateString('en-IN');
//       } catch {
//         return String(value);
//       }
//     }

//     // Number formatting
//     if (field.type === 'number') {
//       const numValue = Number(value);
//       return isNaN(numValue) ? '-' : numValue.toLocaleString('en-IN');
//     }

//     return String(value);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       <div className="flex h-screen">
//         {/* Left Sidebar - PR List */}
//         <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
//           <div className="p-4 border-b border-slate-200 dark:border-slate-800">
//             <h2 className="text-lg font-bold">{approvalName}</h2>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               {prList.length} total Lists
//             </p>
//           </div>

//           <ScrollArea className="flex-1">
//             <div className="p-2 space-y-2">
//               {prList.map((pr: any) => {
//                 // Get viewable fields (excluding pr_no as it's shown in header)
//                 const viewableFields = sideCardFieldsForPr.filter(
//                   field => field.view && field.field !== 'pr_no'
//                 );

//                 // Get PR number value
//                 const prNumberField = sideCardFieldsForPr.find(f => f.field === 'pr_no');
//                 const prNumber = prNumberField 
//                   ? getFieldValue(pr, prNumberField) 
//                   : pr.prNumber || pr.pr_no;

//                 // Get employee name for subtitle
//                 const employeeField = sideCardFieldsForPr.find(f => f.field === 'ename');
//                 const employeeName = employeeField 
//                   ? getFieldValue(pr, employeeField) 
//                   : pr.requestor || pr.ename;

//                 return (
//                   <Card
//                     key={prNumber}
//                     className={`cursor-pointer transition-all hover:shadow-md ${
//                       selectedPR?.prNumber === prNumber || selectedPR?.pr_no === prNumber
//                         ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
//                         : ''
//                     }`}
//                     onClick={() => handlePRSelect(pr)}
//                   >
//                     <CardContent className="p-3">
//                       <div className="space-y-2">
//                         {/* Header */}
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <p className="font-semibold text-sm">{prNumber}</p>
//                             {employeeName && (
//                               <p className="text-xs text-slate-600 dark:text-slate-400">
//                                 {employeeName}
//                               </p>
//                             )}
//                           </div>
//                           <ChevronRight 
//                             className={`h-4 w-4 ${
//                               selectedPR?.prNumber === prNumber || selectedPR?.pr_no === prNumber
//                                 ? 'text-blue-600' 
//                                 : 'text-slate-400'
//                             }`} 
//                           />
//                         </div>

//                         {/* Dynamic Fields */}
//                         <div className="space-y-1">
//                           {viewableFields.map((field) => {
//                             const value = getFieldValue(pr, field);
//                             const displayValue = renderFieldValue(field, value);

//                             // Skip employee name field as it's already shown in header
//                             if (field.field === 'ename') return null;

//                             return (
//                               <div key={field.field} className="flex justify-between text-xs gap-2">
//                                 <span className="text-slate-600 dark:text-slate-400 flex-shrink-0">
//                                   {field.label}:
//                                 </span>
//                                 <span 
//                                   className={`${
//                                     field.field === 'total_cost' 
//                                       ? 'font-semibold' 
//                                       : 'font-medium'
//                                   } truncate text-right`}
//                                   title={displayValue}
//                                 >
//                                   {displayValue}
//                                 </span>
//                               </div>
//                             );
//                           })}

//                           {/* Optional: Items count if items array exists */}
//                           {pr.items && Array.isArray(pr.items) && (
//                             <div className="flex justify-between text-xs">
//                               <span className="text-slate-600 dark:text-slate-400">Items:</span>
//                               <span className="font-medium">{pr.items.length}</span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Description if available */}
//                         {(pr.description || pr.purpose) && (
//                           <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
//                             {pr.description || pr.purpose}
//                           </p>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Right Side - PR Details */}
//         <div className="flex-1 overflow-auto">
//           {!selectedPR ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center space-y-3">
//                 <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto" />
//                 <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
//                   No PR Selected
//                 </h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-500">
//                   Select a purchase requisition from the left panel to view details
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 md:p-6 lg:p-8">
//               <div className="mx-auto space-y-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between">
//                   <h1 className="text-3xl font-bold">PR Approval</h1>
//                   <Badge variant="outline" className="text-sm">
//                     <Clock className="mr-1 h-4 w-4" />
//                     Approval Pending
//                   </Badge>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Main PR Details */}
//                   <div className="lg:col-span-2 space-y-6">
//                     {/* PR Header Card */}
//                     <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//                       <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
//                         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 flex-wrap">
//                               <CardTitle className="text-2xl">
//                                 {selectedPR.prNumber || selectedPR.pr_no}
//                               </CardTitle>
//                               <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/20">
//                                 <Clock className="mr-1 h-3 w-3" />
//                                 {selectedPR.status}
//                               </Badge>
//                             </div>
//                             <CardDescription className="mt-2 text-base">
//                               {selectedPR.description}
//                             </CardDescription>
//                           </div>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="pt-6 space-y-6">
//                         {/* Requestor Info */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
//                             <User className="h-5 w-5 text-blue-600 mt-0.5" />
//                             <div>
//                               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Requestor
//                               </p>
//                               <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
//                                 {selectedPR.requestor || selectedPR.ename}
//                               </p>
//                               <p className="text-sm text-slate-600 dark:text-slate-400">
//                                 {selectedPR.department || selectedPR.dept}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
//                             <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
//                             <div>
//                               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Request Date
//                               </p>
//                               <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
//                                 {new Date(selectedPR.requestDate).toLocaleDateString('en-IN')}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
//                             <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
//                             <div>
//                               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Required By
//                               </p>
//                               <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
//                                 {new Date(selectedPR.requiredDate).toLocaleDateString('en-IN')}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
//                             <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
//                             <div>
//                               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
//                                 Total Amount
//                               </p>
//                               <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
//                                 ₹{(selectedPR.totalAmount || selectedPR.total_cost)?.toLocaleString('en-IN')}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <Separator />

//                         {/* Items Table */}
//                         <div>
//                           <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                             <FileText className="h-5 w-5" />
//                             Requested Items
//                           </h3>
//                           <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
//                             <table className="w-full">
//                               <thead className="bg-slate-100 dark:bg-slate-900">
//                                 <tr>
//                                   <th className="text-left p-3 text-sm font-semibold">Item Name</th>
//                                   <th className="text-left p-3 text-sm font-semibold">Specification</th>
//                                   <th className="text-right p-3 text-sm font-semibold">Quantity</th>
//                                   <th className="text-right p-3 text-sm font-semibold">Est. Price</th>
//                                   <th className="text-right p-3 text-sm font-semibold">Total</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
//                                 {selectedPR.items?.map((item: any) => (
//                                   <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
//                                     <td className="p-3 font-medium">{item.itemName}</td>
//                                     <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
//                                       {item.specification}
//                                     </td>
//                                     <td className="p-3 text-right">
//                                       {item.quantity} {item.unit}
//                                     </td>
//                                     <td className="p-3 text-right">
//                                       ₹{item.estimatedPrice?.toLocaleString('en-IN')}
//                                     </td>
//                                     <td className="p-3 text-right font-semibold">
//                                       ₹{(item.quantity * item.estimatedPrice)?.toLocaleString('en-IN')}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>

//                         {/* Quotations Summary - Only if quotations exist */}
//                         {selectedPR.quotations && selectedPR.quotations.length > 0 && (
//                           <div>
//                             <div className="flex items-center justify-between mb-4">
//                               <h3 className="text-lg font-semibold flex items-center gap-2">
//                                 <Scale className="h-5 w-5" />
//                                 Supplier Quotations ({selectedPR.quotations.length})
//                               </h3>
//                             </div>
//                           </div>
//                         )}

//                         {/* Attachments */}
//                         {selectedPR.attachments && selectedPR.attachments.length > 0 && (
//                           <div>
//                             <h3 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">
//                               Attachments
//                             </h3>
//                             <div className="flex flex-wrap gap-2">
//                               {selectedPR.attachments.map((file: string, index: number) => (
//                                 <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
//                                   <FileText className="mr-1 h-3 w-3" />
//                                   {file}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {/* Action Panel */}
//                   <div className="lg:col-span-1">
//                     <Card className="shadow-lg sticky top-6">
//                       <CardHeader>
//                         <CardTitle>Approval Actions</CardTitle>
//                         <CardDescription>
//                           Review the details and take action
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         {selectedPR.quotations && selectedPR.quotations.length > 0 && (
//                           <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
//                             <div className="flex items-start gap-2">
//                               <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
//                               <div className="text-sm">
//                                 <p className="font-medium text-blue-900 dark:text-blue-100">
//                                   Quotation Selection
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         <Button
//                           onClick={() => handleAction('approve')}
//                           className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                           size="lg"
//                         >
//                           <CheckCircle2 className="mr-2 h-5 w-5" />
//                           Approve Request
//                         </Button>

//                         <Button
//                           onClick={() => handleAction('reject')}
//                           variant="destructive"
//                           className="w-full h-12 text-base"
//                           size="lg"
//                         >
//                           <XCircle className="mr-2 h-5 w-5" />
//                           Reject Request
//                         </Button>

//                         <Separator className="my-4" />

//                         {/* Quick Info */}
//                         <div className="space-y-3 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-slate-600 dark:text-slate-400">Status</span>
//                             <Badge variant="outline">{selectedPR.status}</Badge>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-slate-600 dark:text-slate-400">Items</span>
//                             <span className="font-semibold">{selectedPR.items?.length}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-slate-600 dark:text-slate-400">Department</span>
//                             <span className="font-semibold">{selectedPR.department || selectedPR.dept}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-slate-600 dark:text-slate-400">Branch</span>
//                             <span className="font-semibold">{selectedPR.branch}</span>
//                           </div>
//                           {selectedPR.quotations && (
//                             <div className="flex justify-between">
//                               <span className="text-slate-600 dark:text-slate-400">Quotations</span>
//                               <span className="font-semibold">{selectedPR.quotations.length}</span>
//                             </div>
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Approval/Rejection Dialog */}
//       <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {actionType === 'approve' ? (
//                 <>
//                   <CheckCircle2 className="h-5 w-5 text-green-600" />
//                   Approve Purchase Requisition
//                 </>
//               ) : (
//                 <>
//                   <XCircle className="h-5 w-5 text-red-600" />
//                   Reject Purchase Requisition
//                 </>
//               )}
//             </DialogTitle>
//             <DialogDescription>
//               {actionType === 'approve'
//                 ? 'Add any comments or notes for this approval.'
//                 : 'Please provide a reason for rejecting this request.'}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             {actionType === 'approve' && (
//               <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
//                 <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
//                   Confirming Approval
//                 </p>
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="comments">
//                 Comments {actionType === 'reject' && '(Required)'}
//               </Label>
//               <Textarea
//                 id="comments"
//                 placeholder={
//                   actionType === 'approve'
//                     ? 'Enter any additional notes...'
//                     : 'Explain the reason for rejection...'
//                 }
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 rows={4}
//                 className="resize-none"
//               />
//             </div>

//             <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">PR Number</span>
//                 <span className="font-semibold">{selectedPR?.prNumber || selectedPR?.pr_no}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-600 dark:text-slate-400">Amount</span>
//                 <span className="font-semibold">
//                   ₹{(selectedPR?.totalAmount || selectedPR?.total_cost)?.toLocaleString('en-IN')}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowApprovalDialog(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={loading || (actionType === 'reject' && !comments.trim())}
//               className={
//                 actionType === 'approve'
//                   ? 'bg-green-600 hover:bg-green-700'
//                   : 'bg-red-600 hover:bg-red-700'
//               }
//             >
//               {loading ? (
//                 <>Loading...</>
//               ) : (
//                 <>
//                   {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default ApprovalScreenLayout;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, User, Calendar, DollarSign, FileText, ArrowRight, AlertCircle, ChevronRight, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePrApprovalSideCardDatas } from '@/FieldDatas/PrApprovalData';
import { FieldType } from '@/FieldDatas/SignUpData';
import { useMemo } from 'react';

interface ApprovalScreenLayoutProps {
  approvalName: string;
  prList: any[];
  selectedPR: any;
  handlePRSelect: (pr: any) => void;
  handleAction: (action: string) => void;
  showApprovalDialog: boolean;
  setShowApprovalDialog: (show: boolean) => void;
  action: string;
  comments: string;
  setComments: (comments: string) => void;
  handleSubmit: () => void;
  loading: boolean;
  actionType: 'approve' | 'reject';
}

function ApprovalScreenLayout({ approvalName, prList, selectedPR, handlePRSelect, handleAction, showApprovalDialog, setShowApprovalDialog, action,
  comments, setComments, handleSubmit, loading, actionType}: ApprovalScreenLayoutProps) {
  const sideCardFieldsForPr = usePrApprovalSideCardDatas();

  // Helper to parse items and calculate total
  const parseAndEnrichPR = (pr: any) => {
    if (!pr) return null;

    let parsedItems = [];
    let totalCost = 0;

    try {
      if (typeof pr.items === 'string') {
        parsedItems = JSON.parse(pr.items);
      } else if (Array.isArray(pr.items)) {
        parsedItems = pr.items;
      }

      totalCost = parsedItems.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.total_cost) || 0), 0
      );
    } catch (error) {
      console.error('Error parsing PR items:', error);
    }

    return {
      ...pr,
      parsedItems,
      totalCost,
      status: pr.status || 'Pending Approval'
    };
  };

  const enrichedSelectedPR = useMemo(() => 
    parseAndEnrichPR(selectedPR), [selectedPR]
  );

  const getFieldValue = (pr: any, field: FieldType): any => {
    if (pr[field.field] !== undefined && pr[field.field] !== null) {
      return pr[field.field];
    }
    return null;
  };

  const renderFieldValue = (field: FieldType, value: any): string => {
    if (value === null || value === undefined) return '-';

    if (field.field.includes('cost') || 
        field.field.includes('amount') || 
        field.field.includes('price')) {
      const numValue = Number(value);
      return isNaN(numValue) ? '-' : `₹${numValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    }

    if (field?.type === 'date' && value) {
      try {
        return new Date(value).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } catch {
        return String(value);
      }
    }

    if (field.type === 'number') {
      const numValue = Number(value);
      return isNaN(numValue) ? '-' : numValue.toLocaleString('en-IN');
    }

    return String(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar - PR List - UPDATED FOR BETTER SCROLLING */}
        <div className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{approvalName}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {prList.length} pending request{prList.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Scrollable PR List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                {prList.map((pr: any) => {
                  const enrichedPR = parseAndEnrichPR(pr);
                  
                  const viewableFields = sideCardFieldsForPr.filter(
                    field => field.view && field.field !== 'pr_no' && field.field !== 'ename'
                  );

                  const isSelected = selectedPR?.pr_no === pr.pr_no;

                  return (
                    <Card
                      key={pr.pr_no}
                      className={`cursor-pointer transition-all hover:shadow-md border ${
                        isSelected
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      onClick={() => handlePRSelect(pr)}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2.5">
                          {/* Header with PR Number and Employee */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-900 dark:text-slate-50 truncate">
                                {pr.pr_no}
                              </p>
                              {pr.ename && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                                  {pr.ename}
                                </p>
                              )}
                            </div>
                            <ChevronRight 
                              className={`h-4 w-4 flex-shrink-0 transition-transform ${
                                isSelected 
                                  ? 'text-blue-600 dark:text-blue-400 transform translate-x-0.5' 
                                  : 'text-slate-400 dark:text-slate-600'
                              }`} 
                            />
                          </div>

                          {/* Dynamic Fields - Limited to key fields */}
                          <div className="space-y-1.5 text-xs">
                            {/* Priority Badge */}
                            {pr.priority_name && (
                              <div className="flex items-center gap-1.5">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    pr.priority_name === 'High' 
                                      ? 'bg-red-50 dark:bg-red-950/20 border-red-300 text-red-700 dark:text-red-400'
                                      : pr.priority_name === 'Medium'
                                      ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 text-yellow-700 dark:text-yellow-400'
                                      : 'bg-green-50 dark:bg-green-950/20 border-green-300 text-green-700 dark:text-green-400'
                                  }`}
                                >
                                  {pr.priority_name}
                                </Badge>
                              </div>
                            )}

                            {/* Branch and Department */}
                            {pr.brn_name && (
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-600 dark:text-slate-400">Branch:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-50 truncate text-right" title={pr.brn_name}>
                                  {pr.brn_name}
                                </span>
                              </div>
                            )}

                            {pr.dept_name && (
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-600 dark:text-slate-400">Dept:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-50 truncate text-right" title={pr.dept_name}>
                                  {pr.dept_name}
                                </span>
                              </div>
                            )}

                            {/* Dates */}
                            {pr.reg_date && (
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-600 dark:text-slate-400">Created:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                  {formatDate(pr.reg_date)}
                                </span>
                              </div>
                            )}

                            {pr.required_date && (
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-600 dark:text-slate-400">Required:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-50">
                                  {formatDate(pr.required_date)}
                                </span>
                              </div>
                            )}

                            <Separator className="my-1.5" />

                            {/* Items count and total */}
                            {enrichedPR && (
                              <>
                                <div className="flex justify-between gap-2">
                                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    Items:
                                  </span>
                                  <span className="font-medium text-slate-900 dark:text-slate-50">
                                    {enrichedPR.parsedItems.length}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-2 pt-0.5">
                                  <span className="text-slate-600 dark:text-slate-400 font-medium">Total:</span>
                                  <span className="font-bold text-green-600 dark:text-green-400">
                                    ₹{enrichedPR.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Purpose/Description */}
                          {pr.purpose && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
                                {pr.purpose}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Side - PR Details */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          {!enrichedSelectedPR ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">
                  No PR Selected
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Select a purchase requisition from the left panel to view details
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-6 lg:p-8">
              <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h1 className="text-3xl font-bold">Purchase Requisition</h1>
                  <Badge variant="outline" className="text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    {enrichedSelectedPR.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main PR Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* PR Header Card */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <CardTitle className="text-2xl">
                                {enrichedSelectedPR.pr_no}
                              </CardTitle>
                              <Badge 
                                variant="outline" 
                                className={
                                  enrichedSelectedPR.priority_name === 'High' 
                                    ? 'bg-red-50 dark:bg-red-950/20 border-red-300 text-red-700 dark:text-red-400'
                                    : enrichedSelectedPR.priority_name === 'Medium'
                                    ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-green-50 dark:bg-green-950/20 border-green-300 text-green-700 dark:text-green-400'
                                }
                              >
                                <AlertCircle className="mr-1 h-3 w-3" />
                                {enrichedSelectedPR.priority_name} Priority
                              </Badge>
                            </div>
                            <CardDescription className="mt-2 text-base">
                              {enrichedSelectedPR.purpose}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 space-y-6">
                        {/* Requestor Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Requestor
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                                {enrichedSelectedPR.ename}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {enrichedSelectedPR.dept_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Package className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Branch
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                                {enrichedSelectedPR.brn_name}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {enrichedSelectedPR.BRANCH}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Request Date
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                {formatDate(enrichedSelectedPR.reg_date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Calendar className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Required By
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                {formatDate(enrichedSelectedPR.required_date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Items Table */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Requested Items ({enrichedSelectedPR.parsedItems.length})
                          </h3>
                          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full">
                              <thead className="bg-slate-100 dark:bg-slate-900">
                                <tr>
                                  <th className="text-left p-3 text-sm font-semibold">S.No</th>
                                  <th className="text-left p-3 text-sm font-semibold">Product Name</th>
                                  <th className="text-left p-3 text-sm font-semibold">Branch</th>
                                  <th className="text-left p-3 text-sm font-semibold">Department</th>
                                  <th className="text-right p-3 text-sm font-semibold">Quantity</th>
                                  <th className="text-right p-3 text-sm font-semibold">Est. Cost</th>
                                  <th className="text-right p-3 text-sm font-semibold">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {enrichedSelectedPR.parsedItems.map((item: any, index: number) => (
                                  <tr key={item.prod_sno || index} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{index + 1}</td>
                                    <td className="p-3">
                                      <div className="font-medium">{item.prod_name}</div>
                                      <div className="text-xs text-slate-600 dark:text-slate-400">
                                        {item.priority_name} Priority
                                      </div>
                                    </td>
                                    <td className="p-3 text-sm">{item.brn_name}</td>
                                    <td className="p-3 text-sm">{item.dept_name}</td>
                                    <td className="p-3 text-right">
                                      <span className="font-medium">{parseFloat(item.qty).toLocaleString('en-IN')}</span>
                                      <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">
                                        {item.uom_name}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      ₹{parseFloat(item.est_cost).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-right font-semibold">
                                      ₹{parseFloat(item.total_cost).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 dark:bg-slate-900 font-semibold">
                                  <td colSpan={6} className="p-3 text-right">Grand Total:</td>
                                  <td className="p-3 text-right text-green-600 dark:text-green-400">
                                    ₹{enrichedSelectedPR.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Panel */}
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg sticky top-6">
                      <CardHeader>
                        <CardTitle>Approval Actions</CardTitle>
                        <CardDescription>
                          Review the details and take action
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          onClick={() => handleAction('approve')}
                          className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          size="lg"
                        >
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Approve Request
                        </Button>

                        <Button
                          onClick={() => handleAction('reject')}
                          variant="destructive"
                          className="w-full h-12 text-base"
                          size="lg"
                        >
                          <XCircle className="mr-2 h-5 w-5" />
                          Reject Request
                        </Button>

                        <Separator className="my-4" />

                        {/* Quick Info */}
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Status</span>
                            <Badge variant="outline">{enrichedSelectedPR.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Priority</span>
                            <Badge 
                              variant="outline"
                              className={
                                enrichedSelectedPR.priority_name === 'High' 
                                  ? 'bg-red-50 dark:bg-red-950/20'
                                  : enrichedSelectedPR.priority_name === 'Medium'
                                  ? 'bg-yellow-50 dark:bg-yellow-950/20'
                                  : 'bg-green-50 dark:bg-green-950/20'
                              }
                            >
                              {enrichedSelectedPR.priority_name}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Items</span>
                            <span className="font-semibold">{enrichedSelectedPR.parsedItems.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Department</span>
                            <span className="font-semibold truncate ml-2" title={enrichedSelectedPR.dept_name}>
                              {enrichedSelectedPR.dept_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Branch</span>
                            <span className="font-semibold">{enrichedSelectedPR.brn_name}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                ₹{enrichedSelectedPR.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Approve Purchase Requisition
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Reject Purchase Requisition
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Add any comments or notes for this approval.'
                : 'Please provide a reason for rejecting this request.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === 'approve' && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                  Confirming Approval
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  This requisition will proceed to the next stage
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments {actionType === 'reject' && <span className="text-red-600">*</span>}
              </Label>
              <Textarea
                id="comments"
                placeholder={
                  actionType === 'approve'
                    ? 'Enter any additional notes...'
                    : 'Explain the reason for rejection...'
                }
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {enrichedSelectedPR && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">PR Number</span>
                  <span className="font-semibold">{enrichedSelectedPR.pr_no}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Requestor</span>
                  <span className="font-semibold">{enrichedSelectedPR.ename}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₹{enrichedSelectedPR.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || (actionType === 'reject' && !comments.trim())}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApprovalScreenLayout;

