import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bhratra Travel Matching',
    short_name: 'Bhratra',
    description: 'Find compatible travel companions for road trips, bike rides, and trekking adventures.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#020817', // Slate matching color
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
