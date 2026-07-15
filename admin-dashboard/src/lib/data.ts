export const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  { label: "Members", icon: "Users", href: "/members" },
  { label: "Leaders", icon: "Crown", href: "/leaders" },
  { label: "Tournaments", icon: "Swords", href: "/tournaments" },
  { label: "Events", icon: "Calendar", href: "/events" },
  { label: "Leaderboard", icon: "Medal", href: "/leaderboard" },
  { label: "Orders", icon: "ShoppingCart", href: "/orders" },
  { label: "Support", icon: "HeadphonesIcon", href: "/support" },
  { label: "Instagram", icon: "Instagram", href: "/instagram" },
  { label: "Gallery", icon: "Image", href: "/gallery" },
  { label: "Videos", icon: "Video", href: "/videos" },
  { label: "Notifications", icon: "Bell", href: "/notifications" },
  { label: "Requests", icon: "Hand", href: "/requests" },
  { label: "Users", icon: "UserCog", href: "/users" },
  { label: "Audit Logs", icon: "History", href: "/audit" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];

export const MOBILE_NAV_ITEMS = [
  { label: "Home", icon: "LayoutDashboard", href: "/" },
  { label: "Members", icon: "Users", href: "/members" },
  { label: "Add", icon: "Plus", href: "#", fab: true },
  { label: "Alerts", icon: "Bell", href: "/notifications" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];

export const STATS_DATA = [
  { label: "Total Members", value: "—", change: 0, icon: "Users", color: "#E50914" },
  { label: "Tournaments", value: "—", change: 0, icon: "Swords", color: "#FFD700" },
  { label: "Orders", value: "—", change: 0, icon: "ShoppingCart", color: "#00E676" },
  { label: "Support", value: "—", change: 0, icon: "HeadphonesIcon", color: "#FF3B30" },
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
    { name: "Wins", value: 12489, color: "#00E676" },
    { name: "Losses", value: 8720, color: "#FF3B30" },
    { name: "Draws", value: 3450, color: "#FFD700" },
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
