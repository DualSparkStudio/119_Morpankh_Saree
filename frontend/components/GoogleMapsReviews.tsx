'use client';

import { ExternalLink, MapPin } from 'lucide-react';

export default function GoogleMapsEmbed() {
  // Google Maps link
  const googleMapsUrl = 'https://maps.app.goo.gl/qSYDL2y5WqwawWXk7';
  
  // Google Maps embed URL
  const mapEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.225488826108!2d73.93144819999999!3d18.5618115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c10075547f01%3A0x3f3c947c85c0923e!2sMorpankh%20Saree!5e1!3m2!1sen!2sin!4v1767457061823!5m2!1sen!2sin';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
    </div>
  );
}

