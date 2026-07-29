"use client";

import { useEffect, useRef, useState, useMemo } from "react";

const countryCoords: Record<string, { lat: number; lng: number; name: string }> = {
  SY: { lat: 34.8021, lng: 38.9968, name: "سوريا" },
  SA: { lat: 24.7136, lng: 46.6753, name: "السعودية" },
  AE: { lat: 23.4241, lng: 53.8478, name: "الإمارات" },
  EG: { lat: 26.8206, lng: 30.8025, name: "مصر" },
  IQ: { lat: 33.2232, lng: 43.6793, name: "العراق" },
  JO: { lat: 30.5852, lng: 36.2384, name: "الأردن" },
  LB: { lat: 33.8547, lng: 35.8623, name: "لبنان" },
  PS: { lat: 31.9522, lng: 35.2332, name: "فلسطين" },
  QA: { lat: 25.3548, lng: 51.1839, name: "قطر" },
  BH: { lat: 25.9304, lng: 50.6378, name: "البحرين" },
  KW: { lat: 29.3759, lng: 47.9774, name: "الكويت" },
  OM: { lat: 21.4735, lng: 55.9754, name: "عمان" },
  YE: { lat: 15.5527, lng: 48.5164, name: "اليمن" },
};

const namedLocations: Record<string, { lat: number; lng: number; city: string; gov: string }> = {
  // Syria cities
  "دمشق": { lat: 33.5131, lng: 36.2919, city: "دمشق", gov: "دمشق" },
  "Damascus": { lat: 33.5131, lng: 36.2919, city: "دمشق", gov: "دمشق" },
  "حلب": { lat: 36.2028, lng: 37.1343, city: "حلب", gov: "حلب" },
  "Aleppo": { lat: 36.2028, lng: 37.1343, city: "حلب", gov: "حلب" },
  "حمص": { lat: 34.7333, lng: 36.7167, city: "حمص", gov: "حمص" },
  "Homs": { lat: 34.7333, lng: 36.7167, city: "حمص", gov: "حمص" },
  "حماة": { lat: 35.1333, lng: 36.75, city: "حماة", gov: "حماة" },
  "Hama": { lat: 35.1333, lng: 36.75, city: "حماة", gov: "حماة" },
  "اللاذقية": { lat: 35.5167, lng: 35.7833, city: "اللاذقية", gov: "اللاذقية" },
  "Latakia": { lat: 35.5167, lng: 35.7833, city: "اللاذقية", gov: "اللاذقية" },
  "طرطوس": { lat: 34.8833, lng: 35.8833, city: "طرطوس", gov: "طرطوس" },
  "Tartus": { lat: 34.8833, lng: 35.8833, city: "طرطوس", gov: "طرطوس" },
  "الحسكة": { lat: 36.5, lng: 40.75, city: "الحسكة", gov: "الحسكة" },
  "القامشلي": { lat: 37.05, lng: 41.2167, city: "القامشلي", gov: "الحسكة" },
  "الرقة": { lat: 35.95, lng: 39.0167, city: "الرقة", gov: "الرقة" },
  "دير الزور": { lat: 35.2, lng: 40.1833, city: "دير الزور", gov: "دير الزور" },
  "إدلب": { lat: 35.9333, lng: 36.6333, city: "إدلب", gov: "إدلب" },
  "Idlib": { lat: 35.9333, lng: 36.6333, city: "إدلب", gov: "إدلب" },
  "درعا": { lat: 32.6167, lng: 36.1, city: "درعا", gov: "درعا" },
  "السويداء": { lat: 32.7, lng: 36.5667, city: "السويداء", gov: "السويداء" },
  // Country names (Arabic)
  "سوريا": { lat: 34.8021, lng: 38.9968, city: "سوريا", gov: "سوريا" },
  "السعودية": { lat: 24.7136, lng: 46.6753, city: "السعودية", gov: "السعودية" },
  "الإمارات": { lat: 23.4241, lng: 53.8478, city: "الإمارات", gov: "الإمارات" },
  "مصر": { lat: 26.8206, lng: 30.8025, city: "مصر", gov: "مصر" },
  "العراق": { lat: 33.2232, lng: 43.6793, city: "العراق", gov: "العراق" },
  "الأردن": { lat: 30.5852, lng: 36.2384, city: "الأردن", gov: "الأردن" },
  "لبنان": { lat: 33.8547, lng: 35.8623, city: "لبنان", gov: "لبنان" },
  "فلسطين": { lat: 31.9522, lng: 35.2332, city: "فلسطين", gov: "فلسطين" },
  "قطر": { lat: 25.3548, lng: 51.1839, city: "قطر", gov: "قطر" },
  "البحرين": { lat: 25.9304, lng: 50.6378, city: "البحرين", gov: "البحرين" },
  "الكويت": { lat: 29.3759, lng: 47.9774, city: "الكويت", gov: "الكويت" },
  "عمان": { lat: 21.4735, lng: 55.9754, city: "عمان", gov: "عمان" },
  "اليمن": { lat: 15.5527, lng: 48.5164, city: "اليمن", gov: "اليمن" },
};

function getMemberCoords(member: any, index: number): { lat: number; lng: number; city: string; gov: string } {
  const raw = [member.country, member.city, member.gov].filter(Boolean).join(" ");
  const vals = [member.country || "", member.city || "", member.gov || ""];

  // Exact match on any field
  for (const v of vals) {
    if (namedLocations[v]) return namedLocations[v];
    if (countryCoords[v]) {
      const cc = countryCoords[v];
      return { lat: cc.lat, lng: cc.lng, city: cc.name, gov: cc.name };
    }
  }

  // Partial match: find any namedLocation whose key is a substring of the input or vice versa
  for (const key of Object.keys(namedLocations)) {
    const loc = namedLocations[key];
    for (const v of vals) {
      if (v && (v.includes(key) || key.includes(v))) return loc;
    }
  }

  // Fallback - center on SY with deterministic offset based on index
  const offsets = [
    { lat: 0, lng: 0 }, { lat: 1.5, lng: -1 }, { lat: -1, lng: 1.5 },
    { lat: 0.5, lng: -2 }, { lat: -1.5, lng: -0.5 }, { lat: 2, lng: 1 },
    { lat: -0.5, lng: 2.5 }, { lat: 1, lng: -1.5 }, { lat: -2, lng: 0.5 },
    { lat: 0, lng: -3 },
  ];
  const o = offsets[index % offsets.length];
  return { lat: 34.8 + o.lat, lng: 38.9 + o.lng, city: vals[0] || "", gov: "" };
}

interface MemberLocation {
  member: any;
  lat: number;
  lng: number;
  city: string;
  gov: string;
}

function clusterMarkers(locations: MemberLocation[], radius: number = 0.5): (MemberLocation & { count: number })[] {
  const clusters: (MemberLocation & { count: number })[] = [];
  const used = new Set<number>();
  for (let i = 0; i < locations.length; i++) {
    if (used.has(i)) continue;
    const group: MemberLocation[] = [locations[i]];
    used.add(i);
    for (let j = i + 1; j < locations.length; j++) {
      if (used.has(j)) continue;
      const dx = locations[i].lat - locations[j].lat;
      const dy = locations[i].lng - locations[j].lng;
      if (Math.sqrt(dx * dx + dy * dy) < radius) {
        group.push(locations[j]);
        used.add(j);
      }
    }
    const avgLat = group.reduce((s, m) => s + m.lat, 0) / group.length;
    const avgLng = group.reduce((s, m) => s + m.lng, 0) / group.length;
    clusters.push({
      ...group[0],
      lat: avgLat,
      lng: avgLng,
      count: group.length,
      member: group[0].member,
    });
  }
  return clusters;
}

export default function MembersMap({
  members,
  hoveredId,
  onHover,
}: {
  members: any[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  const locations = useMemo(() => {
    return members.map((m, i) => {
      const c = getMemberCoords(m, i);
      return { member: m, ...c };
    });
  }, [members]);

  const clusters = useMemo(() => clusterMarkers(locations, 0.8), [locations]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;
    import("leaflet").then(async (LModule) => {
      const L = LModule.default || LModule;
      try { await import("leaflet/dist/leaflet.css"); } catch {};
      if (cancelled || !mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapRef.current, {
        center: [34.8, 38.9],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        dragging: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      const zoomControl = L.control.zoom({ position: "bottomright" });
      zoomControl.addTo(map);

      mapInstance.current = map;
      setMapReady(true);
    });
    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    if (!mapReady || !mapInstance.current || !L) return;
    const map = mapInstance.current;

    if (markersLayer.current) {
      map.removeLayer(markersLayer.current);
    }

    const layer = L.layerGroup();

    clusters.forEach((c) => {
      const isHovered = hoveredId === c.member.id;
      const iconHtml = c.count > 1
        ? `<div class="cluster-marker"><span>${c.count}</span></div>`
        : `<div class="member-pin ${isHovered ? "active" : ""}"><div class="pulse-ring"></div><div class="pin-dot"></div></div>`;

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([c.lat, c.lng], { icon });

      marker.on("mouseover", () => onHover(c.member.id));
      marker.on("mouseout", () => onHover(null));

      if (c.count === 1) {
        const member = c.member;
        const joined = member.joinDate || "2024-12-01";
        const isOnline = member.isOnline ?? Math.random() > 0.5;

        marker.bindTooltip(`
          <div class="member-tooltip">
            <div class="tooltip-avatar">
              <img src="${member.image || ""}" alt="${member.name || "?"}" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'tooltip-avatar-fallback\\'>${(member.name || "?").charAt(0)}</span>'" />
            </div>
            <div class="tooltip-info">
              <div class="tooltip-name">${member.name || "—"}</div>
              <div class="tooltip-city">${c.city || "—"}</div>
              <div class="tooltip-joined">انضم ${joined}</div>
              <div class="tooltip-status ${isOnline ? "online" : "offline"}">${isOnline ? "متصل 🟢" : "غير متصل ⚪"}</div>
            </div>
          </div>
        `, { direction: "top", offset: L.point(0, -10), className: "custom-tooltip" });

        marker.on("click", () => {
          window.location.href = `/members`;
        });
      }

      layer.addLayer(marker);
    });

    layer.addTo(map);
    markersLayer.current = layer;

    if (clusters.length > 0) {
      const bounds = L.latLngBounds(clusters.map((c: any) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [clusters, hoveredId, mapReady]);

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] md:min-h-[550px] rounded-[20px] overflow-hidden relative" />
  );
}
