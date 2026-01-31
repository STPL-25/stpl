// // ApprovalLayout.tsx
// import React, { useState, ReactNode } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { CheckCircle2, XCircle, Clock, FileText, ArrowRight, AlertCircle, ChevronRight } from 'lucide-react';

// // Generic type parameters for flexibility
// export interface ApprovalItem<T = any> {
//   id: string;
//   [key: string]: any;
// }

// export interface ApprovalRecord<TItem = any, TMetadata = any> {
//   id: string;
//   status: 'Pending' | 'Approved' | 'Rejected';
//   priority?: 'High' | 'Medium' | 'Low';
//   metadata: TMetadata;
//   items?: TItem[];
//   [key: string]: any;
// }

// export interface ApprovalAction {
//   type: 'approve' | 'reject';
//   recordId: string;
//   comments: string;
//   additionalData?: any;
// }

// // Configuration interface for customization
// export interface ApprovalLayoutConfig<TRecord, TItem> {
//   // Data
//   records: TRecord[];
//   selectedRecord: TRecord | null;
  
//   // Display customization
//   title: string;
//   emptyStateMessage?: string;
//   emptyStateIcon?: ReactNode;
  
//   // Render functions for custom content
//   renderListCard: (record: TRecord, isSelected: boolean, onSelect: () => void) => ReactNode;
//   renderDetailHeader: (record: TRecord) => ReactNode;
//   renderDetailContent: (record: TRecord) => ReactNode;
//   renderActionPanel: (record: TRecord) => ReactNode;
  
//   // Optional additional sections
//   renderBeforeActions?: (record: TRecord) => ReactNode;
//   renderAfterDetails?: (record: TRecord) => ReactNode;
  
//   // Callbacks
//   onRecordSelect: (record: TRecord) => void;
//   onApprove: (action: ApprovalAction) => Promise<void>;
//   onReject: (action: ApprovalAction) => Promise<void>;
  
//   // Validation
//   canApprove?: (record: TRecord) => { valid: boolean; message?: string };
  
//   // Loading states
//   loading?: boolean;
//   error?: string;
// }

// export function ApprovalLayout<TRecord extends ApprovalRecord, TItem extends ApprovalItem>(
//   config: ApprovalLayoutConfig<TRecord, TItem>
// ) {
//   const [showApprovalDialog, setShowApprovalDialog] = useState(false);
//   const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
//   const [comments, setComments] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const { records, selectedRecord,  title, emptyStateMessage = 'No records selected',  emptyStateIcon = <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto" />,
//           renderListCard,renderDetailHeader,  renderDetailContent, renderActionPanel,  renderBeforeActions, renderAfterDetails,  onRecordSelect,
//           onApprove, onReject, canApprove, loading = false,  error, } = config;

//   const handleAction = (action: 'approve' | 'reject') => {
//     setActionType(action);
//     setShowApprovalDialog(true);
//   };

//   const handleSubmit = async () => {
//     if (!selectedRecord) return;

//     const action: ApprovalAction = {
//       type: actionType,
//       recordId: selectedRecord.id,
//       comments,
//     };

//     setSubmitting(true);
//     try {
//       if (actionType === 'approve') {
//         await onApprove(action);
//       } else {
//         await onReject(action);
//       }
//       setShowApprovalDialog(false);
//       setComments('');
//     } catch (error) {
//       console.error('Error submitting approval:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
//           <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Error Loading Data</h3>
//           <p className="text-sm text-slate-500">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
//         <div className="text-center space-y-3">
//           <Clock className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto animate-spin" />
//           <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Loading...</h3>
//         </div>
//       </div>
//     );
//   }

//   const validationResult = selectedRecord && canApprove ? canApprove(selectedRecord) : { valid: true };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       <div className="flex h-screen">
//         {/* Left Sidebar - Record List */}
//         <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
//           <div className="p-4 border-b border-slate-200 dark:border-slate-800">
//             <h2 className="text-lg font-bold">{title}</h2>
//             <p className="text-sm text-slate-600 dark:text-slate-400">{records.length} total records</p>
//           </div>

//           <ScrollArea className="flex-1">
//             <div className="p-2 space-y-2">
//               {records.map((record) => renderListCard(record, selectedRecord?.id === record.id, () => onRecordSelect(record)))}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Right Side - Record Details */}
//         <div className="flex-1 overflow-auto">
//           {!selectedRecord ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center space-y-3">
//                 {emptyStateIcon}
//                 <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">No Record Selected</h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-500">{emptyStateMessage}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 md:p-6 lg:p-8">
//               <div className="mx-auto space-y-6">
//                 {/* Header */}
//                 {renderDetailHeader(selectedRecord)}

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Main Details */}
//                   <div className="lg:col-span-2 space-y-6">
//                     {renderDetailContent(selectedRecord)}
//                     {/* {renderAfterDetails && renderAfterDetails(selectedRecord)} */}
//                   </div>

//                   {/* Action Panel */}
//                   <div className="lg:col-span-1">
//                     <Card className="shadow-lg sticky top-6">
//                       <CardHeader>
//                         <CardTitle>Approval Actions</CardTitle>
//                         <CardDescription>Review the details and take action</CardDescription>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         {/* {renderBeforeActions && renderBeforeActions(selectedRecord)} */}

//                         {!validationResult.valid && (
//                           <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
//                             <div className="flex items-start gap-2">
//                               <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
//                               <p className="text-sm text-amber-900 dark:text-amber-100">{validationResult.message}</p>
//                             </div>
//                           </div>
//                         )}

//                         <Button
//                           onClick={() => handleAction('approve')}
//                           className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                           size="lg"
//                           disabled={!validationResult.valid}
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

//                         {renderActionPanel(selectedRecord)}
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
//                   Approve Record
//                 </>
//               ) : (
//                 <>
//                   <XCircle className="h-5 w-5 text-red-600" />
//                   Reject Record
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
//             <div className="space-y-2">
//               <Label htmlFor="comments">Comments {actionType === 'reject' && '(Required)'}</Label>
//               <Textarea
//                 id="comments"
//                 placeholder={actionType === 'approve' ? 'Enter any additional notes...' : 'Explain the reason for rejection...'}
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 rows={4}
//                 className="resize-none"
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowApprovalDialog(false)} disabled={submitting}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={submitting || (actionType === 'reject' && !comments.trim())}
//               className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
//             >
//               {submitting ? (
//                 <>Processing...</>
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



function ApprovalScreenLayout() {
   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Left Sidebar - PR List */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold">Purchase Requisitions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{prList.length} total requests</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {prList.map((pr) => (
                <Card
                  key={pr.prNumber}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPR?.prNumber === pr.prNumber
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : ''
                  }`}
                  onClick={() => handlePRSelect(pr)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{pr.prNumber}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{pr.requestor}</p>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${selectedPR?.prNumber === pr.prNumber ? 'text-blue-600' : 'text-slate-400'}`} />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Badge variant={getPriorityColor(pr.priority)} className="text-xs">
                          {pr.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(pr.status)}`}>
                          {pr.status}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Department:</span>
                          <span className="font-medium">{pr.department}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                          <span className="font-semibold">₹{pr.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Items:</span>
                          <span className="font-medium">{pr.items.length}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                        {pr.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - PR Details */}
        <div className="flex-1 overflow-auto">
          {!selectedPR ? (
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
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">PR Approval</h1>
                  <Badge variant="outline" className="text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    Approval Pending
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
                                {selectedPR.prNumber}
                              </CardTitle>
                              <Badge variant={getPriorityColor(selectedPR.priority)}>
                                {selectedPR.priority} Priority
                              </Badge>
                              <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/20">
                                <Clock className="mr-1 h-3 w-3" />
                                {selectedPR.status}
                              </Badge>
                            </div>
                            <CardDescription className="mt-2 text-base">
                              {selectedPR.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 space-y-6">
                        {/* Requestor Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <User className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Requestor
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                {selectedPR.requestor}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {selectedPR.department}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Request Date
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                {new Date(selectedPR.requestDate).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Required By
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                {new Date(selectedPR.requiredDate).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Amount
                              </p>
                              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                                ₹{selectedPR.totalAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Items Table */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Requested Items
                          </h3>
                          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full">
                              <thead className="bg-slate-100 dark:bg-slate-900">
                                <tr>
                                  <th className="text-left p-3 text-sm font-semibold">Item Name</th>
                                  <th className="text-left p-3 text-sm font-semibold">Specification</th>
                                  <th className="text-right p-3 text-sm font-semibold">Quantity</th>
                                  <th className="text-right p-3 text-sm font-semibold">Est. Price</th>
                                  <th className="text-right p-3 text-sm font-semibold">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {selectedPR.items.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="p-3 font-medium">{item.itemName}</td>
                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
                                      {item.specification}
                                    </td>
                                    <td className="p-3 text-right">
                                      {item.quantity} {item.unit}
                                    </td>
                                    <td className="p-3 text-right">
                                      ₹{item.estimatedPrice.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 text-right font-semibold">
                                      ₹{(item.quantity * item.estimatedPrice).toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Quotations Summary - Only if quotations exist */}
                        {selectedPR.quotations && selectedPR.quotations.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Scale className="h-5 w-5" />
                                Supplier Quotations ({selectedPR.quotations.length})
                              </h3>
                              <Button 
                                variant="outline" 
                                onClick={() => setShowComparisonDialog(true)}
                                className="gap-2"
                              >
                                <Scale className="h-4 w-4" />
                                Compare Quotations
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {selectedPR.quotations.map((quotation) => (
                                <Card 
                                  key={quotation.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md ${
                                    selectedQuotation === quotation.id 
                                      ? 'ring-2 ring-blue-500 shadow-md' 
                                      : ''
                                  } ${quotation.isRecommended ? 'border-green-500' : ''}`}
                                  onClick={() => setSelectedQuotation(quotation.id)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <p className="font-semibold text-sm">{quotation.supplierName}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                          {quotation.quotationNumber}
                                        </p>
                                      </div>
                                      {quotation.isRecommended && (
                                        <Badge variant="default" className="bg-green-600 text-xs">
                                          <Star className="h-3 w-3 mr-1" />
                                          Recommended
                                        </Badge>
                                      )}
                                      {getBestValue(quotation) && !quotation.isRecommended && (
                                        <Badge variant="default" className="bg-blue-600 text-xs">
                                          <TrendingDown className="h-3 w-3 mr-1" />
                                          Best Price
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Total Amount</span>
                                        <span className="text-lg font-bold">
                                          ₹{quotation.totalAmount.toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Delivery</span>
                                        <span className="font-medium">{quotation.deliveryTerms}</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Payment</span>
                                        <span className="font-medium">{quotation.paymentTerms}</span>
                                      </div>
                                      {quotation.rating && (
                                        <div className="flex items-center gap-1 text-xs">
                                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          <span className="font-medium">{quotation.rating}/5</span>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {selectedPR.attachments && selectedPR.attachments.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">
                              Attachments
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedPR.attachments.map((file, index) => (
                                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800">
                                  <FileText className="mr-1 h-3 w-3" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
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
                        {selectedPR.quotations && selectedPR.quotations.length > 0 && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                  Quotation Selection
                                </p>
                                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                                  {selectedQuotation 
                                    ? 'Quotation selected for approval' 
                                    : 'Please select a quotation before approving'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={() => handleAction('approve')}
                          className="w-full h-12 text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          size="lg"
                          disabled={selectedPR.quotations && selectedPR.quotations.length > 0 && !selectedQuotation}
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
                            <Badge variant="outline">{selectedPR.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Items</span>
                            <span className="font-semibold">{selectedPR.items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Department</span>
                            <span className="font-semibold">{selectedPR.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Branch</span>
                            <span className="font-semibold">{selectedPR.branch}</span>
                          </div>
                          {selectedPR.quotations && (
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Quotations</span>
                              <span className="font-semibold">{selectedPR.quotations.length}</span>
                            </div>
                          )}
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
            {actionType === 'approve' && selectedQuotation && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                  Selected Quotation
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {selectedPR?.quotations?.find(q => q.id === selectedQuotation)?.supplierName}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments {actionType === 'reject' && '(Required)'}
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

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">PR Number</span>
                <span className="font-semibold">{selectedPR?.prNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Amount</span>
                <span className="font-semibold">₹{selectedPR?.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
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
                <>Loading...</>
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
