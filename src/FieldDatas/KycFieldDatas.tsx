import { useMemo } from "react";

export type FieldInputType = "text" | "number" | "select" | "date" | "email" | "textarea"| "file"|'radio';

export interface OptionType {
  value: string | number;
  label: string;
}

export interface FieldType {
  field: string;
  label: string;
  require?: boolean;
  view?: boolean;
  type: FieldInputType;
  input?: boolean;
  placeholder?: string;
  options?: OptionType[] | any[];
}

// Hook for Basic Information fields
export const useBasicInfoFields = (basicInfo: any): FieldType[] => {
  // Extract specific properties to track changes
  const isGstAvail = basicInfo?.is_gst_avail==='true';
  const isMsmeAvail = basicInfo?.is_msme_avail==='true';

  return useMemo<FieldType[]>(
    () => [
      { 
        field: "is_gst_avail", 
        label: "Gst Available", 
        require: true, 
        type: "radio",
        options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }], 
        placeholder: "Enter company name",
        input: true,
        view: true
      },
      { 
        field: "is_msme_avail", 
        label: "MSME Available", 
        require: true, 
        type: "radio",
        options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }], 
        placeholder: "Enter company name",
        input: true,
        view: true
      },
      { field: "company_name", label: "Company Name", require: true, type: "text", placeholder: "Enter company name", input: true, view: true },
      { field: "contact_name", label: "Proprietor / Contact Person", require: true, type: "text", placeholder: "Contact person name", input: true, view: true },
      { field: "mobile_number", label: "Mobile Number", require: true, type: "text", placeholder: "+91 98765 43210", input: true, view: true },
      { field: "email", label: "Email Address", require: true, type: "email", placeholder: "supplier@example.com", input: true, view: true },
      { field: "business_type", label: "Business Type", require: true, type: "text", placeholder: "E.g. MSME, Sole Proprietor, Pvt Ltd", input: true, view: true },
      { 
        field: "gst_no", 
        label: "GST Number", 
        require: isGstAvail, // Dynamic requirement
        type: "text", 
        placeholder: "22AAAAA0000A1Z5",
        input: !!isGstAvail, // Show only when GST available
        view: true 
      },
      { field: "pan_no", label: "PAN Number", require: true, type: "text", placeholder: "ABCDE1234F", input: true, view: true },
      { 
        field: "msme_no", 
        label: "MSME Number", 
        require: isMsmeAvail, // Dynamic requirement
        type: "text", 
        placeholder: "UDYAM-XX-00-0000000",
        input: !!isMsmeAvail, // FIXED: Was inverted
        view: true 
      },
    ],
    [isGstAvail, isMsmeAvail] // Track specific properties, not the whole object
  );
};


// Hook for Address fields
export const useAddressFields = (): FieldType[] => {
  return useMemo<FieldType[]>(
    () => [
      { field: "door_no", label: "Door / Building No", require: true, type: "text", placeholder: "123",input:true,view:true },
      { field: "street", label: "Street Name", require: true, type: "text", placeholder: "Main Street" ,input:true,view:true},
      { field: "area", label: "Area / Locality", require: true, type: "text", placeholder: "Downtown",input:true,view:true },
      { field: "taluk", label: "Taluk", require: true, type: "text", placeholder: "Taluk name" ,input:true,view:true},
      { field: "city", label: "City", require: true, type: "text", placeholder: "City name",input:true,view:true },
      { field: "state", label: "State", require: true, type: "text", placeholder: "State name",input:true,view:true },
      { field: "pincode", label: "Pincode", require: true, type: "text", placeholder: "600001",input:true,view:true },
       { field: "location_link", label: "Location Link", require: false, type: "text", placeholder: "https://maps.google.com/...",input:true,view:true },
    ],
    []
  );
};

// Hook for Document fields
export const useDocumentFields = (): FieldType[] => {
  return useMemo<FieldType[]>(
    () => [
      { field: "gst_file", label: "GST Certificate", require: false, type: "file",input:true,view:true },
      { field: "pan_file", label: "PAN Card", require: true, type: "file",input:true,view:true },
      { field: "msme_file", label: "MSME Certificate", require: false, type: "file",input:true,view:true },
      { field: "cancel_cheque_file", label: "Cancelled Cheque ", require: true, type: "file",input:true,view:true },
      { field: "auth_contact_file", label: "Owner ID Proof", require: false, type: "file",input:true,view:true },
      { field: "auth_person_file", label: "Authorized Person ID", require: false, type: "file" ,input:true,view:true},
      { field: "auth_accounts_file", label: "Authorized Accounts Person ID", require: false, type: "file" ,input:true,view:true},
    ],
    []
  );
};

// Hook for Bank fields
export const useBankFields = (): FieldType[] => {
  return useMemo<FieldType[]>(
    () => [
      { field: "ac_holder_name", label: "Account Holder Name", require: true, type: "text", placeholder: "As per bank records" ,input:true,view:true},
      { field: "ac_number", label: "Account Number", require: true, type: "text", placeholder: "1234567890",input:true,view:true },
      { field: "ac_type", label: "Account Type", require: true, type: "text", placeholder: "Savings / Current" ,input:true,view:true},
      { field: "ifsc", label: "IFSC Code", require: true, type: "text", placeholder: "SBIN0001234" ,input:true,view:true},
      { field: "bank_name", label: "Bank Name", require: true, type: "text", placeholder: "Bank name",input:true,view:true },
      { field: "bank_branch_name", label: "Branch Name", require: true, type: "text", placeholder: "Branch location",input:true,view:true },
      { field: "bank_address", label: "Bank Address", require: true, type: "textarea", placeholder: "Full bank branch address" ,input:true,view:true},
    ],
    []
  );
};

// Hook for Contact fields
export const useContactFields = (): FieldType[] => {
  return useMemo<FieldType[]>(
    () => [
      { field: "ownername", label: "Name", require: true, type: "text", placeholder: "Owner name",input:true,view:true },
      { field: "ownerposition", label: "Position", require: false, type: "text", placeholder: "Managing Director / Owner",input:true,view:true },
      { field: "ownermobile", label: "Mobile", require: true, type: "text", placeholder: "+91 98765 43210",input:true,view:true },
      { field: "owneremail", label: "Email", require: true, type: "email", placeholder: "owner@example.com",input:true,view:true },
      { field: "boname", label: "Name", require: true, type: "text", placeholder: "Operations manager" ,input:true,view:true},
      { field: "boposition", label: "Position", require: true, type: "text", placeholder: "Operations Head",input:true,view:true },
      { field: "bomobile", label: "Mobile", require: true, type: "text", placeholder: "+91 98765 43210",input:true,view:true },
      { field: "boemail", label: "Email", require: true, type: "email", placeholder: "operations@example.com",input:true,view:true },
      { field: "accname", label: "Name", require: true, type: "text", placeholder: "Accounts manager" ,input:true,view:true},
      { field: "accposition", label: "Position", require: true, type: "text", placeholder: "Accounts Head",input:true,view:true },
      { field: "accmobile", label: "Mobile", require: true, type: "text", placeholder: "+91 98765 43210" ,input:true,view:true},
      { field: "accemail", label: "Email", require: true, type: "email", placeholder: "accounts@example.com" ,input:true,view:true},
    ],
    []
  );
};
