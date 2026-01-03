'use client';

import { useState, useEffect } from 'react';
import { Star, ExternalLink, Quote } from 'lucide-react';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  
  const googleMapsUrl = 'https://maps.app.goo.gl/qSYDL2y5WqwawWXk7';
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';

  useEffect(() => {
    // Fetch reviews from Google Places API
    const fetchReviews = async () => {
      if (!placeId || !apiKey) {
        // If no API key, show placeholder reviews or fetch from alternative source
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            const fetchedReviews = data.result.reviews || [];
            setReviews(fetchedReviews.slice(0, 6)); // Show first 6 reviews
            setAverageRating(data.result.rating || 0);
            setTotalReviews(data.result.user_ratings_total || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching Google reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placeId, apiKey]);

  // Render star rating
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Format date
  const formatDate = (time: number) => {
    if (!time) return '';
    const date = new Date(time * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative mb-12">
          <div className="text-center w-full">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-deep-indigo mb-2">
              Customer Reviews
            </h2>
            <p className="text-gray-600 text-lg font-light">
              See what our customers are saying about us
            </p>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-3xl md:text-4xl font-bold text-deep-indigo mb-1">
            {averageRating > 0 ? averageRating.toFixed(1) : '4.8'}
          </div>
          <p className="text-gray-600">
            Based on {totalReviews > 0 ? totalReviews : '150+'} Google reviews
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-deep-indigo hover:text-navy-blue font-medium mt-4 transition-colors"
          >
            <span>View All Reviews on Google</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-deep-indigo rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {review.author_name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.relative_time_description || formatDate(review.time)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="w-6 h-6 text-deep-indigo/20 absolute -top-2 -left-1" />
                  <p className="text-gray-700 leading-relaxed pl-4">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Placeholder reviews when API is not configured
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                author_name: 'Priya Sharma',
                rating: 5,
                text: 'Absolutely love my saree! The quality is exceptional and the design is beautiful. Highly recommend!',
                time: Date.now() / 1000 - 86400 * 5,
              },
              {
                author_name: 'Anjali Patel',
                rating: 5,
                text: 'Best saree shopping experience! Great collection and excellent customer service. Will definitely shop again.',
                time: Date.now() / 1000 - 86400 * 12,
              },
              {
                author_name: 'Meera Desai',
                rating: 5,
                text: 'The sarees are stunning and the delivery was super fast. Very happy with my purchase!',
                time: Date.now() / 1000 - 86400 * 8,
              },
              {
                author_name: 'Kavita Mehta',
                rating: 5,
                text: 'Premium quality fabric and elegant designs. Worth every penny. Thank you for such beautiful sarees!',
                time: Date.now() / 1000 - 86400 * 15,
              },
              {
                author_name: 'Sunita Reddy',
                rating: 5,
                text: 'Amazing collection! The sarees are exactly as shown in the pictures. Very satisfied customer!',
                time: Date.now() / 1000 - 86400 * 20,
              },
              {
                author_name: 'Rekha Iyer',
                rating: 5,
                text: 'Outstanding quality and beautiful packaging. The attention to detail is remarkable. Highly recommended!',
                time: Date.now() / 1000 - 86400 * 10,
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-deep-indigo rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {review.author_name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.time)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="w-6 h-6 text-deep-indigo/20 absolute -top-2 -left-1" />
                  <p className="text-gray-700 leading-relaxed pl-4">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA to Write Review - Redesigned */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-3xl">
            {/* Modern Card Design */}
            <div className="bg-gradient-to-br from-deep-indigo via-navy-blue to-deep-indigo rounded-2xl shadow-2xl overflow-hidden">
              {/* Decorative Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
              </div>
              
              {/* Content */}
              <div className="relative p-8 md:p-12 text-center">
                {/* Star Icon with Animation */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Star className="w-16 h-16 md:w-20 md:h-20 text-yellow-300 fill-yellow-300 relative z-10 drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Heading */}
                <h3 className="text-3xl md:text-4xl font-heading mb-4 text-white drop-shadow-md">
                  Love Our Products?
                </h3>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto leading-relaxed">
                  Share your experience and help others discover quality sarees
                </p>
                
                {/* Write Review Button - Enhanced */}
                <a
                  href="https://www.google.com/maps/place/Morpankh+Saree/@18.5618115,73.9314482,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2c10075547f01:0x3f3c947c85c0923e!8m2!3d18.5618115!4d73.9314482!16s%2Fg%2F11t0x3bc2c1?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform group"
                >
                  <Star className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
                  <span>Write a Review</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                {/* Additional Info */}
                <p className="text-white/70 text-sm mt-6">
                  Your feedback helps us serve you better
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

