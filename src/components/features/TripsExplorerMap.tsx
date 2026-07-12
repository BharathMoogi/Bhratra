'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  Compass, MapPin, Calendar, Users, Star, Car,
  Loader2, Search, Info, Grid, Map as MapIcon, ChevronRight
} from 'lucide-react';

interface ExplorerTrip {
  id: string;
  title: string;
  type: string;
  startLocation: string;
  endLocation: string;
  startDate: string;
  budgetRange: string;
  maxCapacity: number;
  vehicle: string | null;
  difficulty: string | null;
  startLat: number | null;
  startLng: number | null;
  membersCount: number;
}

interface TripsExplorerMapProps {
  trips: ExplorerTrip[];
}

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

export default function TripsExplorerMap({ trips }: TripsExplorerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Filter trips with coordinates
    const mappedTrips = trips.filter(t => t.startLat !== null && t.startLng !== null);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getCartoTilesStyle(isDarkTheme) as any,
      center: [78.9629, 20.5937], // Central India
      zoom: 4.5
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', () => {
      // Build GeoJSON dataset from trip locations
      const features = mappedTrips.map(trip => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [trip.startLng!, trip.startLat!]
        },
        properties: {
          id: trip.id,
          title: trip.title,
          type: trip.type,
          startLocation: trip.startLocation,
          endLocation: trip.endLocation,
          difficulty: trip.difficulty || 'EASY',
          budgetRange: trip.budgetRange,
          vehicle: trip.vehicle || 'Not Specified',
          maxCapacity: trip.maxCapacity,
          membersCount: trip.membersCount
        }
      }));

      const geojson: any = {
        type: 'FeatureCollection',
        features
      };

      // Add source with clustering enabled
      map.addSource('trips-source', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Cluster circle layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'trips-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#bfdbfe', // Light blue-200 for 1-5 points
            5,
            '#60a5fa', // Blue-400 for 5-15 points
            15,
            '#2563eb'  // Blue-600 for 15+ points
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            5,
            24,
            15,
            30
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Cluster count text layer
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'trips-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count}',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#0f172a'
        }
      });

      // Unclustered single trip marker layer
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'trips-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Click on cluster zooms in
      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource('trips-source') as maplibregl.GeoJSONSource;
        
        // Get next expansion zoom
        const zoom = await getClusterExpansionZoom(source, clusterId);
        const coordinates = (features[0].geometry as any).coordinates;

        map.easeTo({
          center: coordinates,
          zoom: zoom + 0.5
        });
      });

      // Click on single trip point opens popup details
      map.on('click', 'unclustered-point', (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const seatsRemaining = Math.max(0, props.maxCapacity - props.membersCount);

        new maplibregl.Popup({ offset: 10 })
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-3 text-slate-800 max-w-[240px] space-y-2">
              <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wide">
                  ${props.type.replace('_', ' ')}
                </span>
                <span class="text-[9px] font-bold ${seatsRemaining > 0 ? 'text-emerald-600' : 'text-rose-500'}">
                  ${seatsRemaining > 0 ? `${seatsRemaining} seats left` : 'Full'}
                </span>
              </div>
              
              <h4 class="font-extrabold text-xs text-slate-900 line-clamp-1">${props.title}</h4>
              <p class="text-[10px] text-slate-500 flex items-center gap-1">
                📍 ${props.startLocation} → ${props.endLocation}
              </p>

              <div class="grid grid-cols-2 gap-1.5 pt-1 text-[9px] font-semibold text-slate-500">
                <div>Difficulty: <span class="text-slate-800 font-bold">${props.difficulty}</span></div>
                <div>Budget: <span class="text-slate-800 font-bold capitalize">${props.budgetRange.toLowerCase()}</span></div>
              </div>

              <div class="pt-2 border-t border-slate-100 flex gap-1.5">
                <a href="/trips/${props.id}" class="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded text-[9px] transition-colors">
                  Details
                </a>
                <a href="/trips/${props.id}/map" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded text-[9px] transition-colors">
                  Map View
                </a>
              </div>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor style on hover
      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
      map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trips]);

  // Expand cluster helper helper
  const getClusterExpansionZoom = (source: any, clusterId: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) reject(err);
        else resolve(zoom);
      });
    });
  };

  // Switch Theme Style
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getCartoTilesStyle(isDarkTheme) as any);
  }, [isDarkTheme]);

  // Geocode fly to address search
  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingGeocode(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'Bhratra-Travel-Companion-App/1.0'
          }
        }
      );
      const data = await response.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 9 });
      }
    } catch (err) {
      console.error('Nominatim query error:', err);
    } finally {
      setIsSearchingGeocode(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="border border-border bg-card rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-140px)] min-h-[500px] relative">
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
      
      {/* Floating controls panel */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[320px] z-10 space-y-3">
        {/* Title badge */}
        <div className="bg-background/85 backdrop-blur border border-border/80 p-3 rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary animate-spin-slow" />
            <div>
              <h2 className="text-xs font-black text-foreground">Trips Explorer Map</h2>
              <span className="text-[9px] text-muted-foreground font-semibold">{trips.length} active trips loaded</span>
            </div>
          </div>
          <Link
            href="/trips"
            className="text-[9px] font-bold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-full transition-colors flex items-center gap-0.5"
          >
            List View <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchCity} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search regions / cities (e.g. Manali, Ladakh)..."
            className="w-full bg-background/90 backdrop-blur border border-border rounded-xl pl-4 pr-10 py-2.5 text-xs shadow-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {isSearchingGeocode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </form>
      </div>

      {/* Map style metadata overlay */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-background/80 backdrop-blur border border-border/80 py-1.5 px-3 rounded-full shadow-sm text-[10px] font-bold flex items-center gap-1.5">
        <MapIcon className="h-3.5 w-3.5 text-primary" />
        <span>OSM Tile Clustering</span>
      </div>

    </div>
  );
}
