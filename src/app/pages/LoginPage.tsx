import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Mail } from "lucide-react";
import { firebaseStorage as storage } from "../utils/storageFirebase";
import { auth } from "../utils/firebase";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await storage.loginWithGoogle();
      const isAdmin = auth.currentUser?.email === "ahmedbadr004500@gmail.com";
      toast.success("تم تسجيل الدخول بنجاح");
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <Activity className="w-10 h-10 text-primary animate-pulse" />
            <span className="text-3xl font-bold text-white tracking-tighter">رجع ظهرك</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full">
              Scenice Approved
            </span>
          </Link>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center text-gray-400">
              سجّل دخولك باستخدام Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Mail className="ml-2 h-4 w-4" />
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول باستخدام Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
