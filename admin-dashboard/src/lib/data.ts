export const SIDEBAR_ITEMS = [
  { label: "لوحة التحكم", icon: "LayoutDashboard", href: "/" },
  { label: "الأعضاء", icon: "Users", href: "/members" },
  { label: "القيادات", icon: "Crown", href: "/leaders" },
  { label: "البطولات", icon: "Swords", href: "/tournaments" },
  { label: "الفعاليات", icon: "Calendar", href: "/events" },
  { label: "الترتيب", icon: "Medal", href: "/leaderboard" },
  { label: "الطلبات", icon: "ShoppingCart", href: "/orders" },
  { label: "الدعم", icon: "HeadphonesIcon", href: "/support" },
  { label: "إنستغرام", icon: "Instagram", href: "/instagram" },
  { label: "المعرض", icon: "Image", href: "/gallery" },
  { label: "الفيديوهات", icon: "Video", href: "/videos" },
  { label: "الإشعارات", icon: "Bell", href: "/notifications" },
  { label: "طلبات الانضمام", icon: "Hand", href: "/requests" },
  { label: "المستخدمين", icon: "UserCog", href: "/users" },
  { label: "سجل النشاطات", icon: "History", href: "/audit" },
  { label: "الإعدادات", icon: "Settings", href: "/settings" },
];

export const MOBILE_NAV_ITEMS = [
  { label: "الرئيسية", icon: "LayoutDashboard", href: "/" },
  { label: "الأعضاء", icon: "Users", href: "/members" },
  { label: "إضافة", icon: "Plus", href: "#", fab: true },
  { label: "التنبيهات", icon: "Bell", href: "/notifications" },
  { label: "الإعدادات", icon: "Settings", href: "/settings" },
];

export const STATS_DATA = [
  { label: "إجمالي الأعضاء", value: "—", change: 0, icon: "Users", color: "#E50914" },
  { label: "البطولات", value: "—", change: 0, icon: "Swords", color: "#FFD700" },
  { label: "الطلبات", value: "—", change: 0, icon: "ShoppingCart", color: "#00E676" },
  { label: "الدعم", value: "—", change: 0, icon: "HeadphonesIcon", color: "#FF3B30" },
];

export const CHART_DATA = {
  members: [
    { month: "Jan", value: 1200 },
    { month: "Feb", value: 1450 },
    { month: "Mar", value: 1680 },
    { month: "Apr", value: 1920 },
    { month: "May", value: 2150 },
    { month: "Jun", value: 2480 },
    { month: "Jul", value: 2847 },
  ],
  matches: [
    { name: "فوز", value: 12489, color: "#00E676" },
    { name: "خسارة", value: 8720, color: "#FF3B30" },
    { name: "تعادل", value: 3450, color: "#FFD700" },
  ],
  weekly: [
    { day: "Mon", active: 1200, new: 45 },
    { day: "Tue", active: 1350, new: 52 },
    { day: "Wed", active: 1100, new: 38 },
    { day: "Thu", active: 1480, new: 61 },
    { day: "Fri", active: 2200, new: 89 },
    { day: "Sat", active: 2600, new: 102 },
    { day: "Sun", active: 2100, new: 78 },
  ],
};
