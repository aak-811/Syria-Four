export interface Member {
  id: string;
  name: string;
  nickname: string;
  uid: string;
  rank: string;
  role: 'leader' | 'vice' | 'chief' | 'elite' | 'member';
  status: 'active' | 'inactive' | 'suspended';
  avatar: string;
  level: number;
  wins: number;
  joinDate: string;
  country: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
  scheduledFor?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  label: string;
  uploadedAt: string;
  size: number;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  avatar: string;
  timestamp: string;
  type: 'member' | 'tournament' | 'news' | 'system';
}

export interface StatCard {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

export interface SidebarItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}
