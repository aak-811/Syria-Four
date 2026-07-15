export interface Member {
  id: string;
  name: string;
  gameId?: string;
  level?: string;
  rank?: string;
  role?: string;
  country?: string;
  age?: string;
  weapon?: string;
  wins?: string;
  joinDate?: string;
  instagram?: string;
  bio?: string;
  image?: string;
  prime?: string;
  code?: string;
  images?: string[];
}

export interface Tournament {
  id: string;
  name: string;
  type?: string;
  description?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  maxPlayers?: string;
  mode?: string;
  mapType?: string;
  persistent?: string;
  mapDesign?: string;
  winners?: string;
  prizeType?: string;
  prizeValue?: string;
  gold?: string;
  silver?: string;
  participants?: any[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  glory?: string;
  wars?: string;
}

export interface Order {
  id: string;
  playerName: string;
  playerId?: string;
  item?: string;
  payment?: string;
  status?: string;
  date?: string;
}

export interface SupportRequest {
  id: string;
  playerName: string;
  type?: string;
  message?: string;
  status?: string;
  date?: string;
}

export interface InstagramAccount {
  id: string;
  name: string;
  username: string;
  icon?: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  src: string;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface Notification {
  id: string;
  message: string;
  type?: string;
  active?: boolean;
  date?: string;
  read?: boolean;
}

export interface Player {
  id: string;
  name: string;
  slug: string;
  uid?: string;
  level?: string;
  rank?: string;
  rankPoints?: string;
  country?: string;
  language?: string;
  clan?: string;
  season?: string;
  joinDate?: string;
  yearsPlayed?: string;
  badges?: string;
  likes?: string;
  bio?: string;
  profileImage?: string;
  weapons?: any[];
  achievements?: any[];
  pet?: any;
  character?: any;
  gallery?: string[];
}

export interface JoinRequest {
  id: string;
  tournamentId: string;
  playerName: string;
  playerGameId: string;
  reason?: string;
  status?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  avatar?: string;
  cover?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip: string;
  createdAt: string;
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
