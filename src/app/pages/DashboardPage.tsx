import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { firebaseStorage as storage } from "../utils/storageFirebase";
import { auth } from "../utils/firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Lock,
  LogOut,
  Play,
  Trophy,
  Zap,
  Key
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

// Mock user data


// Mock exercises for today

const ADMIN_EMAIL = "ahmedbadr004500@gmail.com";
const TOTAL_DAYS = 28;

export function DashboardPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoadTimedOut(true);
      setPageLoading(false);
    }, 6000);

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      window.clearTimeout(timeoutId);
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setPageLoading(true);
      setExercisesLoading(true);
      try {
        await storage.initialize();

        const quickUser = storage.getUserQuick?.();
        if (quickUser) {
          setUser(quickUser);
          setPageLoading(false);
        }

        // Load user first to render partial UI quickly
        const currentUserData = await storage.getUser();
        setUser(currentUserData);
        setPageLoading(false);

        // Load exercises in background
        storage.getAllExercises()
          .then((allExercises) => setExercises(allExercises))
          .catch((error) => console.error(error))
          .finally(() => setExercisesLoading(false));
      } catch (error) {
        console.error(error);
        setExercisesLoading(false);
        setPageLoading(false);
      }
    });

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [navigate]);

  if (pageLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
        <Activity className="w-12 h-12 text-primary animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-white animate-pulse">
          {loadTimedOut ? "التطبيق يحتاج وقتًا أطول من المتوقع. جرّب إعادة التحميل." : "جارٍ تحميل بياناتك..."}
        </h2>
      </div>
    );
  }
  const currentDay = user.currentDay;


  const todaysExercises = exercises.filter(e => e.day === currentDay);
  const completedExercisesCount = todaysExercises.filter(e => e.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercisesCount / totalExercises) * 100 : 0;

  const isFreeDay = currentDay <= 7; // First 7 days are free
  const isPremium = !!user.isPremium;
  const isAdmin = user.email === ADMIN_EMAIL;

  const handleActivateCode = async () => {
    try {
      await storage.redeemActivationCode(activationCode);
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      setShowActivationDialog(false);
      toast.success("تم تفعيل حسابك بنجاح!");
    } catch (error: any) {
      if (error?.message === "CODE_NOT_FOUND") {
        toast.error("الكود غير موجود");
      } else if (error?.message === "CODE_USED") {
        toast.error("الكود مستخدم من قبل");
      } else if (error?.message === "AUTH_REQUIRED") {
        toast.error("يجب تسجيل الدخول أولًا");
      } else {
        toast.error("حدث خطأ أثناء التفعيل");
      }
    }
  };

  const handleDayClick = async (day: number) => {
    if (day <= 7 || isPremium) {
      const updatedUser = { ...user, currentDay: day };
      await storage.saveUser(updatedUser);
      setUser(updatedUser);
    } else {
      setShowActivationDialog(true);
    }
  };

  const handleLogout = async () => {
    await storage.logout();
    navigate("/login");
  };

  const handleCompleteExercise = (exerciseId: number) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: true } : ex
    ));
    setSelectedExercise(null);
  };

  const handleCompleteDayChallenge = () => {
    if (completedExercisesCount === totalExercises) {
      setDayCompleted(true);
      // TODO: Update user progress in database
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row lg:justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter">رجع ظهرك</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full">
              Scenice Approved
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
            <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-500">{user.streak} يوم</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{user.xp} XP</span>
            </div>
            {!isAdmin && !isPremium && (
              <Link to="/payment">
                <Button variant="default" size="sm" className="bg-primary hover:bg-red-700 text-white font-bold shadow-lg">
                  اشترك الآن
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg">
                  <Lock className="w-4 h-4 mr-2" />
                  لوحة الإدارة (Admin)
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">مرحباً، {user.name}!</h1>
          <p className="text-gray-400">
            اليوم هو يومك رقم {user.currentDay} من برنامج الـ 4 أسابيع (أسبوع لكل مستوى)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-white">تحدي اليوم - اليوم {user.currentDay}</CardTitle>
                    <CardDescription className="text-base mt-2 text-gray-400">
                      {completedExercisesCount} من {totalExercises} تمارين مكتملة
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary text-white text-lg px-4 py-2 hover:bg-red-700">
                    <Clock className="w-4 h-4 ml-1" />
                    15 دقيقة
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="h-3 mb-4 bg-secondary" />

                {!dayCompleted ? (
                  <>
                    {exercisesLoading && (
                      <div className="text-sm text-gray-400 mb-3">جارٍ تحميل التمارين...</div>
                    )}
                    {/* Exercise List */}
                    <div className="space-y-3 mb-4">
                      {todaysExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className={`border rounded-xl p-4 transition-all duration-300 ${exercise.completed
                            ? "bg-green-900/20 border-green-800"
                            : "bg-secondary/50 border-border hover:bg-secondary hover:translate-x-1"
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-shrink-0">
                              {exercise.completed ? (
                                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                  <Play className="w-6 h-6 text-primary ml-1" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-bold text-lg ${exercise.completed ? 'text-gray-400' : 'text-white'}`}>{exercise.nameAr || exercise.name}</h3>
                              <p className="text-sm text-gray-400">{exercise.nameEn}</p>
                              <p className="text-sm text-gray-500 mt-1">{exercise.instructions}</p>
                            </div>
                            <div className="flex-shrink-0 text-left w-full sm:w-auto">
                              <Badge variant="outline">{exercise.duration}</Badge>
                              {!exercise.completed && (
                                <Button
                                  size="sm"
                                  className="mt-2 w-full sm:w-auto"
                                  onClick={() => setSelectedExercise(exercise)}
                                >
                                  ابدأ
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Complete Day Button */}
                    {totalExercises > 0 && completedExercisesCount === totalExercises && (
                      <Button
                        onClick={handleCompleteDayChallenge}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-[0_0_20px_rgba(22,163,74,0.3)] animate-pulse"
                        size="lg"
                      >
                        <Trophy className="w-5 h-5 ml-2" />
                        أكمل تحدي اليوم واحصل على مكافأة!
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500 animate-bounce">
                      <Trophy className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white">أحسنت!</h3>
                    <p className="text-gray-400 mb-6">
                      لقد أكملت تحدي اليوم {user.currentDay}
                    </p>
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-border rounded-xl p-6 mb-6 inline-block">
                      <div className="flex items-center gap-8 text-center">
                        <div>
                          <div className="text-3xl font-bold text-primary">+100</div>
                          <div className="text-sm text-gray-400">نقاط XP</div>
                        </div>
                        <div className="w-px h-12 bg-gray-700"></div>
                        <div>
                          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-500">
                            <Flame className="w-6 h-6" />
                            <span className="tabular-nums">{user.streak + 1}</span>
                          </div>
                          <div className="text-sm text-gray-400">سلسلة أيام</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      عد غداً للتحدي القادم!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4-Week Calendar */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5 text-primary" />
                  رحلتك في التحدي (4 أسابيع • أسبوع لكل مستوى)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {Array.from({ length: TOTAL_DAYS }, (_, i) => {
                    const day = i + 1;
                    const isCompleted = user.completedDays.includes(day);
                    const isCurrent = day === user.currentDay;
                    const isLocked = day > user.currentDay;

                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${isCompleted
                          ? "bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.4)]"
                          : isCurrent
                            ? "bg-primary text-white ring-2 ring-red-400 ring-offset-2 ring-offset-background scale-110"
                            : isLocked
                              ? "bg-secondary/50 text-gray-600 border border-border"
                              : "bg-secondary text-gray-300"
                          }`}
                      >
                        {isLocked ? <Lock className="w-4 h-4" /> : day}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">إحصائياتك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-300">سلسلة الأيام</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-500">{user.streak}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-300">نقاط XP</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{user.xp}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-300">أيام مكتملة</span>
                  </div>
                  <span className="text-2xl font-bold text-green-500">{user.completedDays.length}/{TOTAL_DAYS}</span>
                </div>

                <Progress value={(user.completedDays.length / TOTAL_DAYS) * 100} className="h-2" />
                <p className="text-sm text-center text-gray-600">
                  {TOTAL_DAYS - user.completedDays.length} يوم متبقي لإكمال التحدي
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  شارات الإنجاز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {user.badges.map((badge: any) => (
                    <div
                      key={badge.id}
                      className={`text-center p-3 rounded-lg border-2 transition-all ${badge.earned
                        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                        : "bg-gray-50 border-gray-200 opacity-50"
                        }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-xs font-medium">{badge.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="bg-gradient-to-br from-primary to-rose-900 border-none text-white shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300 animate-bounce" />
                  <h3 className="font-bold text-lg mb-2">استمر!</h3>
                  <p className="text-sm text-white/90">
                    أنت تحقق تقدماً رائعاً. كل يوم تمارين، ظهرك يشكرك!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedExercise.nameAr || selectedExercise.name}</CardTitle>
              <CardDescription>{selectedExercise.nameEn}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exercise Images */}
              {(() => {
                const startImage = selectedExercise.startImageUrl || selectedExercise.thumbnail;
                const endImage = selectedExercise.endImageUrl || selectedExercise.startImageUrl || selectedExercise.thumbnail;
                const hasDistinctEndImage = Boolean(endImage && startImage && endImage !== startImage);

                return (
                  <div className={`grid gap-4 ${hasDistinctEndImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        {hasDistinctEndImage ? "بداية التمرين" : "صورة التمرين"}
                      </div>
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <ImageWithFallback
                          src={startImage}
                          alt={`${hasDistinctEndImage ? "بداية" : "صورة"} ${selectedExercise.nameAr || selectedExercise.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {hasDistinctEndImage && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">نهاية التمرين</div>
                        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                          <ImageWithFallback
                            src={endImage}
                            alt={`نهاية ${selectedExercise.nameAr || selectedExercise.name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">التعليمات:</h4>
                <p className="text-gray-700">{selectedExercise.instructions}</p>
              </div>

              {selectedExercise.benefits && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">فوائد التمرين:</h4>
                  <p className="text-gray-700">{selectedExercise.benefits}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => handleCompleteExercise(selectedExercise.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                  أكملت التمرين
                </Button>
                <Button
                  onClick={() => setSelectedExercise(null)}
                  variant="outline"
                  size="lg"
                >
                  إغلاق
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activation Dialog */}
      {showActivationDialog && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تفعيل الحساب</DialogTitle>
              <DialogDescription>
                أدخل كود التفعيل الخاص بك للوصول إلى جميع أيام التحدي
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="activation-code">كود التفعيل</Label>
              <Input
                id="activation-code"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="BH-XXXX"
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleActivateCode}
                className="bg-green-600 hover:bg-green-700"
              >
                تفعيل
              </Button>
              <Button
                onClick={() => setShowActivationDialog(false)}
                variant="outline"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

