import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useState } from "react";
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Menu,
  Shield,
  Trophy,
  X,
  Zap
} from "lucide-react";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 scroll-smooth" dir="rtl">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row lg:justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold text-white tracking-tighter">رجع ظهرك</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full">
              Scenice Approved
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-300">
            <a href="#home" className="hover:text-white transition-colors">الرئيسية</a>
            <a href="#about" className="hover:text-white transition-colors">عن البرنامج</a>
            <a href="#problems" className="hover:text-white transition-colors">المشاكل</a>
            <a href="#how" className="hover:text-white transition-colors">كيف يعمل</a>
            <a href="#pricing" className="hover:text-white transition-colors">الأسعار</a>
          </nav>
          <div className="flex w-full lg:w-auto justify-center lg:justify-end gap-3 items-center">
            <div className="hidden lg:flex gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">ابدأ الآن</Button>
              </Link>
            </div>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-full border border-border bg-secondary/40 p-2 text-gray-200 hover:text-white hover:bg-secondary/60 transition-colors"
              aria-label="فتح القائمة"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-nav" className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3 text-sm text-gray-300">
              <a href="#home" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                الرئيسية
              </a>
              <a href="#about" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                عن البرنامج
              </a>
              <a href="#problems" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                المشاكل
              </a>
              <a href="#how" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                كيف يعمل
              </a>
              <a href="#pricing" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                الأسعار
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">ابدأ الآن</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="container mx-auto px-4 py-20 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight leading-tight">
          برنامج علاجي من <span className="text-primary">4 مستويات</span>
          <br />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800">
            أسبوع واحد لكل مستوى
          </span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          15 دقيقة يوميًا فقط — تمارين علاجية آمنة لتخفيف آلام الظهر الشائعة
          <br />
          بدون أدوية، بدون ملل، بطريقة ممتعة وبسيطة.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-primary hover:bg-red-700 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all transform hover:scale-105">
              ابدأ التحدي الآن
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10">
          <div className="flex items-center justify-center gap-2 text-gray-300 bg-secondary/30 p-4 rounded-xl border border-border text-sm sm:text-base">
            <Clock className="w-6 h-6 text-primary" />
            <span className="font-medium">15 دقيقة يوميًا</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-300 bg-secondary/30 p-4 rounded-xl border border-border">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="font-medium">4 مستويات خلال 4 أسابيع (أسبوع لكل مستوى)</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-300 bg-secondary/30 p-4 rounded-xl border border-border">
            <Award className="w-6 h-6 text-primary" />
            <span className="font-medium">مكافآت وإنجازات</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-secondary/20 to-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Shield className="w-4 h-4" />
              موثوق ومراجع
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4">
              عن البرنامج – لماذا هذا البرنامج مختلف؟
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
              هذا البرنامج تم بناؤه بعناية من شخص عانى لسنوات من آلام الظهر ومشكلات الوضعية، واعتمد خلال رحلته
              على خبرة عملية طويلة وتوجيه مباشر من مختصين في العلاج الطبيعي والتأهيل الحركي.
            </p>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
              تمت مراجعة المحتوى من أخصائيي علاج طبيعي معتمدين لضمان السلامة والفعالية، مع الحفاظ على البساطة
              وسهولة التطبيق في الحياة اليومية.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-blue-400" />
                  القصة والخبرة
                </CardTitle>
                <CardDescription className="text-gray-400">
                  تجربة شخصية طويلة دعمتها متابعة من مختصين في العلاج الطبيعي.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  مراجعة طبية
                </CardTitle>
                <CardDescription className="text-gray-400">
                  تمت مراجعة البرنامج بواسطة أخصائيي علاج طبيعي لضمان السلامة.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Award className="w-5 h-5 text-yellow-400" />
                  هدف واضح
                </CardTitle>
                <CardDescription className="text-gray-400">
                  نقل المعرفة العلاجية بشكل بسيط وتمكين الشخص من تحسين وضعه بأمان.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">تدرّج الأسابيع</CardTitle>
                <CardDescription className="text-gray-400">
                  تقدّم محسوب بدون تحميل زائد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "أسبوع 1: تنشيط وتحكم",
                  "أسبوع 2: ثبات وتوازن",
                  "أسبوع 3: قوة وظيفية",
                  "أسبوع 4: دمج وتحسين الحركة",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white text-xl font-bold">
                  <Calendar className="w-5 h-5 text-primary" />
                  4 أسابيع
                </div>
                <div className="text-xs text-gray-400 mt-2">خطة منظمة ومقسمة</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white text-xl font-bold">
                  <Clock className="w-5 h-5 text-primary" />
                  15 دقيقة
                </div>
                <div className="text-xs text-gray-400 mt-2">روتين يومي بسيط</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white text-xl font-bold">
                  <Shield className="w-5 h-5 text-primary" />
                  تمارين آمنة
                </div>
                <div className="text-xs text-gray-400 mt-2">لمعظم الحالات غير الحادة</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-white text-xl font-bold">
                  <Zap className="w-5 h-5 text-primary" />
                  تدرّج محسوب
                </div>
                <div className="text-xs text-gray-400 mt-2">بدون تحميل زائد</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Pain Problems Section */}
      <section id="problems" className="bg-gradient-to-b from-background to-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              هل تعاني من هذه المشاكل؟
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              البرنامج مصمم للتعامل مع أكثر مشاكل الظهر شيوعًا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 bg-card border-border group hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white group-hover:text-primary transition-colors">
                  <span className="text-2xl">💢</span>
                  شد وتيبس عضلي
                </CardTitle>
                <CardDescription className="text-base text-right text-gray-400">
                  الأكثر شيوعًا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">عضلات مشدودة لفترات طويلة</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">بسبب الجلوس الطويل والتوتر</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <span className="text-2xl">⚡</span>
                  ضعف عضلات البطن والحوض
                </CardTitle>
                <CardDescription className="text-base text-right text-gray-400">
                  شائع جدًا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">الجسم يعوض بعضلات أخرى → ألم مزمن</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">قلة الحركة تزيد المشكلة</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <span className="text-2xl">⚖️</span>
                  اختلال التوازن العضلي
                </CardTitle>
                <CardDescription className="text-base text-right text-gray-400">
                  سبب شائع للألم المزمن
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">يمين أقوى من شمال</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">أمامي أقوى من خلفي</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🪑</span>
                  وضعية جلوس سيئة
                </CardTitle>
                <CardDescription className="text-base text-right text-gray-400">
                  تزيد الألم تدريجيًا
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">انحناء الرقبة والكتفين</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">ميلان الحوض</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">قادم قريبًا</h2>
            <p className="text-gray-400 text-sm sm:text-base">برنامج خاص بمشاكل الركبة</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">آراء العملاء</h2>
            <p className="text-base sm:text-lg text-gray-400">سنضيف التجارب الحقيقية قريبًا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-card border-border text-center">
                <CardHeader>
                  <CardTitle className="text-white">قريبًا</CardTitle>
                  <CardDescription className="text-gray-400">سيتم إضافة رأي عميل هنا</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">—</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              لماذا نحن مختلفون؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center hover:bg-secondary/50 transition-colors bg-card border-border group">
              <CardHeader>
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-green-500" />
                </div>
                <CardTitle className="text-lg text-white font-bold">تمارين آمنة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  مناسبة لكل المستويات والأعمار
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:bg-secondary/50 transition-colors bg-card border-border group">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-blue-500" />
                </div>
                <CardTitle className="text-lg text-white font-bold">نتائج ملموسة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  تقدم واضح خلال الأسابيع الأولى
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:bg-secondary/50 transition-colors bg-card border-border group">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-purple-500" />
                </div>
                <CardTitle className="text-lg text-white font-bold">إشراف علاجي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  تم تصميم البرنامج بعناية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:bg-secondary/50 transition-colors bg-card border-border group">
              <CardHeader>
                <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-orange-500" />
                </div>
                <CardTitle className="text-lg text-white font-bold">15 دقيقة فقط</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  نتائج قوية بدون ضغط وقت
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              كيف يعمل البرنامج؟
            </h2>
            <p className="text-base sm:text-lg text-gray-400">
              بسيط، ممتع، وفعّال
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center relative group">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">سجّل دخولك بجوجل</h3>
              <p className="text-gray-400">
                دخول سريع وآمن بنقرة واحدة.
              </p>
            </div>

            <div className="text-center relative group">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">ابدأ التمارين اليومية</h3>
              <p className="text-gray-400">
                كل يوم تمرين بسيط لمدة 15 دقيقة.
              </p>
            </div>

            <div className="text-center relative group">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">فعّل باقي المستويات</h3>
              <p className="text-gray-400">
                بعد أول أسبوع، استخدم كود التفعيل لإكمال البرنامج.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              ابدأ رحلتك اليوم
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <Link to="/signup">
                <Button variant="outline" className="border-primary text-white hover:bg-primary/20">
                  ابدأ مجانًا
                </Button>
              </Link>
            </div>
            <p className="text-base sm:text-lg text-gray-400">
              سعر رمزي - <span className="line-through decoration-red-500">200 جنيه</span> <span className="text-white font-bold">100 جنيه فقط</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Start Free Card */}
            <Card className="border border-emerald-600/40 bg-card shadow-lg h-full">
              <div className="flex h-full flex-col">
              <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl text-white font-black">ابدأ مجانًا</CardTitle>
              <CardDescription className="text-gray-400 text-sm sm:text-base">أسبوع كامل مجاني للتجربة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">الوصول لأيام الأسبوع الأول فقط</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">بدون دفع أو كود تفعيل</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">تجربة كاملة للمستوى الأول</p>
                </div>
                <div className="pt-2">
                  <Link to="/signup" className="block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 text-lg shadow-lg">
                      ابدأ مجانًا
                    </Button>
                  </Link>
                </div>
              </CardContent>
              </div>
            </Card>

            {/* Paid Card */}
            <Card className="border-2 border-primary hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all duration-300 bg-card transform hover:-translate-y-2 h-full relative">
              <div className="flex h-full flex-col">
              <div className="flex justify-center -mt-4">
                <Badge className="bg-primary text-white px-6 py-2 text-base font-bold shadow-lg pointer-events-none select-none">
                  الأكثر شعبية
                </Badge>
              </div>
              <CardHeader className="text-center pt-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CardTitle className="text-3xl sm:text-4xl text-white font-black">الاشتراك الكامل</CardTitle>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-gray-400 line-through text-xl sm:text-2xl">200 جنيه</span>
                  <span className="text-4xl sm:text-5xl font-bold text-white">100 جنيه</span>
                  <Badge variant="destructive" className="mt-2 animate-pulse">
                    خصم 50% لفترة محدودة
                  </Badge>
                </div>
                <p className="text-gray-400 mt-2">
                  دفعة واحدة - مدى الحياة
                </p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">الوصول لكل المستويات (4 مستويات خلال 4 أسابيع - أسبوع لكل مستوى)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">متابعة التقدم والإنجازات</p>
                </div>
                <div className="pt-2">
                  <Link to="/payment" className="block">
                    <Button className="w-full bg-primary hover:bg-red-700 text-white font-bold h-14 text-lg shadow-lg hover:shadow-primary/50 transition-all" size="lg">
                      اشترك الآن
                    </Button>
                  </Link>
                </div>
              </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-12 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-yellow-700 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  تنويه طبي مهم
                </h3>
                <p className="text-yellow-800 leading-relaxed">
                  هذا البرنامج مخصص للآلام غير الحادة. ليس بديلاً عن الاستشارة الطبية.
                  إذا كنت تعاني من إصابة حادة أو حالة طبية خطيرة، يرجى استشارة طبيبك قبل البدء.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">رجع ظهرك</span>
              </div>
              <p className="text-gray-400">
                برنامج علاجي بسيط وفعّال للتخلص من آلام الظهر بطريقة آمنة.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">تسجيل الدخول</Link></li>
                <li><Link to="/signup" className="hover:text-white">إنشاء حساب</Link></li>
                <li><Link to="/payment" className="hover:text-white">الدفع</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">الشروط والأحكام</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-white">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-white">التنويه الطبي</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 رجع ظهرك. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
