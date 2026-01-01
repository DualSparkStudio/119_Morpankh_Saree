'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { usersApi } from '@/lib/api/users';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getProfile();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use store user data as fallback
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setSuccess('');
      const updated = await usersApi.updateProfile(profile);
      
      // Update store with new user data
      setUser({
        ...user!,
        name: updated.name || user!.name,
        email: updated.email || user!.email,
        phone: updated.phone || user!.phone,
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading text-deep-indigo mb-8">My Profile</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-royal-blue rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-heading text-deep-indigo mb-1">{profile.name || user?.name || 'User'}</h2>
                <p className="text-gray-600">{profile.email || user?.email || ''}</p>
              </div>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-royal-blue hover:bg-deep-indigo text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


