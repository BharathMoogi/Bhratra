'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import {
  MapPin, Navigation, Map as MapIcon, Plus, Trash2, Eye, Compass,
  Activity, Users, Info, Crosshair, Search, Fuel, Utensils,
  PlusCircle, Loader2, Hospital, Wrench, Shield, Check, X
} from 'lucide-react';
import {
  saveTripCoordinatesAction,
  addTripMarkerAction,
  deleteTripMarkerAction,
  updateMemberLocationAction
} from '@/app/(app)/trips/actions';

interface MapMarkerData {
  id: string;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  type: string;
  createdById: string;
}

interface ParticipantData {
  id: string;
  role: string;
  latitude: number | null;
  longitude: number | null;
  shareLocation: boolean;
  user: {
    email: string;
    profile: {
      fullName: string | null;
      avatarUrl: string | null;
      isVerified: boolean;
    } | null;
  };
}

interface TripMapClientProps {
  trip: {
    id: string;
    title: string;
    description: string;
    startLocation: string;
    endLocation: string;
    startLat: number | null;
    startLng: number | null;
    endLat: number | null;
    endLng: number | null;
    routePath: string | null;
    ownerId: string;
  };
  participants: ParticipantData[];
  markers: MapMarkerData[];
  currentUserId: string | null;
  isOrganizer: boolean;
}

// Map style definition generators using beautiful, open basemaps
const getCartoTilesStyle = (isDark: boolean) => {
  const tileUrl = isDark
    ? 'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
    : 'https://basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';

  return {
    version: 8,
    sources: {
      'carto-tiles': {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors, © CARTO'
      }
    },
    layers: [
      {
        id: 'carto-tiles-layer',
        type: 'raster',
        source: 'carto-tiles',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  };
};

export default function TripMapClient({
  trip,
  participants,
  markers: initialMarkers,
  currentUserId,
  isOrganizer
}: TripMapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  // State Management
  const [activeTab, setActiveTab] = useState<'route' | 'markers' | 'poi'>('route');
  const [markers, setMarkers] = useState<MapMarkerData[]>(initialMarkers);
  const [pois, setPois] = useState<any[]>([]);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [activePoiFilters, setActivePoiFilters] = useState<string[]>([]);
  
  // Custom Marker Input Form States
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [markerTitle, setMarkerTitle] = useState('');
  const [markerDesc, setMarkerDesc] = useState('');
  const [markerType, setMarkerType] = useState('MEETING_POINT');
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Geocoding States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [searchTarget, setSearchTarget] = useState<'start' | 'end' | 'marker'>('marker');

  // Route & Distance Details
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  // Coordinates
  const [startCoords, setStartCoords] = useState<{ lat: number; lng: number } | null>(
    trip.startLat && trip.startLng ? { lat: trip.startLat, lng: trip.startLng } : null
  );
  const [endCoords, setEndCoords] = useState<{ lat: number; lng: number } | null>(
    trip.endLat && trip.endLng ? { lat: trip.endLat, lng: trip.endLng } : null
  );

  // Geolocation states
  const [isSharingLocation, setIsSharingLocation] = useState(
    participants.find(p => p.id === currentUserId || p.user?.email === currentUserId)?.shareLocation || false
  );
  const watchIdRef = useRef<number | null>(null);

  // Maplibre markers cache
  const maplibMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  // 1. Initialize Map Libre GL JS Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter: [number, number] = startCoords 
      ? [startCoords.lng, startCoords.lat] 
      : [78.9629, 20.5937]; // India bounds default center

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getCartoTilesStyle(isDarkTheme) as any,
      center: initialCenter,
      zoom: startCoords ? 10 : 4,
      pitch: 0,
      bearing: 0
    });

    mapRef.current = map;

    // Controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }), 'top-right');

    map.on('load', () => {
      // Setup Route GeoJSON Sources and Layers
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: trip.routePath ? JSON.parse(trip.routePath) : { type: 'LineString', coordinates: [] }
        }
      });

      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6', // Tailwind blue-500
          'line-width': 5,
          'line-opacity': 0.85
        }
      });

      // Fit map boundary to route if path exists
      if (trip.routePath) {
        fitMapBounds(JSON.parse(trip.routePath));
      }

      // Add double click handler to map to pick marker coordinate points
      map.on('dblclick', (e) => {
        e.preventDefault();
        setSelectedCoordinates({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        setIsAddingMarker(true);
        setActiveTab('markers');
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Track Theme Updates
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getCartoTilesStyle(isDarkTheme) as any);
  }, [isDarkTheme]);

  // 3. Render and Update Markers (Start, End, Custom Markers, Participants, POIs)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers from map
    Object.values(maplibMarkersRef.current).forEach(m => m.remove());
    maplibMarkersRef.current = {};

    // 3.1 Start Location Marker (Green Pin)
    if (startCoords) {
      const el = document.createElement('div');
      el.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border border-white cursor-pointer transition-transform hover:scale-110';
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
      
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-slate-800">
          <strong class="text-xs font-bold block text-emerald-600">Trip Start Location</strong>
          <span class="text-[11px] font-medium">${trip.startLocation}</span>
        </div>
      `);

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([startCoords.lng, startCoords.lat])
        .setPopup(popup)
        .addTo(map);
      maplibMarkersRef.current['start-location'] = m;
    }

    // 3.2 Destination Location Marker (Red Pin)
    if (endCoords) {
      const el = document.createElement('div');
      el.className = 'w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border border-white cursor-pointer transition-transform hover:scale-110';
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>';

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-slate-800">
          <strong class="text-xs font-bold block text-rose-600">Trip Destination</strong>
          <span class="text-[11px] font-medium">${trip.endLocation}</span>
        </div>
      `);

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([endCoords.lng, endCoords.lat])
        .setPopup(popup)
        .addTo(map);
      maplibMarkersRef.current['end-location'] = m;
    }

    // 3.3 Custom Pins / Meeting Points Markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      const markerColors: Record<string, string> = {
        MEETING_POINT: 'bg-blue-600',
        REST_STOP: 'bg-amber-500',
        HAZARD: 'bg-red-500',
        PHOTO_OP: 'bg-purple-500',
        CUSTOM: 'bg-slate-600'
      };

      const color = markerColors[marker.type] || 'bg-primary';
      el.className = `w-6 h-6 rounded-full ${color} text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform`;
      el.innerHTML = marker.type === 'MEETING_POINT' ? '🚩' : marker.type === 'REST_STOP' ? '☕' : marker.type === 'HAZARD' ? '⚠️' : marker.type === 'PHOTO_OP' ? '📸' : '📍';

      const popup = new maplibregl.Popup({ offset: 20 }).setHTML(`
        <div class="p-2 text-slate-800 max-w-[200px]">
          <strong class="text-xs font-bold block">${marker.title}</strong>
          ${marker.description ? `<p class="text-[10px] text-slate-500 mt-0.5">${marker.description}</p>` : ''}
          <span class="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mt-2 uppercase tracking-wide">
            ${marker.type.replace('_', ' ')}
          </span>
        </div>
      `);

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map);
      maplibMarkersRef.current[`marker-${marker.id}`] = m;
    });

    // 3.4 Participants Location Markers
    participants.forEach(p => {
      if (p.shareLocation && p.latitude && p.longitude) {
        const el = document.createElement('div');
        el.className = 'relative flex items-center justify-center';
        
        // Show avatar or initials
        const nameInitial = p.user?.profile?.fullName?.charAt(0) || p.user?.email.charAt(0) || '?';
        const avatarHtml = p.user?.profile?.avatarUrl 
          ? `<img src="${p.user.profile.avatarUrl}" class="w-full h-full object-cover rounded-full" />` 
          : `<span class="text-[9px] font-bold text-slate-700">${nameInitial}</span>`;

        el.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-white shadow-lg border-2 border-primary overflow-hidden flex items-center justify-center relative z-10">
            ${avatarHtml}
          </div>
          <div class="w-7 h-7 rounded-full bg-primary/30 absolute animate-ping z-0" />
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2 text-slate-800">
            <strong class="text-xs font-bold block flex items-center gap-1">
              ${p.user?.profile?.fullName || 'Traveler'}
              ${p.user?.profile?.isVerified ? '<span class="text-primary font-black">✓</span>' : ''}
            </strong>
            <span class="text-[9px] text-slate-400 capitalize block">${p.role.toLowerCase()}</span>
            <span class="text-[9px] text-emerald-500 font-semibold block mt-1">✓ Location shared live</span>
          </div>
        `);

        const m = new maplibregl.Marker({ element: el })
          .setLngLat([p.longitude, p.latitude])
          .setPopup(popup)
          .addTo(map);
        maplibMarkersRef.current[`participant-${p.id}`] = m;
      }
    });

    // 3.5 POI (Nearby Amenity) Markers
    pois.forEach(poi => {
      const el = document.createElement('div');
      const poiColors: Record<string, string> = {
        fuel: 'bg-emerald-600',
        restaurant: 'bg-amber-600',
        cafe: 'bg-orange-500',
        hospital: 'bg-red-600',
        clinic: 'bg-red-500',
        repair: 'bg-indigo-600'
      };
      
      const type = poi.type;
      const color = poiColors[type] || 'bg-slate-700';
      el.className = `w-5.5 h-5.5 rounded-full ${color} text-white flex items-center justify-center shadow-md border border-white cursor-pointer hover:scale-115 transition-transform`;
      el.innerHTML = type === 'fuel' ? '⛽' : type === 'restaurant' || type === 'cafe' ? '🍴' : type === 'hospital' || type === 'clinic' ? '🏥' : '🔧';

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div class="p-2 text-slate-800">
          <strong class="text-xs font-bold block text-slate-900">${poi.name || 'Unnamed Place'}</strong>
          <span class="text-[9px] font-semibold text-slate-400 capitalize block">${poi.typeLabel}</span>
          ${poi.address ? `<span class="text-[9px] text-slate-500 block mt-1">${poi.address}</span>` : ''}
        </div>
      `);

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([poi.lng, poi.lat])
        .setPopup(popup)
        .addTo(map);
      maplibMarkersRef.current[`poi-${poi.id}`] = m;
    });

  }, [startCoords, endCoords, markers, participants, pois]);

  // Fit boundaries helper
  const fitMapBounds = (geoJsonGeometry: any) => {
    const map = mapRef.current;
    if (!map || !geoJsonGeometry?.coordinates || geoJsonGeometry.coordinates.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    geoJsonGeometry.coordinates.forEach((coord: [number, number]) => {
      bounds.extend(coord);
    });

    map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  };

  // 4. Geocode Search Lookup via OpenStreetMap Nominatim
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingGeocode(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'Bhratra-Travel-Companion-App/1.0'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Nominatim geocoding error:', err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  // Select search result
  const handleSelectResult = async (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (searchTarget === 'start') {
      setStartCoords({ lat, lng });
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 11 });
      setSearchResults([]);
      setSearchQuery('');
      if (endCoords) generateRoute(lat, lng, endCoords.lat, endCoords.lng);
    } else if (searchTarget === 'end') {
      setEndCoords({ lat, lng });
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 11 });
      setSearchResults([]);
      setSearchQuery('');
      if (startCoords) generateRoute(startCoords.lat, startCoords.lng, lat, lng);
    } else {
      setSelectedCoordinates({ lat, lng });
      setIsAddingMarker(true);
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 12 });
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  // 5. Generate Route using OSRM API
  const generateRoute = async (sLat: number, sLng: number, eLat: number, eLng: number) => {
    const map = mapRef.current;
    if (!map) return;

    setIsGeneratingRoute(true);

    try {
      const res = await fetch(
        `https://router.projectosrm.org/route/v1/driving/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson`
      );
      const data = await res.json();

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const geometry = route.geometry;
        
        // Update Layer Source
        const source = map.getSource('route') as maplibregl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry
          });
        }

        // Calculate metadata
        setDistanceKm(parseFloat((route.distance / 1000).toFixed(1)));
        setDurationMin(Math.round(route.duration / 60));

        // Fit map boundaries
        fitMapBounds(geometry);

        // Save to Database if organizer
        if (isOrganizer) {
          await saveTripCoordinatesAction(
            trip.id,
            sLat,
            sLng,
            eLat,
            eLng,
            JSON.stringify(geometry)
          );
        }
      }
    } catch (err) {
      console.error('OSRM routing fetch error:', err);
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  // 6. Custom Markers handlers
  const handleSaveMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoordinates || !markerTitle.trim()) return;

    try {
      const res = await addTripMarkerAction(
        trip.id,
        markerTitle,
        markerDesc || null,
        selectedCoordinates.lat,
        selectedCoordinates.lng,
        markerType
      );

      if (res?.success && res.marker) {
        setMarkers(prev => [...prev, res.marker as any]);
        setIsAddingMarker(false);
        setMarkerTitle('');
        setMarkerDesc('');
        setSelectedCoordinates(null);
      }
    } catch (err) {
      console.error('Error saving map marker:', err);
    }
  };

  const handleDeleteMarker = async (markerId: string) => {
    try {
      const res = await deleteTripMarkerAction(markerId);
      if (res?.success) {
        setMarkers(prev => prev.filter(m => m.id !== markerId));
      }
    } catch (err) {
      console.error('Error deleting map marker:', err);
    }
  };

  // 7. Overpass API (OpenStreetMap POIs Query)
  const queryNearbyAmenities = async () => {
    const map = mapRef.current;
    if (!map) return;

    const center = map.getCenter();
    setIsSearchingNearby(true);
    setPois([]);

    // Bounding circle around the current map center (approx 5km radius)
    const radius = 5000;
    
    // Construct Query
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="fuel"](around:${radius},${center.lat},${center.lng});
        node["amenity"="restaurant"](around:${radius},${center.lat},${center.lng});
        node["amenity"="cafe"](around:${radius},${center.lat},${center.lng});
        node["amenity"="hospital"](around:${radius},${center.lat},${center.lng});
        node["shop"="motorcycle"](around:${radius},${center.lat},${center.lng});
        node["amenity"="motorcycle_repair"](around:${radius},${center.lat},${center.lng});
      );
      out body;
    `;

    try {
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.elements) {
        const fetchedPois = data.elements.map((el: any) => {
          let type = 'custom';
          let typeLabel = 'Place';

          if (el.tags.amenity === 'fuel') {
            type = 'fuel';
            typeLabel = 'Fuel Station';
          } else if (el.tags.amenity === 'restaurant') {
            type = 'restaurant';
            typeLabel = 'Restaurant';
          } else if (el.tags.amenity === 'cafe') {
            type = 'cafe';
            typeLabel = 'Cafe / Cafe';
          } else if (el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic') {
            type = 'hospital';
            typeLabel = 'Medical Center';
          } else if (el.tags.shop === 'motorcycle' || el.tags.amenity === 'motorcycle_repair') {
            type = 'repair';
            typeLabel = 'Bike Service / Repair';
          }

          return {
            id: el.id.toString(),
            name: el.tags.name || el.tags.brand || 'Local ' + typeLabel,
            lat: el.lat,
            lng: el.lon,
            type,
            typeLabel,
            address: el.tags['addr:street'] 
              ? `${el.tags['addr:street']}${el.tags['addr:housenumber'] ? ' ' + el.tags['addr:housenumber'] : ''}` 
              : null
          };
        });

        setPois(fetchedPois);
      }
    } catch (err) {
      console.error('Overpass API query error:', err);
    } finally {
      setIsSearchingNearby(false);
    }
  };

  // 8. HTML5 Live Geolocation Sharing
  const handleToggleLocationShare = async () => {
    const nextState = !isSharingLocation;
    setIsSharingLocation(nextState);

    if (nextState) {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        setIsSharingLocation(false);
        return;
      }

      // Start watching user location coordinates
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Push coordinate update to database
          await updateMemberLocationAction(trip.id, lat, lng, true);
        },
        (error) => {
          console.error('Error watching location coordinates:', error);
          setIsSharingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Clear location share watcher
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      // Reset coordinates in database
      await updateMemberLocationAction(trip.id, null, null, false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const flyToCoord = (lat: number, lng: number, zoom = 13) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom });
  };

  return (
    <div className="flex flex-col lg:flex-row border border-border bg-card rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-140px)] min-h-[550px] relative">
      
      {/* Tabbed responsive Map Controls Sidebar */}
      <div className="w-full lg:w-[350px] border-r border-border bg-background flex flex-col justify-between shrink-0 h-[250px] lg:h-full z-10">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Navigation Controls tabs */}
          <div className="flex border-b border-border pb-1 gap-2">
            <button
              onClick={() => setActiveTab('route')}
              className={`flex-1 pb-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'route' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              <Compass className="h-4 w-4" /> Route
            </button>
            <button
              onClick={() => setActiveTab('markers')}
              className={`flex-1 pb-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'markers' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              <MapPin className="h-4 w-4" /> Custom Pins
            </button>
            <button
              onClick={() => setActiveTab('poi')}
              className={`flex-1 pb-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border-b-2 ${
                activeTab === 'poi' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              <Fuel className="h-4 w-4" /> Nearby Amenities
            </button>
          </div>

          {/* TAB 1: Route & Info Panel */}
          {activeTab === 'route' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-foreground">{trip.title}</h3>
                <p className="text-[10px] text-muted-foreground">Route: {trip.startLocation} to {trip.endLocation}</p>
              </div>

              {/* Dynamic distance/durations info */}
              {distanceKm && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/40 rounded-2xl border border-border/80">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase">Total Distance</span>
                    <p className="text-xs font-black text-slate-800">{distanceKm} km</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase">Driving Time</span>
                    <p className="text-xs font-black text-slate-800">{Math.floor(durationMin! / 60)}h {durationMin! % 60}m</p>
                  </div>
                </div>
              )}

              {/* Organizer Geocoding search inputs */}
              {isOrganizer && (
                <div className="space-y-3.5 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">Organizer Map Tools</span>
                    {isGeneratingRoute && (
                      <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Tracing OSRM...
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSearchTarget('start'); setSearchQuery(''); setSearchResults([]); }}
                      className={`flex-1 py-1.5 px-3 rounded-xl border text-[10px] font-bold transition-all text-center ${
                        searchTarget === 'start' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-slate-600'
                      }`}
                    >
                      Set Start
                    </button>
                    <button
                      onClick={() => { setSearchTarget('end'); setSearchQuery(''); setSearchResults([]); }}
                      className={`flex-1 py-1.5 px-3 rounded-xl border text-[10px] font-bold transition-all text-center ${
                        searchTarget === 'end' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-slate-600'
                      }`}
                    >
                      Set Destination
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${searchTarget === 'start' ? 'Start' : 'Destination'} coordinates...`}
                      className="w-full bg-background border border-border rounded-xl pl-3 pr-8 py-2 text-xs placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button type="submit" className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                      {isSearchingGeocode ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                    </button>
                  </form>

                  {/* Geocode Search results overlay lists */}
                  {searchResults.length > 0 && (
                    <div className="border border-border bg-card rounded-xl max-h-[140px] overflow-y-auto divide-y divide-border shadow-sm">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="w-full text-left p-2.5 text-[10px] hover:bg-secondary font-medium transition-colors line-clamp-1 block text-slate-700"
                        >
                          {result.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User location sharing box */}
              {currentUserId && (
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground">Share Live Location</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${isSharingLocation ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  </div>
                  <p className="text-[9px] text-muted-foreground">
                    Enable to broadcast your location live on this map to all trip members.
                  </p>
                  <button
                    onClick={handleToggleLocationShare}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                      isSharingLocation
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                        : 'bg-primary hover:bg-primary/95 text-primary-foreground'
                    }`}
                  >
                    {isSharingLocation ? (
                      <>
                        <X className="h-3.5 w-3.5" /> Stop Sharing
                      </>
                    ) : (
                      <>
                        <Crosshair className="h-3.5 w-3.5" /> Start Live Sharing
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Markers / Custom Pins Panel */}
          {activeTab === 'markers' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground">Custom Markers</span>
                <span className="text-[10px] text-muted-foreground">{markers.length} pins</span>
              </div>

              {/* Form trigger notification */}
              {!isAddingMarker ? (
                <div className="p-3 bg-secondary/35 rounded-xl border border-border/80 text-[10px] text-muted-foreground text-center">
                  Double-click anywhere on the map grid or search a place above to drop custom trip pins.
                </div>
              ) : (
                <form onSubmit={handleSaveMarker} className="p-3 border border-border bg-background rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-[10px] font-black text-primary">Place Custom Pin</strong>
                    <button type="button" onClick={() => setIsAddingMarker(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400">Pin Title</label>
                    <input
                      type="text"
                      required
                      value={markerTitle}
                      onChange={(e) => setMarkerTitle(e.target.value)}
                      placeholder="e.g. Meeting Point 1"
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400">Description</label>
                    <input
                      type="text"
                      value={markerDesc}
                      onChange={(e) => setMarkerDesc(e.target.value)}
                      placeholder="e.g. Near highway tea stall"
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400">Pin Category</label>
                    <select
                      value={markerType}
                      onChange={(e) => setMarkerType(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs focus:outline-none"
                    >
                      <option value="MEETING_POINT">Meeting Point 🚩</option>
                      <option value="REST_STOP">Rest Stop ☕</option>
                      <option value="HAZARD">Hazard / Warning ⚠️</option>
                      <option value="PHOTO_OP">Scenic Spot 📸</option>
                      <option value="CUSTOM">Custom Pin 📍</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Save Pin Coordinates
                  </button>
                </form>
              )}

              {/* List of Custom Markers */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {markers.map((marker) => (
                  <div key={marker.id} className="flex items-center justify-between p-2.5 bg-secondary/35 border border-border rounded-xl text-xs hover:border-primary/20 transition-all">
                    <button
                      type="button"
                      onClick={() => flyToCoord(marker.lat, marker.lng)}
                      className="flex-1 text-left min-w-0 font-bold text-slate-800 pr-2 block"
                    >
                      <span className="line-clamp-1">{marker.title}</span>
                      <span className="text-[9px] text-muted-foreground font-semibold block capitalize">{marker.type.toLowerCase().replace('_', ' ')}</span>
                    </button>
                    {(isOrganizer || marker.createdById === currentUserId) && (
                      <button
                        onClick={() => handleDeleteMarker(marker.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Nearby Amenities (OSM POIs) */}
          {activeTab === 'poi' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-foreground block">Query Nearby Amenities</span>
                <p className="text-[9px] text-muted-foreground">
                  Query and display fuel stations, restaurants, clinics, and repair shops from OpenStreetMap within 5km of the current map center.
                </p>
              </div>

              <button
                onClick={queryNearbyAmenities}
                disabled={isSearchingNearby}
                className="w-full py-2 bg-secondary hover:bg-border border border-border text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSearchingNearby ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Querying Overpass API...
                  </>
                ) : (
                  <>
                    <Compass className="h-3.5 w-3.5" /> Scan Current Viewport
                  </>
                )}
              </button>

              {/* Query lists result count display */}
              {pois.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">Scan Results</span>
                    <span className="text-[10px] text-primary font-bold bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">{pois.length} places found</span>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {pois.map((poi) => (
                      <button
                        key={poi.id}
                        onClick={() => flyToCoord(poi.lat, poi.lng, 15)}
                        className="w-full text-left p-2 bg-secondary/35 border border-border rounded-xl hover:border-primary/20 transition-all flex items-center gap-2"
                      >
                        <span className="text-xs shrink-0">
                          {poi.type === 'fuel' ? '⛽' : poi.type === 'restaurant' || poi.type === 'cafe' ? '🍴' : poi.type === 'hospital' ? '🏥' : '🔧'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-800 block truncate">{poi.name}</span>
                          <span className="text-[9px] text-muted-foreground font-semibold block">{poi.typeLabel}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer controls: Back to details */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between shrink-0">
          <span className="text-[9px] text-muted-foreground font-semibold">Bhratra OpenStreetMap Tool</span>
          <a
            href={`/trips/${trip.id}`}
            className="text-[10px] font-extrabold text-primary hover:underline"
          >
            ← Back to Trip
          </a>
        </div>
      </div>

      {/* Main MapLibre Map Container */}
      <div className="flex-1 relative h-full w-full bg-slate-100">
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
        
        {/* Float Map Overlay Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none bg-background/80 backdrop-blur border border-border/80 py-1.5 px-3 rounded-full shadow-sm text-[10px] font-bold flex items-center gap-1.5">
          <MapIcon className="h-3.5 w-3.5 text-primary" />
          <span>OSM MapLibre GL JS</span>
        </div>

        {/* Map Guidelines overlay on first load */}
        {!trip.routePath && isOrganizer && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:w-[350px] z-10 bg-background/90 backdrop-blur border border-border p-4 rounded-2xl shadow-lg space-y-2">
            <h4 className="text-xs font-black text-primary flex items-center gap-1.5">
              <Info className="h-4 w-4" /> Setup Trip Route Path
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Organizer: Search coordinates for the start and destination locations using the settings sidebar to calculate and trace the driving route on map.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
