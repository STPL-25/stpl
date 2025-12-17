import React,{JSX} from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import stplimage from "../assets/stpllogo.png";
import { CustomInputField } from "@/CustomComponent/InputComponents/CustomInputField";
import { useAppState } from "@/globalState/hooks/useAppState";
// import ECNOInputWithLookup from ".././componentss/AdditionalComponent/ECNOInputWithLookup";
import { toast } from "sonner";
import usePost from "@/hooks/usePostHook";
import { useSignUpFields } from "@/FieldDatas/SignUpData";

const apiUrl = import.meta.env.VITE_API_URL as string;

type FieldDef = {
  field: string;
  label?: string;
  type?: string;
  placeholder?: string;
  require?: boolean;
  options?: Array<{ label?: string; value?: any }>;
  maxLength?: number;
};

export default function SignUp(): JSX.Element {
  const navigate = useNavigate();
  const signUpFields = useSignUpFields();
  const { formData, setFormData } = useAppState() as {
    formData: Record<string, any>;
    setFormData: (v: Record<string, any>) => void;
  };
  const { postData } = usePost();

  const handleInputChange = (field: string, value: any) => {
    const fieldDef = (signUpFields as FieldDef[]).find((f) => f.field === field);

    if (fieldDef && fieldDef.type === "select") {
      const selectedOption = fieldDef.options?.find((opt) => opt.value == value);
      const updatedFormData = {
        ...formData,
        [field]: selectedOption ? selectedOption.value : value,
      };
      setFormData(updatedFormData);
    } else {
      const updatedFormData = {
        ...formData,
        [field]: value,
      };
      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postData(`${apiUrl}/api/secure/sign_up`, formData);
      if (response?.success) {
        toast.success(response?.message);
        setFormData({});
        // small delay so user can read toast, then navigate
        setTimeout(() => {
          navigate("/");
        }, 6000);
      }
    } catch (error: any) {
      console.error("Error submitting form data:", error);
      setFormData({});
      toast.error(error?.response?.data?.error || "Failed to submit form");
    }
  };

  const handleSendOTP = async () => {
    // implement OTP logic if required
  };

  const renderInputField = (fieldDef: FieldDef) => {
    // if (fieldDef.field === "ecno") {
    //   return (
    //     <ECNOInputWithLookup
    //       key={fieldDef.field}
    //       field={fieldDef.field}
    //       label={fieldDef.label}
    //       required={fieldDef.require !== false}
    //       type={fieldDef.type || "text"}
    //       placeholder={fieldDef.placeholder}
    //       value={formData ? formData[fieldDef.field] || "" : ""}
    //       maxLength={fieldDef?.maxLength}
    //       onChange={(val: any) => handleInputChange(fieldDef.field, val)}
    //     />
    //   );
    // }

    return (
      <CustomInputField
        key={fieldDef.field}
        field={fieldDef.field}
        label={fieldDef.label||''}
        required={fieldDef.require !== false}
        type={fieldDef.type || "text"}
        placeholder={fieldDef.placeholder}
        // options={fieldDef?.options || []}
        value={formData ? formData[fieldDef.field] || "" : ""}
        maxLength={fieldDef?.maxLength}
        onChange={(val: any) => handleInputChange(fieldDef.field, val)}
      />
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 p-4">
      <div className="w-full max-w-6xl rounded-lg bg-white shadow-2xl flex overflow-hidden">
        {/* Left side - Welcome Panel */}
        <div className="relative hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800 p-12 text-white md:flex">
          <img src={stplimage} alt="STPL Logo" />
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500 opacity-40" />
          <h2 className="text-base uppercase mb-8 tracking-[0.3em] font-extrabold text-white">
            STPL NON TRADE APPLICATION
          </h2>
        </div>

        {/* Right side - Signup form */}
        <div className="flex w-full md:w-1/2 flex-col justify-center p-12">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>

            <form onSubmit={handleSubmit} className="space-y-2">
              {signUpFields.map((fieldDef: any) => renderInputField(fieldDef))}

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 py-3 text-white font-medium "
              >
                Create Account
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
