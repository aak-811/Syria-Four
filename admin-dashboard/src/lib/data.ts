export const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "/" },
  { label: "Members", icon: "Users", href: "/members" },
  { label: "Leaders", icon: "Crown", href: "/leaders" },
  { label: "Tournaments", icon: "Swords", href: "/tournaments" },
  { label: "Events", icon: "Calendar", href: "/events" },
  { label: "Gallery", icon: "Image", href: "/gallery" },
  { label: "Videos", icon: "Video", href: "/videos" },
  { label: "News", icon: "Newspaper", href: "/news" },
  { label: "Messages", icon: "MessageSquare", href: "/messages" },
  { label: "Reports", icon: "BarChart3", href: "/reports" },
  { label: "Analytics", icon: "TrendingUp", href: "/analytics" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];

export const MOBILE_NAV_ITEMS = [
  { label: "Home", icon: "LayoutDashboard", href: "/" },
  { label: "Members", icon: "Users", href: "/members" },
  { label: "Add", icon: "Plus", href: "/add", fab: true },
  { label: "Alerts", icon: "Bell", href: "/notifications" },
  { label: "Settings", icon: "Settings", href: "/settings" },
];

export const STATS_DATA = [
  {
    label: "Total Members",
    value: "2,847",
    change: 12.5,
    icon: "Users",
    color: "#E50914",
  },
  {
    label: "Active Now",
    value: "1,243",
    change: -3.2,
    icon: "Activity",
    color: "#00E676",
  },
  {
    label: "Matches Today",
    value: "847",
    change: 8.1,
    icon: "Swords",
    color: "#FFD700",
  },
  {
    label: "Total Wins",
    value: "12,489",
    change: 15.7,
    icon: "Trophy",
    color: "#FF3B30",
  },
];

export const ACTIVITY_DATA = [
  {
    id: "1",
    action: "joined the clan",
    user: "ShadowStrike",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: "member" as const,
  },
  {
    id: "2",
    action: "won tournament",
    user: "PhoenixRise",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: "tournament" as const,
  },
  {
    id: "3",
    action: "promoted to Chief",
    user: "NightSlayer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Night",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "member" as const,
  },
  {
    id: "4",
    action: "posted new article",
    user: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: "news" as const,
  },
  {
    id: "5",
    action: "reached Grandmaster",
    user: "DarkWizard",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dark",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    type: "system" as const,
  },
];

export const MEMBERS_DATA = [
  { id: "1", name: "أبو أمير", nickname: "AbuAmir", uid: "1001", rank: "Grandmaster", role: "leader" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abu", level: 85, wins: 1240, joinDate: "2024-01-15", country: "SY" },
  { id: "2", name: "الزعيم", nickname: "AlZaeem", uid: "1002", rank: "Heroic", role: "chief" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zaeem", level: 72, wins: 980, joinDate: "2024-02-20", country: "SY" },
  { id: "3", name: "المحارب", nickname: "AlMohareb", uid: "1003", rank: "Elite", role: "vice" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohareb", level: 68, wins: 856, joinDate: "2024-03-10", country: "IQ" },
  { id: "4", name: "Night Slayer", nickname: "NSlayer", uid: "1004", rank: "Master", role: "elite" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Slayer", level: 60, wins: 720, joinDate: "2024-04-05", country: "SA" },
  { id: "5", name: "Dark Phoenix", nickname: "DPhoenix", uid: "1005", rank: "Diamond", role: "member" as const, status: "inactive" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix2", level: 45, wins: 510, joinDate: "2024-05-18", country: "EG" },
  { id: "6", name: "قصي", nickname: "Qusai", uid: "1006", rank: "Platinum", role: "member" as const, status: "active" as const, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Qusai", level: 38, wins: 420, joinDate: "2024-06-22", country: "SY" },
];

export const NEWS_DATA = [
  { id: "1", title: "Season 7 Battle Pass Rewards Revealed", content: "Exciting new rewards for Season 7 including exclusive skins...", excerpt: "Get ready for the most epic season yet with exclusive rewards.", image: "https://picsum.photos/seed/news1/800/400", category: "Updates", tags: ["season7", "battlepass"], author: "Admin", publishedAt: "2025-12-01", status: "published" as const },
  { id: "2", title: "New Tournament Mode: Arena Wars", content: "Introducing Arena Wars - a 4v4 tactical mode...", excerpt: "Team up and dominate in the new Arena Wars mode.", image: "https://picsum.photos/seed/news2/800/400", category: "Events", tags: ["tournament", "arena"], author: "Admin", publishedAt: "2025-11-28", status: "published" as const },
  { id: "3", title: "Community Night Highlights", content: "Last night's community event was amazing...", excerpt: "Relive the best moments from Community Night.", image: "https://picsum.photos/seed/news3/800/400", category: "Community", tags: ["community", "highlights"], author: "Admin", publishedAt: "2025-11-25", status: "draft" as const },
];

export const GALLERY_DATA = [
  { id: "1", src: "https://picsum.photos/seed/g1/600/600", label: "Clan Meetup 2025", uploadedAt: "2025-12-01", size: 2400000 },
  { id: "2", src: "https://picsum.photos/seed/g2/600/600", label: "Tournament Victory", uploadedAt: "2025-11-28", size: 1800000 },
  { id: "3", src: "https://picsum.photos/seed/g3/600/600", label: "Team Photo", uploadedAt: "2025-11-25", size: 3100000 },
  { id: "4", src: "https://picsum.photos/seed/g4/600/600", label: "Stream Setup", uploadedAt: "2025-11-20", size: 1500000 },
  { id: "5", src: "https://picsum.photos/seed/g5/600/600", label: "Award Ceremony", uploadedAt: "2025-11-18", size: 2900000 },
  { id: "6", src: "https://picsum.photos/seed/g6/600/600", label: "Bootcamp", uploadedAt: "2025-11-15", size: 2100000 },
];

export const VIDEOS_DATA = [
  { id: "1", title: "Epic Montage - Best Moments 2025", url: "https://youtube.com/watch?v=1", thumbnail: "https://picsum.photos/seed/v1/640/360", duration: "12:34", views: 45230, uploadedAt: "2025-12-01" },
  { id: "2", title: "Tournament Finals - Full Match", url: "https://youtube.com/watch?v=2", thumbnail: "https://picsum.photos/seed/v2/640/360", duration: "45:12", views: 28300, uploadedAt: "2025-11-28" },
  { id: "3", title: "How to Improve Your Aim - Tutorial", url: "https://youtube.com/watch?v=3", thumbnail: "https://picsum.photos/seed/v3/640/360", duration: "8:45", views: 18900, uploadedAt: "2025-11-25" },
];

export const NOTIFICATIONS_DATA = [
  { id: "1", title: "New Member Joined", message: "ShadowStrike has joined the clan", type: "success" as const, read: false, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "2", title: "Tournament Starting Soon", message: "Arena Wars tournament begins in 1 hour", type: "warning" as const, read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "3", title: "Server Maintenance", message: "Scheduled maintenance at 3:00 AM", type: "info" as const, read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", title: "Achievement Unlocked", message: "Clan reached 1000 total wins!", type: "success" as const, read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "5", title: "Member Report", message: "Inappropriate behavior reported in chat", type: "error" as const, read: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
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
