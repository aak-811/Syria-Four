"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";

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

const syrianCities: { lat: number; lng: number; city: string; gov: string }[] = [
  { lat: 33.5131, lng: 36.2919, city: "دمشق", gov: "دمشق" },
  { lat: 36.2028, lng: 37.1343, city: "حلب", gov: "حلب" },
  { lat: 34.7333, lng: 36.7167, city: "حمص", gov: "حمص" },
  { lat: 35.1333, lng: 36.7500, city: "حماة", gov: "حماة" },
  { lat: 35.5167, lng: 35.7833, city: "اللاذقية", gov: "اللاذقية" },
  { lat: 35.6500, lng: 35.8833, city: "طرطوس", gov: "طرطوس" },
  { lat: 37.0500, lng: 41.2167, city: "القامشلي", gov: "الحسكة" },
  { lat: 36.5000, lng: 40.7500, city: "الحسكة", gov: "الحسكة" },
  { lat: 35.9500, lng: 39.0167, city: "الرقة", gov: "الرقة" },
  { lat: 35.2000, lng: 40.1833, city: "دير الزور", gov: "دير الزور" },
  { lat: 33.4500, lng: 36.6000, city: "دوما", gov: "ريف دمشق" },
  { lat: 34.5500, lng: 38.2833, city: "تدمر", gov: "حمص" },
  { lat: 35.6167, lng: 35.7833, city: "جبلة", gov: "اللاذقية" },
  { lat: 34.8833, lng: 36.3167, city: "مصياف", gov: "حماة" },
  { lat: 35.4000, lng: 36.5833, city: "سلمية", gov: "حماة" },
  { lat: 34.7439, lng: 36.7183, city: "الرستن", gov: "حمص" },
  { lat: 36.6667, lng: 36.9833, city: "عفرين", gov: "حلب" },
  { lat: 36.1667, lng: 36.6167, city: "إدلب", gov: "إدلب" },
  { lat: 35.1333, lng: 37.0667, city: "السفيرة", gov: "حلب" },
  { lat: 34.4667, lng: 36.9833, city: "السخنة", gov: "حمص" },
];

function getRandomSyrianCity() {
  return syrianCities[Math.floor(Math.random() * syrianCities.length)];
}

function getMemberCoords(member: any, index: number) {
  if (member.country === "SY" || !member.country) {
    const c = getRandomSyrianCity();
    return { lat: c.lat + (Math.random() - 0.5) * 0.1, lng: c.lng + (Math.random() - 0.5) * 0.1, city: c.city, gov: c.gov };
  }
  const cc = countryCoords[member.country];
  if (cc) {
    return { lat: cc.lat + (Math.random() - 0.5) * 2, lng: cc.lng + (Math.random() - 0.5) * 2, city: cc.name, gov: cc.name };
  }
  return { lat: 34.8 + (Math.random() - 0.5) * 5, lng: 38.9 + (Math.random() - 0.5) * 5, city: "", gov: "" };
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

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
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
      const bounds = L.latLngBounds(clusters.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [clusters, hoveredId, mapReady]);

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] md:min-h-[550px] rounded-[20px] overflow-hidden relative" />
  );
}
