import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Activity, Smartphone, CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "01030950177";

export function PaymentPage() {
  const copyNumber = () => {
    navigator.clipboard.writeText(WHATSAPP_NUMBER);
    toast.success("تم نسخ رقم الواتساب");
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "مرحبًا، تم تحويل 100 جنيه لاشتراك رجع ظهرك. برجاء إرسال كود التفعيل."
    );
    window.open(`https://wa.me/2${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold text-white tracking-tighter">رجع ظهرك</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full">
              Scenice Approved
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">اشترك الآن</h1>
            <p className="text-xl text-gray-400">
              السعر الرمزي للوصول الكامل لجميع المستويات
            </p>
          </div>

          {/* Pricing Card */}
          <Card className="bg-card border-border mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <CardHeader className="text-center border-b border-border">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl text-white">الاشتراك الكامل</CardTitle>
              <CardDescription className="text-gray-400 text-base mt-2">
                4 مستويات خلال 4 أسابيع (أسبوع لكل مستوى)
              </CardDescription>
              <div className="mt-6 flex flex-col items-center">
                <span className="text-gray-400 line-through text-2xl">200 جنيه</span>
                <div className="text-5xl font-bold text-white">100 جنيه</div>
                <Badge variant="destructive" className="mt-2">
                  خصم 50% لفترة محدودة
                </Badge>
                <div className="text-gray-400 mt-2">دفعة واحدة - مدى الحياة</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>أول 7 أيام مجانية</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>الوصول لجميع التمارين والمستويات</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>كود التفعيل يُرسل بعد تأكيد التحويل</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-card border-border mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5" />
                طرق الدفع
              </CardTitle>
              <CardDescription className="text-gray-400">
                اختر طريقة الدفع المناسبة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vodafone Cash */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white">فودافون كاش</div>
                      <div className="text-sm text-gray-400">Vodafone Cash</div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary rounded p-3 border border-border">
                  <Label className="text-gray-400 text-sm block mb-1">رقم المحفظة:</Label>
                  <div className="text-2xl font-mono font-bold text-white tracking-wider">
                    01030950177
                  </div>
                </div>
              </div>

              {/* InstaPay */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white">إنستا باي</div>
                      <div className="text-sm text-gray-400">InstaPay</div>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary rounded p-3 border border-border">
                  <Label className="text-gray-400 text-sm block mb-1">رقم الهاتف:</Label>
                  <div className="text-2xl font-mono font-bold text-white">
                    01030950177
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-900/20 bg-opacity-30 border border-blue-900/50 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">خطوات الدفع:</h4>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. حوّل 100 جنيه على الرقم بالأعلى</li>
                  <li>2. أرسل صورة التحويل على واتساب</li>
                  <li>3. سيتم إرسال كود التفعيل بعد التأكيد</li>
                </ol>
              </div>

              {/* WhatsApp */}
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm">واتساب التأكيد</div>
                    <div className="text-xl font-bold text-white">{WHATSAPP_NUMBER}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyNumber}>
                      <Copy className="w-4 h-4 ml-2" />
                      نسخ
                    </Button>
                    <Button variant="default" size="sm" onClick={openWhatsApp}>
                      <MessageCircle className="w-4 h-4 ml-2" />
                      أرسل إثبات الدفع
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
