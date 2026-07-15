export const ADMIN_SIDEBAR_ITEMS = [
  { label: "لوحة التحكم", icon: "LayoutDashboard", href: "/admin" },
  { label: "الأعضاء", icon: "Users", href: "/admin/members" },
  { label: "القيادات", icon: "Crown", href: "/admin/leaders" },
  { label: "البطولات", icon: "Swords", href: "/admin/tournaments" },
  { label: "الفعاليات", icon: "Calendar", href: "/admin/events" },
  { label: "الترتيب", icon: "Medal", href: "/admin/leaderboard" },
  { label: "الطلبات", icon: "ShoppingCart", href: "/admin/orders" },
  { label: "الدعم", icon: "HeadphonesIcon", href: "/admin/support" },
  { label: "إنستغرام", icon: "Instagram", href: "/admin/instagram" },
  { label: "المعرض", icon: "Image", href: "/admin/gallery" },
  { label: "الفيديوهات", icon: "Video", href: "/admin/videos" },
  { label: "الإشعارات", icon: "Bell", href: "/admin/notifications" },
  { label: "طلبات الانضمام", icon: "Hand", href: "/admin/requests" },
  { label: "المستخدمين", icon: "UserCog", href: "/admin/users" },
  { label: "سجل النشاطات", icon: "History", href: "/admin/audit" },
  { label: "الإعدادات", icon: "Settings", href: "/admin/settings" },
];

export const PUBLIC_SIDEBAR_ITEMS = [
  { label: "الرئيسية", icon: "LayoutDashboard", href: "/" },
  { label: "القيادات", icon: "Crown", href: "/leaders" },
  { label: "الأعضاء", icon: "Users", href: "/members" },
  { label: "البطولات", icon: "Swords", href: "/tournaments" },
  { label: "الفعاليات", icon: "Calendar", href: "/events" },
  { label: "المعرض", icon: "Image", href: "/gallery" },
  { label: "الشحن", icon: "ShoppingCart", href: "/shop" },
  { label: "القوانين", icon: "Hand", href: "/rules" },
  { label: "الدعم", icon: "HeadphonesIcon", href: "/support" },
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
