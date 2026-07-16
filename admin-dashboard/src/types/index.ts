export interface Member {
  id: string; name: string; gameId?: string; level?: string; rank?: string;
  role?: string; country?: string; age?: string; weapon?: string; wins?: string;
  joinDate?: string; instagram?: string; bio?: string; image?: string; prime?: string;
}

export interface Tournament {
  id: string; name: string; type?: string; description?: string; startDate?: string;
  endDate?: string; mode?: string; mapType?: string; maxPlayers?: string;
  prizeType?: string; prizeValue?: string; teamsCount?: string; logo?: string;
  gold?: string; silver?: string; participants?: any[];
}

export interface Event {
  id: string; title: string; description?: string; icon?: string; createdAt?: string;
}

export interface LeaderboardEntry {
  id: string; name: string; glory?: string; wars?: string;
}

export interface Order {
  id: string; playerName: string; playerId?: string; item?: string; payment?: string; status?: string; date?: string;
}

export interface SupportRequest {
  id: string; playerName: string; type?: string; message?: string; status?: string; date?: string;
}

export interface InstagramAccount {
  id: string; name: string; username: string; icon?: string;
}

export interface GalleryItem {
  id: string; label: string; src: string;
}

export interface VideoItem {
  id: string; title: string; url: string; thumbnail?: string;
}

export interface Notification {
  id: string; message: string; type?: string; active?: boolean; date?: string; read?: boolean;
}

export interface Player {
  id: string; name: string; slug: string; uid?: string; level?: string; rank?: string;
  country?: string; bio?: string; profileImage?: string; gallery?: string[];
}

export interface JoinRequest {
  id: string; tournamentId: string; playerName: string; playerGameId: string; reason?: string; status?: string;
}

export interface User {
  id: string; name: string; username: string; email: string; role: string; status: string;
  verified: boolean; avatar?: string; cover?: string;
}

export interface AuditLog {
  id: string; userId: string; action: string; details: string; ip: string; createdAt: string;
}
