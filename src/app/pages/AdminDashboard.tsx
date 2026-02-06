import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { firebaseStorage as storage } from "../utils/storageFirebase";
import { auth } from "../utils/firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Save,
  X,
  ShieldCheck,
  KeyRound,
  Copy,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { WEEK_PROGRAM_EXERCISES } from "../data/seedExercises";

const ADMIN_EMAILS = ["ahmedbadr004500@gmail.com"];
const TOTAL_DAYS = 28;

type Exercise = {
  id: number;
  day: number;
  nameAr: string;
  nameEn: string;
  duration: string;
  instructions: string;
  benefits?: string;
  videoUrl: string;
  startImageUrl?: string;
  endImageUrl?: string;
  thumbnail?: string;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  currentDay: number;
  streak: number;
  xp: number;
  completedDays: number[];
  isPremium: boolean;
  badges: any[];
};

type ActivationCode = {
  id: string;
  code: string;
  used?: boolean;
  usedByEmail?: string;
  createdAt?: any;
  usedAt?: any;
};

const normalizeName = (value: string) => value.trim().toLowerCase();
const buildNameKey = (nameAr: string, nameEn: string) =>
  `${normalizeName(nameAr)}|${normalizeName(nameEn)}`;
const normalizeKey = (exercise: Pick<Exercise, "day" | "nameAr" | "nameEn">) =>
  `${exercise.day}|${buildNameKey(exercise.nameAr, exercise.nameEn)}`;

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [showUniqueExercises, setShowUniqueExercises] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    day: 1,
    nameAr: "",
    nameEn: "",
    duration: "",
    instructions: "",
    benefits: "",
  });
  const [isSavingExercise, setIsSavingExercise] = useState(false);
  const [startImageFile, setStartImageFile] = useState<File | null>(null);
  const [endImageFile, setEndImageFile] = useState<File | null>(null);
  const [startImagePreview, setStartImagePreview] = useState<string | null>(null);
  const [endImagePreview, setEndImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "start" | "end">("idle");
  const [isSeedingExercises, setIsSeedingExercises] = useState(false);
  const [isReplacingExercises, setIsReplacingExercises] = useState(false);

  const [codeInput, setCodeInput] = useState("");

  const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
    let timeoutId: number | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
  };
  const UPLOAD_TIMEOUT_MS = 20000;

  const dayLabel = (day: number) => {
    const labels = [
      "اليوم الأول",
      "اليوم الثاني",
      "اليوم الثالث",
      "اليوم الرابع",
      "اليوم الخامس",
      "اليوم السادس",
      "اليوم السابع",
      "اليوم الثامن",
      "اليوم التاسع",
      "اليوم العاشر",
      "اليوم الحادي عشر",
      "اليوم الثاني عشر",
      "اليوم الثالث عشر",
      "اليوم الرابع عشر",
      "اليوم الخامس عشر",
      "اليوم السادس عشر",
      "اليوم السابع عشر",
      "اليوم الثامن عشر",
      "اليوم التاسع عشر",
      "اليوم العشرون",
      "اليوم الحادي والعشرون",
      "اليوم الثاني والعشرون",
      "اليوم الثالث والعشرون",
      "اليوم الرابع والعشرون",
      "اليوم الخامس والعشرون",
      "اليوم السادس والعشرون",
      "اليوم السابع والعشرون",
      "اليوم الثامن والعشرون",
    ];
    return labels[day - 1] || `اليوم ${day}`;
  };

  const dayCounts = useMemo(() => {
    const counts = new Map<number, number>();
    exercises.forEach((exercise) => {
      counts.set(exercise.day, (counts.get(exercise.day) || 0) + 1);
    });
    return counts;
  }, [exercises]);

  const loadAdminData = async () => {
    setDataLoading(true);
    try {
      await storage.initialize();
      const [allUsers, allExercises, allCodes, visitors] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllExercises(),
        storage.getAllActivationCodes(),
        storage.getVisitorCount(),
      ]);

      setUsers(allUsers as AdminUser[]);
      setExercises(allExercises as Exercise[]);
      setCodes(allCodes);
      setVisitorCount(visitors);
    } catch (error) {
      console.error(error);
      toast.error("تعذر تحميل بيانات لوحة الإدارة");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAuthTimedOut(true);
      setLoading(false);
    }, 6000);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      window.clearTimeout(timeoutId);
      if (!user) {
        navigate("/login");
        return;
      }

      if (user.email && !ADMIN_EMAILS.includes(user.email)) {
        toast.error("غير مصرح لك بالدخول إلى لوحة الإدارة");
        navigate("/dashboard");
        return;
      }

      setLoading(false);
      await loadAdminData();
    });

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!startImageFile) {
      setStartImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(startImageFile);
    setStartImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [startImageFile]);

  useEffect(() => {
    if (!endImageFile) {
      setEndImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(endImageFile);
    setEndImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [endImageFile]);

  useEffect(() => {
    if (!isExerciseDialogOpen) {
      setIsSavingExercise(false);
      setUploadProgress(0);
      setUploadStage("idle");
    }
  }, [isExerciseDialogOpen]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const filteredExercises = useMemo(() => {
    if (selectedDay === "all") return exercises;
    return exercises.filter((exercise) => exercise.day === selectedDay);
  }, [exercises, selectedDay]);

  const daysToRender = useMemo(() => {
    if (selectedDay === "all") {
      return Array.from(new Set(filteredExercises.map((exercise) => exercise.day))).sort((a, b) => a - b);
    }
    return [selectedDay];
  }, [filteredExercises, selectedDay]);

  const uniqueExercises = useMemo(() => {
    const map = new Map<
      string,
      { exercise: Exercise; count: number; days: number[]; weeks: number[] }
    >();
    exercises.forEach((exercise) => {
      const key = buildNameKey(exercise.nameAr, exercise.nameEn);
      const week = Math.ceil(exercise.day / 7);
      const entry = map.get(key);
      if (!entry) {
        map.set(key, { exercise, count: 1, days: [exercise.day], weeks: [week] });
      } else {
        entry.count += 1;
        entry.days.push(exercise.day);
        entry.weeks.push(week);
      }
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        days: Array.from(new Set(entry.days)).sort((a, b) => a - b),
        weeks: Array.from(new Set(entry.weeks)).sort((a, b) => a - b),
      }))
      .sort((a, b) => a.exercise.nameAr.localeCompare(b.exercise.nameAr, "ar"));
  }, [exercises]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const premiumUsers = users.filter((u) => u.isPremium).length;
    const freeUsers = totalUsers - premiumUsers;
    const totalExercises = exercises.length;
    const totalCodes = codes.length;
    const usedCodes = codes.filter((c) => c.used).length;
    return {
      totalUsers,
      premiumUsers,
      freeUsers,
      totalExercises,
      totalCodes,
      usedCodes,
    };
  }, [users, exercises, codes]);

  const handleAddExercise = () => {
    setIsSavingExercise(false);
    setUploadProgress(0);
    setUploadStage("idle");
    setEditingExercise(null);
    setExerciseForm({
      day: typeof selectedDay === "number" ? selectedDay : 1,
      nameAr: "",
      nameEn: "",
      duration: "",
      instructions: "",
      benefits: "",
    });
    setStartImageFile(null);
    setEndImageFile(null);
    setStartImagePreview(null);
    setEndImagePreview(null);
    setIsExerciseDialogOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setIsSavingExercise(false);
    setUploadProgress(0);
    setUploadStage("idle");
    setEditingExercise(exercise);
    setExerciseForm({
      day: exercise.day,
      nameAr: exercise.nameAr,
      nameEn: exercise.nameEn,
      duration: exercise.duration,
      instructions: exercise.instructions,
      benefits: exercise.benefits || "",
    });
    setStartImageFile(null);
    setEndImageFile(null);
    setStartImagePreview(null);
    setEndImagePreview(null);
    setIsExerciseDialogOpen(true);
  };

  const handleSaveExercise = async () => {
    if (!editingExercise && !startImageFile && !endImageFile) {
      toast.error("يرجى رفع صورة واحدة على الأقل للتمرين.");
      return;
    }

    setIsSavingExercise(true);
    setUploadProgress(0);
    setUploadStage("start");
    try {
      const exerciseId = editingExercise ? editingExercise.id : Date.now();
      const fallbackImage = "https://images.unsplash.com/photo-1544367563-121542f83d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80";

      let startImageUrl = editingExercise?.startImageUrl || editingExercise?.thumbnail || fallbackImage;
      let endImageUrl = editingExercise?.endImageUrl || editingExercise?.startImageUrl || editingExercise?.thumbnail || fallbackImage;

      if (startImageFile) {
        startImageUrl = await withTimeout(
          storage.uploadExerciseImage(startImageFile, exerciseId, "start", (progress) => {
            setUploadProgress(Math.round(progress * 0.5));
          }),
          UPLOAD_TIMEOUT_MS
        );
        setUploadProgress(50);
      } else {
        setUploadProgress(50);
      }
      if (endImageFile) {
        setUploadStage("end");
        endImageUrl = await withTimeout(
          storage.uploadExerciseImage(endImageFile, exerciseId, "end", (progress) => {
            setUploadProgress(50 + Math.round(progress * 0.5));
          }),
          UPLOAD_TIMEOUT_MS
        );
        setUploadProgress(100);
      } else {
        setUploadProgress(100);
      }

      if (startImageFile && !endImageFile) {
        endImageUrl = startImageUrl;
      }
      if (!startImageFile && endImageFile) {
        startImageUrl = endImageUrl;
      }

      const exerciseToSave = {
        id: exerciseId,
        day: exerciseForm.day,
        nameAr: exerciseForm.nameAr,
        nameEn: exerciseForm.nameEn,
        duration: exerciseForm.duration,
        instructions: exerciseForm.instructions,
        benefits: exerciseForm.benefits,
        videoUrl: "",
        startImageUrl,
        endImageUrl,
        thumbnail: startImageUrl,
      };

      let updatedExercises = await storage.saveExercise(exerciseToSave as Exercise);
      let updatedDuplicates = 0;
      const shouldPropagateImages = Boolean(startImageFile || endImageFile);

      if (shouldPropagateImages) {
        const nameKey = buildNameKey(exerciseForm.nameAr, exerciseForm.nameEn);
        const duplicates = (updatedExercises as Exercise[]).filter(
          (exercise) => buildNameKey(exercise.nameAr, exercise.nameEn) === nameKey && exercise.id !== exerciseId
        );

        if (duplicates.length > 0) {
          for (const duplicate of duplicates) {
            await storage.saveExercise({
              ...duplicate,
              startImageUrl,
              endImageUrl,
              thumbnail: startImageUrl,
            } as Exercise);
          }
          updatedDuplicates = duplicates.length;
          updatedExercises = await storage.getAllExercises();
        }
      }

      setExercises(updatedExercises as Exercise[]);
      setIsExerciseDialogOpen(false);
      if (updatedDuplicates > 0) {
        toast.success(`تم حفظ التمرين وتحديث الصور لـ ${updatedDuplicates} نسخة`);
      } else {
        toast.success("تم حفظ التمرين بنجاح");
      }
    } catch (error: any) {
      console.error(error);
      const message = typeof error?.message === "string" ? error.message : "";
      if (message === "UPLOAD_TIMEOUT") {
        toast.error("رفع الصور أخذ وقتًا طويلًا. جرّب صورة أصغر أو أعد المحاولة.");
      } else if (message.startsWith("CLOUDINARY_UPLOAD_FAILED")) {
        toast.error("تعذر رفع الصور على Cloudinary. تأكد من إعداد upload preset.");
      } else if (message === "CLOUDINARY_UPLOAD_NETWORK_ERROR") {
        toast.error("تعذر الاتصال بخدمة Cloudinary. تحقق من الإنترنت وحاول مرة أخرى.");
      } else if (message === "CLOUDINARY_NO_URL") {
        toast.error("رفع الصور تم بدون رابط. راجع إعدادات Cloudinary.");
      } else {
        toast.error("تعذر حفظ التمرين. حاول مرة أخرى.");
      }
    } finally {
      setIsSavingExercise(false);
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التمرين؟")) {
      const updated = await storage.deleteExercise(id);
      setExercises(updated as Exercise[]);
      toast.success("تم حذف التمرين");
    }
  };

  const handlePromoteUser = async (user: AdminUser) => {
    try {
      await storage.updateUserById(user.id, { isPremium: !user.isPremium });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isPremium: !u.isPremium } : u)));
      toast.success(user.isPremium ? "تم إلغاء الترقية" : "تمت الترقية بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحديث المستخدم");
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${user.name}؟`)) {
      try {
        await storage.deleteUserById(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success("تم حذف المستخدم");
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء حذف المستخدم");
      }
    }
  };

  const handleGenerateCode = async () => {
    const code = codeInput.trim() || `BH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    try {
      await storage.createActivationCode(code);
      const refreshed = await storage.getAllActivationCodes();
      setCodes(refreshed);
      setCodeInput("");
      toast.success("تم إنشاء الكود");
    } catch (error) {
      console.error(error);
      toast.error("تعذر إنشاء الكود (قد يكون مستخدمًا بالفعل)");
    }
  };

  const handleDeleteCode = async (code: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الكود؟")) {
      try {
        await storage.deleteActivationCode(code);
        setCodes((prev) => prev.filter((c) => c.code !== code));
        toast.success("تم حذف الكود");
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء حذف الكود");
      }
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success("تم نسخ الكود");
  };

  const seedWeekProgram = async (mode: "add" | "replace") => {
    if (mode === "replace") {
      if (!confirm("سيتم حذف كل تمارين الأيام 1-28 وإعادة الاستيراد. هل أنت متأكد؟")) {
        return;
      }
      setIsReplacingExercises(true);
    } else {
      setIsSeedingExercises(true);
    }

    try {
      if (mode === "replace") {
        const programDays = new Set(WEEK_PROGRAM_EXERCISES.map((exercise) => exercise.day));
        const toDelete = exercises.filter((exercise) => programDays.has(exercise.day));

        for (const exercise of toDelete) {
          await storage.deleteExercise(exercise.id);
        }
      }

      const freshExercises = await storage.getAllExercises();
      const existingKeys = new Set(
        freshExercises.map((exercise) => normalizeKey(exercise as Exercise))
      );
      const existingIds = new Set(freshExercises.map((exercise) => (exercise as Exercise).id));
      const now = Date.now();

      const toCreate = WEEK_PROGRAM_EXERCISES.filter((exercise) => !existingKeys.has(normalizeKey(exercise)));
      const skipped = WEEK_PROGRAM_EXERCISES.length - toCreate.length;

      if (toCreate.length === 0) {
        toast.info("كل تمارين الأسابيع 1-4 موجودة بالفعل.");
        setExercises(freshExercises as Exercise[]);
        return;
      }

      let updatedExercises: Exercise[] = freshExercises as Exercise[];
      let index = 0;
      for (const exercise of toCreate) {
        const id = existingIds.has(exercise.id) ? now + index : exercise.id;
        existingIds.add(id);
        updatedExercises = await storage.saveExercise({ ...exercise, id } as Exercise);
        index += 1;
      }

      setExercises(updatedExercises as Exercise[]);
      toast.success(`تمت إضافة ${toCreate.length} تمرين${skipped ? ` (تم تخطي ${skipped})` : ""}`);
    } catch (error) {
      console.error(error);
      toast.error("تعذر استيراد التمارين. حاول مرة أخرى.");
    } finally {
      setIsSeedingExercises(false);
      setIsReplacingExercises(false);
    }
  };

  const handleSeedWeekProgram = async () => seedWeekProgram("add");
  const handleReplaceWeekProgram = async () => seedWeekProgram("replace");

  const currentStartImage =
    startImagePreview || editingExercise?.startImageUrl || editingExercise?.thumbnail || "";
  const currentEndImage =
    endImagePreview || editingExercise?.endImageUrl || editingExercise?.startImageUrl || editingExercise?.thumbnail || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-white">
          {authTimedOut ? "تعذر التحقق من الحساب. حاول مرة أخرى." : "جارٍ تحميل لوحة الإدارة..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">لوحة الإدارة</span>
          </div>
          <div className="flex w-full sm:w-auto justify-center sm:justify-end gap-3 flex-wrap">
            <Link to="/dashboard">
              <Button variant="outline" className="text-white border-border hover:bg-secondary">عرض التطبيق</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">العودة للرئيسية</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المستخدمين</CardTitle>
              <Users className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600 mt-1">{stats.premiumUsers} مدفوع • {stats.freeUsers} مجاني</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">زوار الموقع</CardTitle>
              <Eye className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{visitorCount}</div>
              <p className="text-xs text-gray-600 mt-1">إجمالي الزيارات (تقريبي)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي التمارين</CardTitle>
              <Activity className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalExercises}</div>
              <p className="text-xs text-gray-600 mt-1">تمارين مضافة للنظام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">أكواد التفعيل</CardTitle>
              <KeyRound className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCodes}</div>
              <p className="text-xs text-gray-600 mt-1">{stats.usedCodes} مستخدم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">إيراد متوقع</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${stats.premiumUsers * 19}</div>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                تقديري
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="gap-2 flex-wrap">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              إدارة المستخدمين
            </TabsTrigger>
            <TabsTrigger value="exercises" className="gap-2">
              <Activity className="w-4 h-4" />
              إدارة التمارين
            </TabsTrigger>
            <TabsTrigger value="codes" className="gap-2">
              <KeyRound className="w-4 h-4" />
              إدارة الاشتراكات/الأكواد
            </TabsTrigger>
          </TabsList>
          <div className="flex justify-end">
            <Button variant="outline" onClick={loadAdminData} disabled={dataLoading}>
              {dataLoading ? "جارٍ التحديث..." : "تحديث البيانات"}
            </Button>
          </div>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>قائمة المستخدمين</CardTitle>
                    <CardDescription>عرض، بحث، حذف وترقية المستخدمين</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="بحث..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dataLoading && (
                  <div className="text-sm text-gray-500 mb-3">جارٍ تحميل البيانات...</div>
                )}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">اليوم الحالي</TableHead>
                        <TableHead className="text-right">السلسلة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.isPremium ? "default" : "secondary"}>
                              {user.isPremium ? "مدفوع" : "مجاني"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.currentDay}/{TOTAL_DAYS}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-orange-600">🔥 {user.streak}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePromoteUser(user)}
                              >
                                {user.isPremium ? "إلغاء الترقية" : "ترقية"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <CardTitle>إدارة التمارين</CardTitle>
                    <CardDescription>إضافة وتعديل وحذف التمارين</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSeedWeekProgram}
                      disabled={isSeedingExercises || isReplacingExercises}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      {isSeedingExercises ? "جاري الاستيراد..." : "استيراد برنامج الأسابيع 1-4"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReplaceWeekProgram}
                      disabled={isSeedingExercises || isReplacingExercises}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      {isReplacingExercises ? "جاري الاستبدال..." : "استبدال البرنامج (حذف القديم)"}
                    </Button>
                    <Button onClick={handleAddExercise}>
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة تمرين جديد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dataLoading && (
                  <div className="text-sm text-gray-500 mb-3">جارٍ تحميل البيانات...</div>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Button
                    variant={!showUniqueExercises ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowUniqueExercises(false)}
                  >
                    عرض حسب الأيام
                  </Button>
                  <Button
                    variant={showUniqueExercises ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowUniqueExercises(true)}
                  >
                    عرض بدون تكرار
                  </Button>
                  <span className="text-[11px] text-muted-foreground">
                    تعديل الصور يتم تعميمه تلقائيًا على النسخ المتكررة
                  </span>
                </div>
                {showUniqueExercises ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {uniqueExercises.map(({ exercise, count, weeks }) => (
                      <div
                        key={`${exercise.nameAr}-${exercise.nameEn}`}
                        className="flex flex-col gap-3 p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/95 to-white/90 text-gray-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                              <ImageWithFallback
                                src={exercise.thumbnail || exercise.startImageUrl || exercise.endImageUrl}
                                alt={exercise.nameAr}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-lg font-semibold text-gray-900">{exercise.nameAr}</div>
                            <div className="text-sm text-gray-500">{exercise.nameEn}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline">
                              عدد النسخ: <span dir="ltr" className="tabular-nums">{count}</span>
                            </Badge>
                            <Badge variant="secondary" className="text-[11px]">
                              {weeks.length === 1 ? "الأسبوع" : "الأسابيع"}:{" "}
                              <span dir="ltr" className="tabular-nums">
                                {weeks.join("، ")}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="rounded-xl bg-gray-50/80 border border-gray-100 px-3 py-2 text-sm text-gray-700 leading-relaxed">
                          المدة تختلف حسب الأسبوع. يمكنك تعديل الصور وسيتم تعميمها تلقائيًا.
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditExercise(exercise)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
                      <Button
                        variant={selectedDay === "all" ? "default" : "outline"}
                        size="sm"
                        className="h-16 flex-col items-center justify-center gap-1"
                        onClick={() => setSelectedDay("all")}
                      >
                        <span className="text-xs font-bold">الكل</span>
                        <span className="text-[11px] text-muted-foreground">{exercises.length} تمرين</span>
                      </Button>
                      {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
                        <Button
                          key={day}
                          variant={selectedDay === day ? "default" : "outline"}
                          size="sm"
                          className="h-16 flex-col items-center justify-center gap-1"
                          onClick={() => setSelectedDay(day)}
                        >
                          <span className="text-xs font-bold">{dayLabel(day)}</span>
                          <span className="text-[11px] text-muted-foreground">{dayCounts.get(day) || 0} تمرين</span>
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {daysToRender.length === 0 && (
                        <div className="text-sm text-gray-500">لا توجد تمارين لهذا اليوم.</div>
                      )}
                      {daysToRender.map((day) => (
                        <div key={day} className="border rounded-lg p-4">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            {dayLabel(day)}
                            <span className="text-sm text-gray-500">({dayCounts.get(day) || 0} تمرين)</span>
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {filteredExercises.filter((e) => e.day === day).map((exercise) => (
                              <div
                                key={exercise.id}
                                className="flex flex-col gap-3 p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/95 to-white/90 text-gray-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                                      <ImageWithFallback
                                        src={exercise.thumbnail || exercise.startImageUrl || exercise.endImageUrl}
                                        alt={exercise.nameAr}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-lg font-semibold text-gray-900">{exercise.nameAr}</div>
                                      <div className="text-sm text-gray-500">{exercise.nameEn}</div>
                                    </div>
                                  </div>
                                  <div className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{exercise.duration}</span>
                                  </div>
                                </div>
                                <div className="rounded-xl bg-gray-50/80 border border-gray-100 px-3 py-2 text-sm text-gray-700 leading-relaxed">
                                  <span className="font-semibold text-gray-900">التعليمات: </span>
                                  {exercise.instructions}
                                </div>
                                {exercise.benefits && (
                                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-sm text-emerald-800 leading-relaxed">
                                    <span className="font-semibold">الفوائد: </span>
                                    {exercise.benefits}
                                  </div>
                                )}
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditExercise(exercise)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteExercise(exercise.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Codes Tab */}
          <TabsContent value="codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الاشتراكات/الأكواد</CardTitle>
                <CardDescription>إنشاء أكواد تفعيل وإدارتها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataLoading && (
                  <div className="text-sm text-gray-500 mb-3">جارٍ تحميل البيانات...</div>
                )}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="code-input">كود التفعيل (اختياري)</Label>
                    <Input
                      id="code-input"
                      placeholder="BH-XXXX"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleGenerateCode}>
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء كود
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الكود</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">المستخدم</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {codes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono">{code.code}</TableCell>
                          <TableCell>
                            <Badge variant={code.used ? "secondary" : "default"}>
                              {code.used ? "مستخدم" : "متاح"}
                            </Badge>
                          </TableCell>
                          <TableCell>{code.usedByEmail || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => copyCode(code.code)}>
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteCode(code.code)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Exercise Dialog */}
      <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "تعديل التمرين" : "إضافة تمرين جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل تفاصيل التمرين بالعربية والإنجليزية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">اليوم</Label>
                <Input
                  id="day"
                  type="number"
                  min="1"
                  max={TOTAL_DAYS}
                  value={exerciseForm.day}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, day: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  placeholder="مثال: 2 دقيقة"
                  value={exerciseForm.duration}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameAr">اسم التمرين (بالعربية)</Label>
              <Input
                id="nameAr"
                placeholder="مثال: تمدد القطة والبقرة"
                value={exerciseForm.nameAr}
                onChange={(e) => setExerciseForm({ ...exerciseForm, nameAr: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">اسم التمرين (بالإنجليزية)</Label>
              <Input
                id="nameEn"
                placeholder="Example: Cat-Cow Stretch"
                value={exerciseForm.nameEn}
                onChange={(e) => setExerciseForm({ ...exerciseForm, nameEn: e.target.value })}
                dir="ltr"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">التعليمات</Label>
              <Textarea
                id="instructions"
                placeholder="اشرح كيفية أداء التمرين..."
                value={exerciseForm.instructions}
                onChange={(e) => setExerciseForm({ ...exerciseForm, instructions: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">فوائد التمرين</Label>
              <Textarea
                id="benefits"
                placeholder="اذكر فوائد التمرين باختصار..."
                value={exerciseForm.benefits}
                onChange={(e) => setExerciseForm({ ...exerciseForm, benefits: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startImage">صورة التمرين (أساسية)</Label>
                <Input
                  id="startImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStartImageFile(e.target.files?.[0] ?? null)}
                />
                <div className="h-32 w-full rounded-lg border border-dashed border-border bg-muted/40 overflow-hidden flex items-center justify-center">
                  {currentStartImage ? (
                    <ImageWithFallback
                      src={currentStartImage}
                      alt="صورة التمرين"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">لم يتم اختيار صورة</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endImage">صورة نهاية التمرين (اختياري)</Label>
                <Input
                  id="endImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEndImageFile(e.target.files?.[0] ?? null)}
                />
                <div className="h-32 w-full rounded-lg border border-dashed border-border bg-muted/40 overflow-hidden flex items-center justify-center">
                  {currentEndImage ? (
                    <ImageWithFallback
                      src={currentEndImage}
                      alt="صورة نهاية التمرين"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">لم يتم اختيار صورة</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              يمكنك رفع صورة واحدة فقط، وسيتم استخدامها كبداية ونهاية. صورة النهاية اختيارية.
            </div>
          </div>

          {isSavingExercise && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {uploadStage === "start" ? "جارٍ رفع صورة البداية" : uploadStage === "end" ? "جارٍ رفع صورة النهاية" : "جارٍ الرفع"} • {uploadProgress}%
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExerciseDialogOpen(false)}>
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSaveExercise} disabled={isSavingExercise}>
              <Save className="w-4 h-4 ml-2" />
              {isSavingExercise ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

