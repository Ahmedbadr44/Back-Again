import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { firebaseStorage as storage } from "./utils/storageFirebase";

export default function App() {
  useEffect(() => {
    storage.trackSiteVisit();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
