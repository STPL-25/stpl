import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, User, Calendar, DollarSign, FileText, ArrowRight, Scale, Star, AlertCircle, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PRItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  specification: string;
}

interface SupplierQuotationItem {
  itemId: string;
  unitPrice: number;
  totalPrice: number;
  leadTime: string;
  availability: 'In Stock' | 'On Order' | 'Custom';
  warranty?: string;
  specifications?: string;
}

interface SupplierQuotation {
  id: string;
  supplierName: string;
  supplierCode: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  totalAmount: number;
  items: SupplierQuotationItem[];
  shippingCost: number;
  taxAmount: number;
  discount?: number;
  notes?: string;
  rating?: number;
  isRecommended?: boolean;
}

interface PRData {
  prNumber: string;
  requestor: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  totalAmount: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string;
  items: PRItem[];
  attachments?: string[];
  quotations?: SupplierQuotation[];
}

const PRApprovalScreen: React.FC = () => {
  const [selectedPR, setSelectedPR] = useState<PRData | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);

  // Sample PR List - Multiple PRs for selection
  const prList: PRData[] = [
    {
      prNumber: 'PR-2026-0107',
      requestor: 'Rajesh Kumar',
      department: 'Production',
      requestDate: '2026-01-05',
      requiredDate: '2026-01-15',
      totalAmount: 125000,
      priority: 'High',
      status: 'Pending',
      description: 'Raw materials required for Q1 production schedule',
      items: [
        {
          id: '1',
          itemName: 'Gold Wire 24K',
          quantity: 500,
          unit: 'grams',
          estimatedPrice: 3000,
          specification: '99.9% purity'
        },
        {
          id: '2',
          itemName: 'Diamond Pieces',
          quantity: 20,
          unit: 'pieces',
          estimatedPrice: 5000,
          specification: '0.5 carat each'
        }
      ],
      attachments: ['specification.pdf', 'quotation.pdf'],
      quotations: [
        {
          id: 'Q1',
          supplierName: 'Premium Gold Suppliers Pvt Ltd',
          supplierCode: 'SUP-001',
          quotationNumber: 'QTN-2026-001',
          quotationDate: '2026-01-06',
          validUntil: '2026-01-20',
          paymentTerms: '30 days credit',
          deliveryTerms: '7-10 business days',
          totalAmount: 120000,
          shippingCost: 2000,
          taxAmount: 21600,
          discount: 5000,
          isRecommended: true,
          rating: 4.5,
          notes: 'Preferred vendor with consistent quality',
          items: [
            {
              itemId: '1',
              unitPrice: 230,
              totalPrice: 115000,
              leadTime: '7 days',
              availability: 'In Stock',
              warranty: '6 months',
              specifications: '99.9% purity certified'
            },
            {
              itemId: '2',
              unitPrice: 4800,
              totalPrice: 96000,
              leadTime: '5 days',
              availability: 'In Stock',
              warranty: '1 year',
              specifications: 'GIA certified, 0.5 carat'
            }
          ]
        },
        {
          id: 'Q2',
          supplierName: 'Gold Trade International',
          supplierCode: 'SUP-002',
          quotationNumber: 'QTN-2026-045',
          quotationDate: '2026-01-06',
          validUntil: '2026-01-15',
          paymentTerms: '45 days credit',
          deliveryTerms: '10-14 business days',
          totalAmount: 118000,
          shippingCost: 3000,
          taxAmount: 21240,
          rating: 4.2,
          items: [
            {
              itemId: '1',
              unitPrice: 225,
              totalPrice: 112500,
              leadTime: '10 days',
              availability: 'On Order',
              warranty: '3 months',
              specifications: '99.9% purity'
            },
            {
              itemId: '2',
              unitPrice: 4700,
              totalPrice: 94000,
              leadTime: '8 days',
              availability: 'In Stock',
              warranty: '6 months',
              specifications: 'Certified, 0.5 carat'
            }
          ]
        }
      ]
    },
    {
      prNumber: 'PR-2026-0108',
      requestor: 'Priya Sharma',
      department: 'Marketing',
      requestDate: '2026-01-10',
      requiredDate: '2026-01-25',
      totalAmount: 85000,
      priority: 'Medium',
      status: 'Pending',
      description: 'Office supplies and promotional materials',
      items: [
        {
          id: '1',
          itemName: 'Promotional Banners',
          quantity: 50,
          unit: 'pieces',
          estimatedPrice: 500,
          specification: '6x4 feet flex banners'
        },
        {
          id: '2',
          itemName: 'Business Cards',
          quantity: 5000,
          unit: 'pieces',
          estimatedPrice: 1000,
          specification: 'Premium quality with embossing'
        }
      ],
      attachments: ['design.pdf'],
      quotations: []
    },
    {
      prNumber: 'PR-2026-0109',
      requestor: 'Amit Patel',
      department: 'IT',
      requestDate: '2026-01-12',
      requiredDate: '2026-01-20',
      totalAmount: 250000,
      priority: 'High',
      status: 'Pending',
      description: 'Server upgrade and networking equipment',
      items: [
        {
          id: '1',
          itemName: 'Dell PowerEdge Server',
          quantity: 2,
          unit: 'units',
          estimatedPrice: 100000,
          specification: 'R750 with 64GB RAM'
        }
      ],
      attachments: ['tech-specs.pdf'],
      quotations: []
    },
    {
      prNumber: 'PR-2026-0106',
      requestor: 'Sanjay Gupta',
      department: 'Finance',
      requestDate: '2026-01-03',
      requiredDate: '2026-01-10',
      totalAmount: 45000,
      priority: 'Low',
      status: 'Approved',
      description: 'Office furniture and fixtures',
      items: [
        {
          id: '1',
          itemName: 'Ergonomic Chairs',
          quantity: 10,
          unit: 'pieces',
          estimatedPrice: 4500,
          specification: 'Adjustable with lumbar support'
        }
      ],
      attachments: [],
      quotations: []
    }
  ];

  const handlePRSelect = (pr: PRData) => {
    setSelectedPR(pr);
    setSelectedQuotation(null);
  };

  const handleAction = (action: 'approve' | 'reject') => {
    setActionType(action);
    setShowApprovalDialog(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      prNumber: selectedPR?.prNumber,
      action: actionType,
      comments,
      selectedQuotationId: selectedQuotation
    };
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setShowApprovalDialog(false);
    setComments('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLowestPrice = () => {
    if (!selectedPR?.quotations || selectedPR.quotations.length === 0) return null;
    return Math.min(...selectedPR.quotations.map(q => q.totalAmount));
  };

  const getBestValue = (quotation: SupplierQuotation) => {
    const lowestPrice = getLowestPrice();
    if (!lowestPrice) return false;
    return quotation.totalAmount === lowestPrice;
  };

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

                        {/* Quotations Summary */}
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

      {/* Quotation Comparison Dialog */}
      <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Compare Supplier Quotations
            </DialogTitle>
            <DialogDescription>
              Compare pricing, terms, and specifications across all supplier quotations
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Item Details</TabsTrigger>
              <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900">
                      <th className="p-3 text-left text-sm font-semibold border">Criteria</th>
                      {selectedPR?.quotations?.map((quotation) => (
                        <th key={quotation.id} className="p-3 text-left text-sm font-semibold border">
                          <div className="space-y-1">
                            <p className="font-bold">{quotation.supplierName}</p>
                            <p className="text-xs font-normal text-slate-600 dark:text-slate-400">
                              {quotation.quotationNumber}
                            </p>
                            {quotation.isRecommended && (
                              <Badge variant="default" className="bg-green-600 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Total Amount</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              ₹{quotation.totalAmount.toLocaleString('en-IN')}
                            </span>
                            {getBestValue(quotation) && (
                              <Badge variant="default" className="bg-blue-600 text-xs">
                                Best Price
                              </Badge>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Shipping Cost</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          ₹{quotation.shippingCost.toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Tax Amount</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          ₹{quotation.taxAmount.toLocaleString('en-IN')}
                        </td>
                      ))}
                    </tr>
                    {selectedPR?.quotations?.some(q => q.discount) && (
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-semibold border">Discount</td>
                        {selectedPR?.quotations?.map((quotation) => (
                          <td key={quotation.id} className="p-3 border text-green-600">
                            {quotation.discount 
                              ? `- ₹${quotation.discount.toLocaleString('en-IN')}` 
                              : '-'}
                          </td>
                        ))}
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Payment Terms</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          {quotation.paymentTerms}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Delivery Terms</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          {quotation.deliveryTerms}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-semibold border">Valid Until</td>
                      {selectedPR?.quotations?.map((quotation) => (
                        <td key={quotation.id} className="p-3 border">
                          {new Date(quotation.validUntil).toLocaleDateString('en-IN')}
                        </td>
                      ))}
                    </tr>
                    {selectedPR?.quotations?.some(q => q.rating) && (
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="p-3 font-semibold border">Supplier Rating</td>
                        {selectedPR?.quotations?.map((quotation) => (
                          <td key={quotation.id} className="p-3 border">
                            {quotation.rating ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{quotation.rating}/5</span>
                              </div>
                            ) : '-'}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              {selectedPR?.items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.itemName}</CardTitle>
                    <CardDescription>
                      Required: {item.quantity} {item.unit} | {item.specification}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-900">
                            <th className="p-2 text-left text-sm font-semibold border">Supplier</th>
                            <th className="p-2 text-right text-sm font-semibold border">Unit Price</th>
                            <th className="p-2 text-right text-sm font-semibold border">Total Price</th>
                            <th className="p-2 text-left text-sm font-semibold border">Lead Time</th>
                            <th className="p-2 text-left text-sm font-semibold border">Availability</th>
                            <th className="p-2 text-left text-sm font-semibold border">Warranty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedPR?.quotations?.map((quotation) => {
                            const quotationItem = quotation.items.find(i => i.itemId === item.id);
                            if (!quotationItem) return null;
                            
                            const isLowest = selectedPR?.quotations?.every(q => {
                              const otherItem = q.items.find(i => i.itemId === item.id);
                              return !otherItem || quotationItem.unitPrice <= otherItem.unitPrice;
                            });

                            return (
                              <tr key={quotation.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                <td className="p-2 border font-medium">{quotation.supplierName}</td>
                                <td className="p-2 border text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <span>₹{quotationItem.unitPrice.toLocaleString('en-IN')}</span>
                                    {isLowest && (
                                      <Badge variant="default" className="bg-green-600 text-xs">
                                        Lowest
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2 border text-right font-semibold">
                                  ₹{quotationItem.totalPrice.toLocaleString('en-IN')}
                                </td>
                                <td className="p-2 border">{quotationItem.leadTime}</td>
                                <td className="p-2 border">
                                  <Badge 
                                    variant={quotationItem.availability === 'In Stock' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {quotationItem.availability}
                                  </Badge>
                                </td>
                                <td className="p-2 border text-sm">{quotationItem.warranty || '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedPR?.quotations?.map((quotation) => (
                  <Card key={quotation.id} className={quotation.isRecommended ? 'border-green-500' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{quotation.supplierName}</CardTitle>
                        {quotation.isRecommended && (
                          <Badge variant="default" className="bg-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{quotation.supplierCode}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Payment Terms
                        </p>
                        <p className="text-sm">{quotation.paymentTerms}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Delivery Terms
                        </p>
                        <p className="text-sm">{quotation.deliveryTerms}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Quotation Date
                        </p>
                        <p className="text-sm">{new Date(quotation.quotationDate).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Valid Until
                        </p>
                        <p className="text-sm">{new Date(quotation.validUntil).toLocaleDateString('en-IN')}</p>
                      </div>
                      {quotation.notes && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{quotation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex-1 text-sm text-slate-600 dark:text-slate-400">
              Select a quotation from the overview to proceed with approval
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowComparisonDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
};

export default PRApprovalScreen;
