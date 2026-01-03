'use client';

import { Star, ExternalLink, MapPin } from 'lucide-react';

export default function GoogleMapsReviews() {
  // Google Maps link
  const googleMapsUrl = 'https://maps.app.goo.gl/qSYDL2y5WqwawWXk7';
  
  // To get the embed URL:
  // 1. Open the Google Maps link above
  // 2. Click the menu (three lines) in the top left
  // 3. Click "Share or embed map"
  // 4. Click "Embed a map"
  // 5. Copy the iframe src URL and replace the mapEmbedUrl below
  // For now, we'll use a placeholder that links to Google Maps
  const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || '';

  return (
    <div className="space-y-8">
      {/* Google Maps Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-2">Find Us</h2>
          <p className="text-gray-600">Visit our store or get directions</p>
        </div>
        {mapEmbedUrl ? (
          <>
            <div className="relative w-full" style={{ height: '400px' }}>
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

      {/* Google Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading text-deep-indigo mb-2">Customer Reviews</h2>
            <p className="text-gray-600">See what our customers are saying about us</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-700 font-semibold ml-2">4.8</span>
          </div>
        </div>
        
        {/* Google Reviews CTA */}
        <div className="bg-gradient-to-br from-deep-indigo to-navy-blue rounded-lg p-8 text-center text-white">
          <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300 fill-yellow-300" />
          <h3 className="text-2xl font-heading mb-2">Love Our Products?</h3>
          <p className="text-white/90 mb-6">
            Share your experience and help others discover quality sarees
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-deep-indigo hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>View All Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={`${googleMapsUrl}&action=write`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Write a Review</span>
            </a>
          </div>
        </div>

        {/* Google Reviews Integration Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>💡 Pro Tip:</strong> To display live Google reviews on your website:
          </p>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li>Get a Google Places API key from Google Cloud Console</li>
            <li>Add it to your environment variables</li>
            <li>Use the Google Places API to fetch reviews programmatically</li>
            <li>Or use a third-party service like Elfsight or EmbedSocial</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

