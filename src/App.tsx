

import Dashboard from "./ApplicationPages/Dashboard";
import SignIn from "./ApplicationPages/SignIn";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { useAppState } from "./globalState/hooks/useAppState";
import { useEffect } from "react";
import Signup from "./ApplicationPages/SignupPage";
import axios from "axios";

// Define types (adjust as needed)
interface UserDataItem {
  ecno?: string;
  ename?: string;
  [key: string]: any;
}

interface StoredUserToken {
  encrypted?: string;
  [key: string]: any;
}

function App() {
  const { userData, decryptData } = useAppState();

  console.log(userData)
  const cryptoSecret = import.meta.env.VITE_CRYPTO_SECRET as string;

  useEffect(() => {
    const stored = localStorage.getItem("userToken");

    if (stored) {
      let storedUserToken: StoredUserToken | null = null;

      try {
        storedUserToken = JSON.parse(stored);
      } catch (error) {
        console.error("Invalid JSON from localStorage userToken");
      }

      if (
        storedUserToken &&
        (!userData || Object.keys(userData).length === 0)
      ) {
        decryptData({
          encryptedData: storedUserToken,
          secretKey: cryptoSecret,
        });
      }
    }
  }, [cryptoSecret, decryptData, userData]);

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        userData && Object.keys(userData).length > 0 ? (
          (userData as UserDataItem[])[0]?.ecno &&
          (userData as UserDataItem[])[0]?.ename ? (
            <Dashboard />
          ) : (
            <SignIn />
          )
        ) : (
          <SignIn />
        ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
