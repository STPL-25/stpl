import React, { useState ,JSX} from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import stplimage from "../assets/stpllogo.png";
import { CustomInputField } from "@/CustomComponent/InputComponents/CustomInputField";
import { useAppState } from "@/globalState/hooks/useAppState";
import { useLoginFields } from "@/FieldDatas/SignUpData";
import  usePost  from "@/hooks/usePostHook";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL as string;
const cryptoSecret = import.meta.env.VITE_CRYPTO_SECRET as string;

// Dynamic login form fields type
interface LoginForm {
  [key: string]: string;
}

export default function SignIn(): JSX.Element {
  const loginFields = useLoginFields();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({});
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const { postData } = usePost();
  const { decryptData, clearDecodeError, userData } = useAppState();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(userData);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningIn(true);
    clearDecodeError();

    try {
      const response = await postData(`${apiUrl}/api/secure/log_user`, { ...formData });

      if (response?.success) {
        toast.success(response?.message);
        localStorage.setItem("userToken", JSON.stringify(response.data));

        if (response?.data) {
          const decryptResult = await decryptData({
            encryptedData: response.data,
            secretKey: cryptoSecret,
          });

          console.log("Decryption Result:", decryptResult);

          if (decryptResult.type === "decode/decryptData/fulfilled") {
            console.log("Decrypted Data:", decryptResult.payload);
            setFormData({});
            // navigate("/Dashboard");
          } else {
            toast.error("Failed to decrypt user data: " + decryptResult.payload);
          }
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormData({});
      toast.error(error?.response?.data?.error || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
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

        {/* Right side - Sign in form */}
        <div className="flex w-full md:w-1/2 flex-col justify-center p-12">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>

            <form onSubmit={handleSignIn} className="space-y-5">
              {loginFields.map((fieldDef: any) => (
                <CustomInputField
                  key={fieldDef.field}
                  field={fieldDef.field}
                  label={fieldDef.label}
                  required={fieldDef.require !== false}
                  type={fieldDef.type || "text"}
                  value={formData[fieldDef.field] || ""}
                  options={fieldDef.options || []}
                  onChange={(val: string) => handleInputChange(fieldDef.field, val)}
                />
              ))}

              {/* Remember me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(val) => setRememberMe(Boolean(val))}
                />
                <Label htmlFor="remember-me" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </Label>
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 py-3 text-white font-medium"
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing in..." : "Sign in"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Sign Up */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
