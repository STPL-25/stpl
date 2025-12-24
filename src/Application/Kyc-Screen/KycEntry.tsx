import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {  Building2, MapPin, FileText, CreditCard, Users, Upload,CheckCircle2,
  AlertCircle, X, Loader2,  ChevronRight,  Plus,} from "lucide-react";
import { CustomInputField } from "@/CustomComponent/InputComponents/CustomInputField";
import {  useBasicInfoFields, useAddressFields,  useBankFields,  useContactFields,  useDocumentFields,useComDivBranchDeptFields } from "@/FieldDatas/KycFieldDatas";
import { useAppState } from "../../globalState/hooks/useAppState";
import usePost from "@/hooks/usePostHook";
import { toast } from "sonner";
import { apiPostKycData } from "@/Services/Api";
import DynamicDialog from "@/CustomComponent/InputComponents/CustomModelComponent";
import {DynamicFormData, AdditionalAddress, BankDetail, ContactDetail, Option, Branch, Division, Company} from "./types/KycEntryType";

export default function SupplierKYCForm() {
  const addressFields = useAddressFields();
  const documentFields = useDocumentFields();
  const bankFields = useBankFields();
  const contactFields = useContactFields();
  const { postData, loading: submitting, error: submitError } = usePost();
  const { data: hierarchyData, loading: hierarchyLoading, error: hierarchyError } = useAppState();

  // Initialize state objects
  const initialAddressInfo = useMemo(() => {
    const obj: DynamicFormData = {};
    addressFields.filter((field) => field.input).forEach((field) => {
      obj[field.field] = "";
    });
    return obj;
  }, [addressFields]);

  const initialBankInfo = useMemo(() => {
    const obj: DynamicFormData = {};
    bankFields.filter((field) => field.input).forEach((field) => {
      obj[field.field] = "";
    });
    return obj;
  }, [bankFields]);

  const initialContactInfo = useMemo(() => {
    const obj: DynamicFormData = {};
    contactFields.filter((field) => field.input).forEach((field) => {
      obj[field.field] = "";
    });
    return obj;
  }, [contactFields]);

  const initialDocumentInfo = useMemo(() => {
    const obj: DynamicFormData = {};
    documentFields.filter((field) => field.input).forEach((field) => {
      obj[field.field] = null;
    });
    return obj;
  }, [documentFields]);

  const [basicInfo, setBasicInfo] = useState<DynamicFormData>({});
  const [addressInfo, setAddressInfo] = useState<DynamicFormData>(initialAddressInfo);
  const [bankInfo, setBankInfo] = useState<DynamicFormData>(initialBankInfo);
  const [contactInfo, setContactInfo] = useState<DynamicFormData>(initialContactInfo);
  const [documentInfo, setDocumentInfo] = useState<DynamicFormData>(initialDocumentInfo);
  const [additionalAddresses, setAdditionalAddresses] = useState<AdditionalAddress[]>([]);
  const [additionalBankDetails, setAdditionalBankDetails] = useState<BankDetail[]>([]);
  const [additionalContacts, setAdditionalContacts] = useState<ContactDetail[]>([]);
  // NEW: State for primary bank cancel cheque
  const [primaryBankCancelCheque, setPrimaryBankCancelCheque] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<number[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<number[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
 const {  
    companyOptions,
    divisionOptions,
    branchOptions,
    departmentOptions,
   
  } = useComDivBranchDeptFields(selectedCompany, selectedDivision);
  // Options
  // const companyOptions: Option[] = useMemo(() => {
  //   if (!hierarchyData?.companies) return [];
  //   return hierarchyData.companies.map((company: Company) => ({
  //     label: company.com_name,
  //     value: company.com_sno,
  //   }));
  // }, [hierarchyData]);

  // const divisionOptions: Option[] = useMemo(() => {
  //   if (!hierarchyData?.divisions || selectedCompany.length === 0) return [];
  //   return hierarchyData.divisions.map((division: Division) => ({
  //     label: division.div_name,
  //     value: division.div_sno,
  //   }));
  // }, [hierarchyData, selectedCompany]);

  // const branchOptions: Option[] = useMemo(() => {
  //   if (!hierarchyData?.branches || selectedDivision.length === 0) return [];
  //   return hierarchyData.branches.map((branch: Branch) => ({
  //     label: branch.brn_name,
  //     value: branch.brn_sno,
  //   }));
  // }, [hierarchyData, selectedDivision]);

  // const departmentOptions: Option[] = useMemo(
  //   () => [
  //     { value: "dept-1", label: "Procurement" },
  //     { value: "dept-2", label: "Finance" },
  //     { value: "dept-3", label: "Operations" },
  //   ],
  //   []
  // );

  const basicInfoFields = useBasicInfoFields(basicInfo);

  // Handlers
  const handleChange =
    (setState: React.Dispatch<React.SetStateAction<DynamicFormData>>) =>
    (field: string, value: any) => {
      setState((prev) => ({ ...prev, [field]: value }));
    };

  const handleBasicChange = handleChange(setBasicInfo);
  const handleAddressChange = handleChange(setAddressInfo);
  const handleBankChange = handleChange(setBankInfo);
  const handleContactChange = handleChange(setContactInfo);
  const handleDocumentChange = handleChange(setDocumentInfo);

  const handleCompanyChange = (vals: (number | string)[]) => {
    const newCompanyIds = vals.map((v) => Number(v));
    setSelectedCompany(newCompanyIds);

    if (newCompanyIds.length === 0) {
      setSelectedDivision([]);
      setSelectedBranch([]);
    }
  };

  const handleDivisionChange = (vals: (number | string)[]) => {
    const newDivisionIds = vals.map((v) => Number(v));
    setSelectedDivision(newDivisionIds);

    if (newDivisionIds.length === 0) {
      setSelectedBranch([]);
    }
  };

  // Address handlers
  const handleAddAddress = () => {
    const newAddress: AdditionalAddress = {};
    addressFields.forEach((field) => {
      newAddress[field.field] = "";
    });
    setAdditionalAddresses((prev) => [...prev, newAddress]);
  };

  const handleRemoveAddress = (index: number) => {
    setAdditionalAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalAddressChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setAdditionalAddresses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Bank details handlers
  const handleAddBankDetail = () => {
    const newBankDetail: BankDetail = { 
      id: `bank_${Date.now()}`,
      cancelChequeFile: null // Initialize with null
    };
    bankFields.filter((field) => field.input).forEach((field) => {
      newBankDetail[field.field] = "";
    });
    setAdditionalBankDetails((prev) => [...prev, newBankDetail]);
  };

  const handleRemoveBankDetail = (index: number) => {
    setAdditionalBankDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalBankChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setAdditionalBankDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // NEW: Handler for bank cancel cheque file
  const handleBankCancelChequeChange = (index: number, file: File | null) => {
    setAdditionalBankDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], cancelChequeFile: file };
      return updated;
    });
  };

  // Contact handlers
  const handleAddContact = () => {
    const newContact: ContactDetail = { 
      id: `contact_${Date.now()}`, 
      document: null 
    };
    contactFields.filter((field) => field.input).forEach((field) => {
      newContact[field.field] = "";
    });
    setAdditionalContacts((prev) => [...prev, newContact]);
  };

  const handleRemoveContact = (index: number) => {
    setAdditionalContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdditionalContactChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setAdditionalContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleContactDocumentChange = (index: number, file: File | null) => {
    setAdditionalContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], document: file };
      return updated;
    });
  };

  const handleOpenModal = (section: string) => {
    setCurrentSection(section);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSection("");
  };

  const handleModalSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    handleCloseModal();
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("companyIds", JSON.stringify(selectedCompany));
      formData.append("divisionIds", JSON.stringify(selectedDivision));
      formData.append("branchIds", JSON.stringify(selectedBranch));
      formData.append("departmentIds", JSON.stringify(selectedDepartment));

      Object.entries(basicInfo).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      Object.entries(addressInfo).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (additionalAddresses.length > 0) {
        formData.append("additionalAddresses", JSON.stringify(additionalAddresses));
      }

      // ===== BANK INFORMATION WITH CANCEL CHEQUE FILES =====
      // Primary Bank Details
      Object.entries(bankInfo).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      // Primary Bank Cancel Cheque File
      if (primaryBankCancelCheque) {
        formData.append("primaryBankCancelCheque", primaryBankCancelCheque);
      }

      // Additional Bank Details with Cancel Cheques
      if (additionalBankDetails.length > 0) {
        const bankDetailsData = additionalBankDetails.map(
          ({ id, cancelChequeFile, ...bank }) => ({
            id,
            ...bank,
            hasCancelCheque: !!cancelChequeFile,
          })
        );
        formData.append("additionalBankDetails", JSON.stringify(bankDetailsData));

        // Append each cancel cheque file with unique identifier
        additionalBankDetails.forEach((bank, index) => {
          if (bank.cancelChequeFile) {
            formData.append(`bankCancelCheque_${index}`, bank.cancelChequeFile);
          }
        });
      }

      // ===== PRIMARY CONTACT (OWNER/AUTHORIZED PERSON) =====
      Object.entries(contactInfo).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      // ===== ADDITIONAL CONTACTS WITH DOCUMENTS =====
      if (additionalContacts.length > 0) {
        const contactsData = additionalContacts.map(({ id, document, ...contact }) => ({
          id,
          ...contact,
          hasDocument: !!document,
        }));
        formData.append("additionalContacts", JSON.stringify(contactsData));

        // Append each contact document with unique identifier
        additionalContacts.forEach((contact, index) => {
          if (contact.document) {
            formData.append(`contactDocument_${index}`, contact.document);
          }
        });
      }

      // ===== GENERAL DOCUMENTS =====
      Object.entries(documentInfo).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        }
      });

      const response = await postData(apiPostKycData, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        toast.success("KYC submitted successfully!");

        // Reset all states
        setBasicInfo({});
        setAddressInfo(initialAddressInfo);
        setBankInfo(initialBankInfo);
        setContactInfo(initialContactInfo);
        setDocumentInfo(initialDocumentInfo);
        setAdditionalAddresses([]);
        setAdditionalBankDetails([]);
        setAdditionalContacts([]);
        setPrimaryBankCancelCheque(null); 
        setSelectedCompany([]);
        setSelectedDivision([]);
        setSelectedBranch([]);
        setSelectedDepartment([]);
      }
    } catch (error: any) {
      console.error("KYC submission error:", error);
      toast.error(error?.message || "An error occurred while submitting KYC");
    }
  };

  const getCompletionStatus = (section: string) => {
    switch (section) {
      case "address":
        return addressFields.some((field) => field.require && addressInfo[field.field]) ||
          additionalAddresses.length > 0;
      case "documents":
        return documentFields.some((field) => documentInfo[field.field]);
      case "account":
        return (bankFields.some((field) => field.require && bankInfo[field.field]) && 
          primaryBankCancelCheque !== null) ||
          additionalBankDetails.length > 0;
      case "contacts":
        return contactFields.some((field) => field.require && contactInfo[field.field]) ||
          additionalContacts.length > 0;
      default:
        return false;
    }
  };

  const SectionButton = ({ title,  description,  icon: Icon,  section, }: {
    title: string;  description?: string;  icon: any;   section: string;  }) => {
    const isComplete = getCompletionStatus(section);

    return (
      <button
        onClick={() => handleOpenModal(section)}
        className="group relative w-full text-left overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base group-hover:text-primary transition-colors">
                {title}
              </h3>
              {isComplete ? (
                <Badge className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Done
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  Pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </div>
      </button>
    );
  };

  const renderModalContent = () => {
    switch (currentSection) {
      case "address":
        return (
          <div className="space-y-6">
            {/* Primary Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressFields
                .filter((field) => field.input)
                .map((field) => (
                  <CustomInputField
                    key={field.field}
                    field={field.field}
                    label={field.label}
                    require={field.require}
                    value={addressInfo[field.field] || ""}
                    onChange={(v) => handleAddressChange(field.field, v)}
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                ))}
            </div>

            {additionalAddresses.length > 0 && <Separator className="my-6" />}

            {/* Additional Addresses */}
            {additionalAddresses.map((addr, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAddress(index)}
                  className="absolute top-3 right-3 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Additional Location {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressFields
                    .filter((field) => field.input)
                    .map((field) => (
                      <CustomInputField
                        key={`${field.field}-${index}`}
                        field={`${field.field}-${index}`}
                        label={field.label}
                        value={addr[field.field] || ""}
                        onChange={(value) =>
                          handleAdditionalAddressChange(index, field.field, value)
                        }
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddAddress}
              className="w-full border-dashed hover:border-solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Location
            </Button>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            {/* Primary Bank Details */}
            <div>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                <CreditCard className="h-5 w-5 text-primary" />
                Primary Bank Account
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankFields
                  .filter((field) => field.input)
                  .map((field) => (
                    <CustomInputField
                      key={field.field}
                      field={field.field}
                      label={field.label}
                      require={field.require}
                      value={bankInfo[field.field] || ""}
                      onChange={(v) => handleBankChange(field.field, v)}
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                  ))}
              </div>
              
              {/* Primary Bank Cancel Cheque Upload */}
              <Separator className="my-4" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Cancelled Cheque Leaf <span className="text-red-500">*</span>
                </label>
                <CustomInputField
                  field="primary-bank-cancel-cheque"
                  label=""
                  type="file"
                  value={primaryBankCancelCheque}
                  onChange={(fileOrNull: File | null) =>
                    setPrimaryBankCancelCheque(fileOrNull)
                  }
                />
                {primaryBankCancelCheque && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {primaryBankCancelCheque.name}
                  </p>
                )}
              </div>
            </div>

            {additionalBankDetails.length > 0 && <Separator className="my-6" />}

            {/* Additional Bank Details with Cancel Cheque */}
            {additionalBankDetails.map((bank, index) => (
              <div
                key={bank.id}
                className="relative rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveBankDetail(index)}
                  className="absolute top-3 right-3 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Bank Account {index + 2}
                </h4>
                
                {/* Bank Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bankFields
                    .filter((field) => field.input)
                    .map((field) => (
                      <CustomInputField
                        key={`${field.field}-${bank.id}`}
                        field={`${field.field}-${bank.id}`}
                        label={field.label}
                        value={bank[field.field] || ""}
                        onChange={(value) =>
                          handleAdditionalBankChange(index, field.field, value)
                        }
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    ))}
                </div>

                {/* Cancel Cheque Upload for THIS Additional Bank */}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    Cancelled Cheque Leaf <span className="text-red-500">*</span>
                  </label>
                  <CustomInputField
                    field={`bank-cancel-cheque-${bank.id}`}
                    label=""
                    type="file"
                    value={bank.cancelChequeFile ?? null}
                    onChange={(fileOrNull: File | null) =>
                      handleBankCancelChequeChange(index, fileOrNull)
                    }
                  />
                  {bank.cancelChequeFile && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {bank.cancelChequeFile.name}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddBankDetail}
              className="w-full border-dashed hover:border-solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Bank Account
            </Button>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-6">
            {/* Primary Contact - Owner/Authorized Person */}
            <div>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2 text-gray-900">
                <Users className="h-5 w-5 text-primary" />
                Owner / Authorized Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactFields
                  .filter((field) => field.input)
                  .map((field) => (
                    <CustomInputField
                      key={field.field}
                      field={field.field}
                      label={field.label}
                      require={field.require}
                      value={contactInfo[field.field] || ""}
                      onChange={(v) => handleContactChange(field.field, v)}
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                  ))}
              </div>
            </div>

            {additionalContacts.length > 0 && <Separator className="my-6" />}

            {/* Additional Contacts */}
            {additionalContacts.map((contact, index) => (
              <div
                key={contact.id}
                className="relative rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveContact(index)}
                  className="absolute top-3 right-3 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Additional Contact Person {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {contactFields
                    .filter((field) => field.input)
                    .map((field) => (
                      <CustomInputField
                        key={`${field.field}-${contact.id}`}
                        field={`${field.field}-${contact.id}`}
                        label={field.label}
                        value={contact[field.field] || ""}
                        onChange={(value) =>
                          handleAdditionalContactChange(index, field.field, value)
                        }
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    ))}
                </div>

                {/* Document Upload for Contact */}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    Supporting Document (ID Proof)
                  </label>
                  <CustomInputField
                    field={`contact-document-${contact.id}`}
                    label=""
                    type="file"
                    value={contact.document ?? null}
                    onChange={(fileOrNull: File | null) =>
                      handleContactDocumentChange(index, fileOrNull)
                    }
                  />
                  {contact.document && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {contact.document.name}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddContact}
              className="w-full border-dashed hover:border-solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Contact Person
            </Button>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4">
            {documentFields
              .filter((field) => field.input)
              .map((field) => (
                <CustomInputField
                  key={field.field}
                  field={field.field}
                  label={field.label}
                  require={field.require}
                  type="file"
                  value={documentInfo[field.field] ?? null}
                  onChange={(fileOrNull: File | null) =>
                    handleDocumentChange(field.field, fileOrNull)
                  }
                />
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const titles: Record<string, string> = {
      address: "Address Details",
      documents: "Document Upload",
      account: "Bank Account Details",
      contacts: "Contact Information",
    };
    return titles[currentSection] || "";
  };

  const getModalIcon = () => {
    const icons: Record<string, any> = {
      address: MapPin,
      account: CreditCard,
      contacts: Users,
      documents: Upload,
    };
    return icons[currentSection] || FileText;
  };

  const ModalIcon = getModalIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-6 px-4 lg:px-8">
      <div className="mx-auto space-y-6">
        {/* Validation Errors */}
       

        {/* Basic Information Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hierarchy Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CustomInputField
                field="com_sno"
                label="Company"
                type="multi-select"
                options={companyOptions}
                value={selectedCompany}
                onChange={handleCompanyChange}
                require
                disabled={hierarchyLoading || !!hierarchyError}
              />
              <CustomInputField
                field="divisionIds"
                label="Division"
                type="multi-select"
                options={divisionOptions}
                value={selectedDivision}
                onChange={handleDivisionChange}
                require
                disabled={selectedCompany.length === 0 || divisionOptions.length === 0}
              />
              <CustomInputField
                field="branchIds"
                label="Branch"
                type="multi-select"
                options={branchOptions}
                value={selectedBranch}
                onChange={(vals: (number | string)[]) =>
                  setSelectedBranch(vals.map((v) => Number(v)))
                }
                require
                disabled={selectedDivision.length === 0 || branchOptions.length === 0}
              />
              <CustomInputField
                field="departmentIds"
                label="Department"
                type="multi-select"
                options={departmentOptions}
                value={selectedDepartment}
                onChange={(vals: (string | number)[]) =>
                  setSelectedDepartment(vals.map(String))
                }
                require
              />
            </div>

            {/* Additional Basic Fields */}
            {basicInfoFields.some((f) => f.input) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {basicInfoFields
                    .filter((field) => field.input)
                    .map((field) => (
                      <div key={field.field}>
                        <CustomInputField
                          field={field.field}
                          label={field.label}
                          require={field.require}
                          value={basicInfo[field.field] || ""}
                          onChange={(v) => handleBasicChange(field.field, v)}
                          placeholder={field.placeholder}
                          type={field.type}
                          options={field.options}
                        />
                      </div>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Sections Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionButton
              title="Address Details"
              description="Business locations and registered addresses"
              icon={MapPin}
              section="address"
            />
            <SectionButton
              title="Bank Account"
              description="Banking information and cancelled cheque for each account"
              icon={CreditCard}
              section="account"
            />
            <SectionButton
              title="Contact Information"
              description="Owner/authorized person and additional contacts with documents"
              icon={Users}
              section="contacts"
            />
            <SectionButton
              title="Documents"
              description="Upload certificates and required documents"
              icon={Upload}
              section="documents"
            />
          </div>
        </div>

        {/* Submit Section */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="text-center md:text-left">
                {submitError && (
                  <p className="text-sm text-red-600 mt-2">{submitError}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="sm:w-auto"
                  disabled={submitting}
                >
                  Reset Form
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit KYC
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <DynamicDialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        title={getModalTitle()}
        Icon={ModalIcon}
        children={renderModalContent()}
        onSave={handleModalSave}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
