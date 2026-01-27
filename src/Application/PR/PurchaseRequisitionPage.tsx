// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
// import { format } from 'date-fns';
// import type {RequisitionItem} from "./types/PurchaseRequisitionPageTypes";


// const PurchaseRequisitionPage: React.FC = () => {
//   const [requiredDate, setRequiredDate] = useState<Date>();
//   const [requestDate, setRequestDate] = useState<Date>(new Date());
//   const [errors, setErrors] = useState<Record<string, string>>({});
  
//   const [formData, setFormData] = useState({
//     requestedBy: '',
//     department: '',
//     costCenter: '',
//     priority: '',
//     purpose: '',
//   });

//   const [items, setItems] = useState<RequisitionItem[]>([
//     {
//       id: '1',
//       itemDescription: '',
//       specification: '',
//       quantity: 1,
//       unit: 'pcs',
//       estimatedCost: 0,
//       totalCost: 0,
//       remarks: '',
//     },
//   ]);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: '' });
//     }
//   };

//   const handleItemChange = (id: string, field: keyof RequisitionItem, value: any) => {
//     setItems(items.map(item => {
//       if (item.id === id) {
//         const updatedItem = { ...item, [field]: value };
//         if (field === 'quantity' || field === 'estimatedCost') {
//           updatedItem.totalCost = updatedItem.quantity * updatedItem.estimatedCost;
//         }
//         return updatedItem;
//       }
//       return item;
//     }));
//   };

//   const addItem = () => {
//     const newItem: RequisitionItem = {
//       id: Date.now().toString(),
//       itemDescription: '',
//       specification: '',
//       quantity: 1,
//       unit: 'pcs',
//       estimatedCost: 0,
//       totalCost: 0,
//       remarks: '',
//     };
//     setItems([...items, newItem]);
//   };

//   const removeItem = (id: string) => {
//     if (items.length > 1) {
//       setItems(items.filter(item => item.id !== id));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.requestedBy.trim()) {
//       newErrors.requestedBy = 'Requested by is required';
//     }
//     if (!formData.department.trim()) {
//       newErrors.department = 'Department is required';
//     }
//     if (!formData.costCenter.trim()) {
//       newErrors.costCenter = 'Cost center is required';
//     }
//     if (!formData.priority) {
//       newErrors.priority = 'Priority is required';
//     }
//     if (!requiredDate) {
//       newErrors.requiredDate = 'Required date is required';
//     }
//     if (!formData.purpose.trim()) {
//       newErrors.purpose = 'Purpose is required';
//     }

//     // Validate items
//     items.forEach((item, index) => {
//       if (!item.itemDescription.trim()) {
//         newErrors[`item_${index}_description`] = 'Item description is required';
//       }
//       if (item.quantity <= 0) {
//         newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       const requisitionData = {
//         ...formData,
//         requestDate,
//         requiredDate,
//         items,
//         totalAmount: items.reduce((sum, item) => sum + item.totalCost, 0),
//       };
      
//       console.log('Requisition Data:', requisitionData);
//       // Handle form submission (API call)
//       alert('Purchase Requisition submitted successfully!');
//     }
//   };

//   const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0);

//   return (
//     <div className="container mx-auto py-8  ">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Purchase Requisition - Non Trade</CardTitle>
//           <CardDescription>
//             Submit a purchase requisition for non-trade items
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="requestedBy">
//                   Requested By <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="requestedBy"
//                   value={formData.requestedBy}
//                   onChange={(e) => handleInputChange('requestedBy', e.target.value)}
//                   placeholder="Enter your name"
//                 />
//                 {errors.requestedBy && (
//                   <p className="text-sm text-red-500">{errors.requestedBy}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="department">
//                   Department <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.department}
//                   onValueChange={(value) => handleInputChange('department', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select department" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="IT">IT</SelectItem>
//                     <SelectItem value="HR">HR</SelectItem>
//                     <SelectItem value="Finance">Finance</SelectItem>
//                     <SelectItem value="Operations">Operations</SelectItem>
//                     <SelectItem value="Admin">Admin</SelectItem>
//                     <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.department && (
//                   <p className="text-sm text-red-500">{errors.department}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="costCenter">
//                   Cost Center / Budget Code <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="costCenter"
//                   value={formData.costCenter}
//                   onChange={(e) => handleInputChange('costCenter', e.target.value)}
//                   placeholder="e.g., CC-001"
//                 />
//                 {errors.costCenter && (
//                   <p className="text-sm text-red-500">{errors.costCenter}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="requestDate">Request Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {format(requestDate, 'PPP')}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={requestDate}
//                       onSelect={(date) => date && setRequestDate(date)}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="requiredDate">
//                   Required By Date <span className="text-red-500">*</span>
//                 </Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {requiredDate ? format(requiredDate, 'PPP') : 'Pick a date'}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={requiredDate}
//                       onSelect={setRequiredDate}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 {errors.requiredDate && (
//                   <p className="text-sm text-red-500">{errors.requiredDate}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="priority">
//                   Priority Level <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.priority}
//                   onValueChange={(value) => handleInputChange('priority', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="low">Low</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="high">High</SelectItem>
//                     <SelectItem value="urgent">Urgent</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.priority && (
//                   <p className="text-sm text-red-500">{errors.priority}</p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="purpose">
//                 Purpose / Justification <span className="text-red-500">*</span>
//               </Label>
//               <Textarea
//                 id="purpose"
//                 value={formData.purpose}
//                 onChange={(e) => handleInputChange('purpose', e.target.value)}
//                 placeholder="Explain the business need for this purchase"
//                 rows={3}
//               />
//               {errors.purpose && (
//                 <p className="text-sm text-red-500">{errors.purpose}</p>
//               )}
//             </div>

//             {/* Items Table */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label className="text-lg font-semibold">Requisition Items</Label>
//                 <Button type="button" onClick={addItem} size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>

//               <div className="border rounded-lg overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[200px]">Item Description *</TableHead>
//                       <TableHead className="w-[200px]">Specification</TableHead>
//                       <TableHead className="w-[100px]">Quantity *</TableHead>
//                       <TableHead className="w-[100px]">Unit</TableHead>
//                       <TableHead className="w-[120px]">Est. Cost</TableHead>
//                       <TableHead className="w-[120px]">Total Cost</TableHead>
//                       <TableHead className="w-[150px]">Remarks</TableHead>
//                       <TableHead className="w-[60px]">Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {items.map((item, index) => (
//                       <TableRow key={item.id}>
//                         <TableCell>
//                           <Input
//                             value={item.itemDescription}
//                             onChange={(e) =>
//                               handleItemChange(item.id, 'itemDescription', e.target.value)
//                             }
//                             placeholder="Item name"
//                             className={errors[`item_${index}_description`] ? 'border-red-500' : ''}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             value={item.specification}
//                             onChange={(e) =>
//                               handleItemChange(item.id, 'specification', e.target.value)
//                             }
//                             placeholder="Size, color, etc."
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)
//                             }
//                             min="0"
//                             step="1"
//                             className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Select
//                             value={item.unit}
//                             onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="pcs">Pcs</SelectItem>
//                               <SelectItem value="kg">Kg</SelectItem>
//                               <SelectItem value="ltr">Ltr</SelectItem>
//                               <SelectItem value="box">Box</SelectItem>
//                               <SelectItem value="set">Set</SelectItem>
//                               <SelectItem value="mtr">Mtr</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={item.estimatedCost}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id,
//                                 'estimatedCost',
//                                 parseFloat(e.target.value) || 0
//                               )
//                             }
//                             min="0"
//                             step="0.01"
//                             placeholder="0.00"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <div className="font-medium">
//                             ₹{item.totalCost.toFixed(2)}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             value={item.remarks}
//                             onChange={(e) =>
//                               handleItemChange(item.id, 'remarks', e.target.value)
//                             }
//                             placeholder="Optional"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeItem(item.id)}
//                             disabled={items.length === 1}
//                           >
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>

//             {/* Total Amount */}
//             <div className="flex justify-end">
//               <Card className="w-full md:w-96">
//                 <CardContent className="pt-6">
//                   <div className="flex justify-between items-center text-lg font-semibold">
//                     <span>Total Estimated Amount:</span>
//                     <span>₹{totalAmount.toFixed(2)}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end gap-4 pt-4">
//               <Button type="button" variant="outline">
//                 Save as Draft
//               </Button>
//               <Button type="submit">
//                 Submit Requisition
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PurchaseRequisitionPage;
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { CustomInputField } from '@/CustomComponent/InputComponents/CustomInputField';
import { usePRBasicInfoFields,usePRItemDetailsFields } from '@/FieldDatas/PRData';

interface FormErrors {
  [key: string]: string;
}

const PurchaseRequisitionPage: React.FC = () => {
  // Get field configurations
  const basicInfoFields = usePRBasicInfoFields();
  const itemDetailsFields = usePRItemDetailsFields();

  // State for basic info form data
  const [basicFormData, setBasicFormData] = useState<Record<string, any>>({
    reg_date: new Date().toISOString().split('T')[0],
    is_active: true,
  });

  // State for items
  const [items, setItems] = useState<Record<string, any>[]>([
    {
      id: '1',
      qty: 1,
      est_cost: 0,
      total_cost: 0,
      is_active: true,
    },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});

  // Filter fields for input vs view
  const inputBasicFields = useMemo(
    () => basicInfoFields.filter((field) => field.input ),
    [basicInfoFields]
  );

  const inputItemFields = useMemo(
    () => itemDetailsFields.filter((field) => field.input && field.field !== 'pr_item_sno' && field.field !== 'pr_basic_sno'),
    [itemDetailsFields]
  );

  // Handle basic form field changes
  const handleBasicFieldChange = (fieldName: string, value: any) => {
    setBasicFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    // Handle dependent field updates (e.g., when selecting a master, update the name field)
    const field = basicInfoFields.find(f => f.field === fieldName);
    if (field && field.options && typeof field.options !== 'string') {
      const selectedOption = field.options.find(opt => opt.value === value);
      if (selectedOption) {
        const nameField = fieldName.replace('_sno', '_name');
        setBasicFormData(prev => ({ ...prev, [nameField]: selectedOption.label }));
      }
    }
  };

  // Handle item field changes
  const handleItemChange = (itemId: string, fieldName: string, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [fieldName]: value };

          // Auto-calculate total_cost when qty or est_cost changes
          if (fieldName === 'qty' || fieldName === 'est_cost') {
            const qty = fieldName === 'qty' ? parseFloat(value) || 0 : parseFloat(updatedItem.qty) || 0;
            const estCost = fieldName === 'est_cost' ? parseFloat(value) || 0 : parseFloat(updatedItem.est_cost) || 0;
            updatedItem.total_cost = qty * estCost;
          }

          // Handle dependent field updates for dropdowns
          const field = itemDetailsFields.find(f => f.field === fieldName);
          if (field && field.options && typeof field.options !== 'string') {
            const selectedOption = field.options.find(opt => opt.value === value);
            if (selectedOption) {
              const nameField = fieldName.replace('_sno', '_name');
              updatedItem[nameField] = selectedOption.label;
            }
          }

          return updatedItem;
        }
        return item;
      })
    );

    // Clear item-specific error
    const errorKey = `item_${itemId}_${fieldName}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new item row
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      qty: 1,
      est_cost: 0,
      total_cost: 0,
      is_active: true,
    };
    setItems([...items, newItem]);
  };

  // Remove item row
  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate basic info fields
    inputBasicFields.forEach((field) => {
      if (field.require && !basicFormData[field.field]) {
        newErrors[field.field] = `${field.label} is required`;
      }
    });

    // Validate items
    items.forEach((item) => {
      inputItemFields.forEach((field) => {
        if (field.require && !item[field.field]) {
          newErrors[`item_${item.id}_${field.field}`] = `${field.label} is required`;
        }
        
        // Additional validation for quantity
        if (field.field === 'qty' && (item.qty <= 0 || !item.qty)) {
          newErrors[`item_${item.id}_qty`] = 'Quantity must be greater than 0';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const requisitionData = {
        basicInfo: basicFormData,
        items: items,
        totalAmount: items.reduce((sum, item) => sum + (item.total_cost || 0), 0),
      };

      console.log('Purchase Requisition Data:', requisitionData);
      // TODO: Call your API here
      alert('Purchase Requisition submitted successfully!');
    } else {
      console.log('Validation errors:', errors);
    }
  };

  // Calculate total amount
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + (item.total_cost || 0), 0),
    [items]
  );

  // Get table columns for items (only fields that should be shown in table)
  const tableColumns = useMemo(() => {
    return inputItemFields.filter(field => 
      !['pr_item_sno', 'pr_basic_sno', 'is_active'].includes(field.field)
    );
  }, [inputItemFields]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Purchase Requisition - Non Trade</CardTitle>
          <CardDescription>
            Submit a purchase requisition for non-trade items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inputBasicFields.map((field) => (
                  <CustomInputField
                    key={field.field}
                    field={field.field}
                    label={field.label}
                    require={field.require}
                    type={field.type}
                    options={field.options}
                    value={basicFormData[field.field] || ''}
                    onChange={(value) => handleBasicFieldChange(field.field, value)}
                    error={errors[field.field]}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ))}
              </div>
            </div>

            {/* Items Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Requisition Items</h3>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {tableColumns.map((field) => (
                        <TableHead key={field.field} className="min-w-[150px]">
                          {field.label}
                          {field.require && <span className="text-red-500 ml-1">*</span>}
                        </TableHead>
                      ))}
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        {tableColumns.map((field) => (
                          <TableCell key={field.field}>
                            {field.field === 'total_cost' ? (
                              // Read-only calculated field
                              <div className="font-medium py-2">
                                ₹{(item.total_cost || 0).toFixed(2)}
                              </div>
                            ) : (
                              <CustomInputField
                                field={field.field}
                                label=""
                                require={field.require}
                                type={field.type}
                                options={field.options}
                                value={item[field.field] || ''}
                                onChange={(value) => handleItemChange(item.id, field.field, value)}
                                error={errors[`item_${item.id}_${field.field}`]}
                                placeholder={field.type === 'number' ? '0' : `Enter ${field.label.toLowerCase()}`}
                                className="min-w-full"
                              />
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-end">
              <Card className="w-full md:w-96">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Estimated Amount:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit">Submit Requisition</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseRequisitionPage;
