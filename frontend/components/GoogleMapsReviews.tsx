'use client';

import { ExternalLink, MapPin } from 'lucide-react';

export default function GoogleMapsEmbed() {
  // Google Maps link
  const googleMapsUrl = 'https://maps.app.goo.gl/qSYDL2y5WqwawWXk7';
  
  // To get the embed URL:
  // 1. Open the Google Maps link above
  // 2. Click the menu (three lines) in the top left
  // 3. Click "Share or embed map"
  // 4. Click "Embed a map"
  // 5. Copy the iframe src URL and add it to your .env file
  const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {mapEmbedUrl ? (
        <>
          <div className="relative w-full" style={{ height: '450px' }}>
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-deep-indigo hover:text-navy-blue font-medium transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </>
      ) : (
        <div className="p-12 text-center">
          <MapPin className="w-16 h-16 text-deep-indigo mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">View Our Location</h3>
          <p className="text-gray-600 mb-6">
            Click below to view our location on Google Maps
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-deep-indigo hover:bg-navy-blue text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-2xl mx-auto">
            <p className="text-sm text-blue-800 mb-2">
              <strong>To embed the map:</strong>
            </p>
            <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
              <li>Open the Google Maps link above</li>
              <li>Click the menu (☰) in the top left</li>
              <li>Select "Share or embed map"</li>
              <li>Click "Embed a map" tab</li>
              <li>Copy the iframe src URL</li>
              <li>Add it as <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL</code> in your .env file</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

