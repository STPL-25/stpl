
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { CustomInputField } from '@/CustomComponent/InputComponents/CustomInputField';
import { usePRBasicInfoFields, usePRItemDetailsFields } from '@/FieldDatas/PRData';
import usePost from '@/hooks/usePostHook';
import { createPrRecord } from '@/Services/Api';
import { toast } from 'sonner';
import type {FormErrors,FieldConfig} from "./types/PurchaseRequisitionPageTypes"


const PurchaseRequisitionPage: React.FC = () => {
  const basicInfoFields = usePRBasicInfoFields();
  const itemDetailsFields = usePRItemDetailsFields();

  // Dynamically create initial state from basicInfoFields
  const initialBasicFormData = useMemo(() => {
    const initialData: Record<string, any> = {};
    
    basicInfoFields.forEach((field: FieldConfig) => {
      if (field.input) {
        if (field.defaultValue !== undefined) {
          initialData[field.field] = field.defaultValue;
        } else if (field.field === 'req_date') {
          initialData[field.field] = new Date().toISOString().split('T')[0];
        } else if (field.type === 'number') {
          initialData[field.field] = 0;
        } else {
          initialData[field.field] = '';
        }
      }
    });
    
    return initialData;
  }, [basicInfoFields]);

  // Create empty item structure
  const createEmptyItem = useMemo(() => {
    return () => {
      const newItem: Record<string, any> = {};
      
      itemDetailsFields.forEach((field: FieldConfig) => {
        if (field.input && field.field !== 'pr_item_sno' && field.field !== 'pr_basic_sno') {
          if (field.defaultValue !== undefined) {
            newItem[field.field] = field.defaultValue;
          } else if (field.field === 'qty') {
            newItem[field.field] = 1;
          } else if (field.field === 'est_cost' || field.field === 'total_cost') {
            newItem[field.field] = 0;
          } else if (field.field === 'is_active') {
            newItem[field.field] = true;
          } else if (field.type === 'number') {
            newItem[field.field] = 0;
          } else if (field.type === 'checkbox' || field.type === 'boolean') {
            newItem[field.field] = false;
          } else {
            newItem[field.field] = '';
          }
        }
      });
      
      return newItem;
    };
  }, [itemDetailsFields]);

  // State for basic info form data
  const [basicFormData, setBasicFormData] = useState<Record<string, any>>(initialBasicFormData);

  // State for current item being added/edited
  const [currentItem, setCurrentItem] = useState<Record<string, any>>(createEmptyItem());

  // State for saved items list
  const [savedItems, setSavedItems] = useState<Record<string, any>[]>([]);

  // State for editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [itemErrors, setItemErrors] = useState<FormErrors>({});
  const { postData } = usePost();
  console.log(basicFormData);

  // Update state when field configurations change
  useEffect(() => {
    setBasicFormData(initialBasicFormData);
  }, [initialBasicFormData]);

  // Filter fields for input
  const inputBasicFields = useMemo(
    () => basicInfoFields.filter((field) => field.input),
    [basicInfoFields]
  );

  const inputItemFields = useMemo(
    () => itemDetailsFields.filter(
      (field) => field.input
    ),
    [itemDetailsFields]
  );
    const viewItemFields = useMemo(
    () => itemDetailsFields.filter(
      (field) => field.view
    ),
    [itemDetailsFields]
  );

  // Handle basic form field changes
  const handleBasicFieldChange = (fieldName: string, value: any) => {
    setBasicFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    // Handle dependent field updates
    const field = basicInfoFields.find((f) => f.field === fieldName);
    if (field && field.options && typeof field.options !== 'string') {
      const selectedOption = field.options.find((opt: any) => opt.value === value);
      if (selectedOption) {
        const nameField = fieldName.replace('_sno', '_name');
        setBasicFormData((prev) => ({ ...prev, [nameField]: selectedOption.label }));
      }
    }
  };

  // Handle current item field changes
  const handleItemFieldChange = (fieldName: string, value: any) => {
        console.log(fieldName,value)

    setCurrentItem((prev) => {
      const updatedItem = { ...prev, [fieldName]: value };

      // Auto-calculate total_cost when qty or est_cost changes
      if (fieldName === 'qty' || fieldName === 'est_cost') {
        const qty = fieldName === 'qty' ? parseFloat(value) || 0 : parseFloat(updatedItem.qty) || 0;
        const estCost = fieldName === 'est_cost' ? parseFloat(value) || 0 : parseFloat(updatedItem.est_cost) || 0;
        updatedItem.total_cost = qty * estCost;
      }

      // Handle dependent field updates for dropdowns
      const field = itemDetailsFields.find((f) => f.field === fieldName);
      if (field && field.options && typeof field.options !== 'string') {
        const selectedOption = field.options.find((opt: any) => opt.value === value);
        if (selectedOption) {
          const nameField = fieldName.replace('_sno', '_name');
          updatedItem[nameField] = selectedOption.label;
        }
      }

      return updatedItem;
    });

    // Clear error for this field
    if (itemErrors[fieldName]) {
      setItemErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate current item
  const validateItem = (): boolean => {
    const newErrors: FormErrors = {};

    inputItemFields.forEach((field) => {
      if (field.require && !currentItem[field.field]) {
        newErrors[field.field] = `${field.label} is required`;
      }
      
      // Additional validation for quantity
      if (field.field === 'qty' && (currentItem.qty <= 0 || !currentItem.qty)) {
        newErrors['qty'] = 'Quantity must be greater than 0';
      }

      // Additional validation for cost fields
      if ((field.field === 'est_cost' || field.field === 'total_cost') && currentItem[field.field] < 0) {
        newErrors[field.field] = `${field.label} cannot be negative`;
      }
    });

    setItemErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add item to saved items list
  const handleAddItem = () => {
    if (validateItem()) {
      const newItem = {
        ...currentItem,
        id: Date.now().toString(), // Generate unique ID
      };
      
      setSavedItems((prev) => [...prev, newItem]);
      setCurrentItem(createEmptyItem()); // Reset form
      setItemErrors({});
    }
  };

  // Edit item
  const handleEditItem = (itemId: string) => {
    const itemToEdit = savedItems.find((item) => item.id === itemId);
    if (itemToEdit) {
      const { id, ...itemData } = itemToEdit;
      setCurrentItem(itemData);
      setEditingItemId(itemId);
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Update edited item
  const handleUpdateItem = () => {
    if (validateItem() && editingItemId) {
      setSavedItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId ? { ...currentItem, id: editingItemId } : item
        )
      );
      setCurrentItem(createEmptyItem());
      setEditingItemId(null);
      setItemErrors({});
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setCurrentItem(createEmptyItem());
    setEditingItemId(null);
    setItemErrors({});
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
      
      // If currently editing this item, reset form
      if (editingItemId === itemId) {
        setCurrentItem(createEmptyItem());
        setEditingItemId(null);
      }
    }
  };

  // Validate basic form
  const validateBasicForm = (): boolean => {
    const newErrors: FormErrors = {};

    inputBasicFields.forEach((field) => {
      if (field.require && !basicFormData[field.field]) {
        newErrors[field.field] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isBasicFormValid = validateBasicForm();
    const hasItems = savedItems.length > 0;

    if (!hasItems) {
      alert('Please add at least one item to the requisition');
      return;
    }

    if (isBasicFormValid) {
      const requisitionData = {
        basicInfo: basicFormData,
        items: savedItems.map(({ id, ...item }) => item),
        totalAmount: totalAmount,
        submittedAt: new Date().toISOString(),
      };

      const response=postData(createPrRecord, requisitionData);
  toast.success(response?.data[0].Message||'Purchase Requisition submitted successfully!');
      console.log('Purchase Requisition Data:', response);
      // TODO: Call your API here
    } else {
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    const draftData = {
      basicInfo: basicFormData,
      items: savedItems,
      totalAmount: totalAmount,
      savedAt: new Date().toISOString(),
      isDraft: true,
    };

    console.log('Saving draft:', draftData);
    // TODO: Call your API to save draft
    alert('Draft saved successfully!');
  };

  // Calculate total amount
  const totalAmount = useMemo(
    () => savedItems.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0),
    [savedItems]
  );

  // Get display columns for table (exclude certain fields)
  const displayColumns = useMemo(() => {
    return viewItemFields.filter((field) =>
     field.view
    );
  }, [viewItemFields]);

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the entire form? All data will be lost.')) {
      setBasicFormData(initialBasicFormData);
      setCurrentItem(createEmptyItem());
      setSavedItems([]);
      setEditingItemId(null);
      setErrors({});
      setItemErrors({});
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
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
                  <div key={field.field} data-error={!!errors[field.field]}>
                    <CustomInputField
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
                  </div>
                ))}
              </div>
            </div>

            {/* Item Entry Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingItemId ? 'Edit Item' : 'Add Item'}
                </h3>
                {editingItemId && (
                  <Button type="button" onClick={handleCancelEdit} size="sm" variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel Edit
                  </Button>
                )}
              </div>

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inputItemFields.map((field) => (
                      <div key={field.field} data-error={!!itemErrors[field.field]}>
                        {field.field === 'total_cost' ? (
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              {field.label}
                              {field.require && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="font-semibold py-2 px-3 bg-white rounded border text-green-600">
                              ₹{(parseFloat(currentItem.total_cost) || 0).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <CustomInputField
                            field={field.field}
                            label={field.label}
                            require={field.require}
                            type={field.type}
                            options={field.options}
                            value={currentItem[field.field] || ''}
                            onChange={(value) => handleItemFieldChange(field.field, value)}
                            error={itemErrors[field.field]}
                            placeholder={
                              field.type === 'number'
                                ? '0'
                                : `Enter ${field.label.toLowerCase()}`
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Display Item Errors */}
                  {Object.keys(itemErrors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                      <p className="text-red-800 font-semibold text-sm mb-1">Please fix the following:</p>
                      <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                        {Object.values(itemErrors).map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    {editingItemId ? (
                      <Button type="button" onClick={handleUpdateItem} className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" />
                        Update Item
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Saved Items Table */}
            {savedItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Items List</h3>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">S.No</TableHead>
                        {displayColumns.map((field) => (
                          <TableHead key={field.field} className="min-w-[120px]">
                            {field.label}
                          </TableHead>
                        ))}
                        <TableHead className="w-[100px] text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedItems.map((item, index) => (
                        <TableRow key={item.id} className={editingItemId === item.id ? 'bg-blue-50' : ''}>
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          {displayColumns.map((field) => (
                            <TableCell key={field.field}>
                              {field.field === 'total_cost' || field.field === 'est_cost' ? (
                                <span className="font-medium text-green-600">
                                  ₹{(parseFloat(item[field.field]) || 0).toFixed(2)}
                                </span>
                              ) : field.type === 'checkbox' || field.type === 'boolean' ? (
                                <span>{item[field.field] ? 'Yes' : 'No'}</span>
                              ) : (
                                <span>{item[field.field]}</span>
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item.id)}
                                title="Edit item"
                                disabled={editingItemId !== null}
                              >
                                <Edit2 className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                                title="Delete item"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {savedItems.length === 0 && (
              <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                No items added yet. Fill in the item details above and click "Add Item".
              </div>
            )}

            {/* Total Amount */}
            {savedItems.length > 0 && (
              <div className="flex justify-end">
                <Card className="w-full md:w-96">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Items:</span>
                        <span className="font-medium">{savedItems.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                        <span>Total Estimated Amount:</span>
                        <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Display Basic Form Errors Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
                <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                  {Object.values(errors).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={handleSaveAsDraft}>
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={savedItems.length === 0}
                >
                  Submit Requisition
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseRequisitionPage;
