'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { bannersApi, Banner } from '@/lib/api/banners';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.origin === 'http://localhost:3000' 
    ? 'http://localhost:5000/api' 
    : '/api');

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    imageUrl: '',
    link: '',
    linkText: '',
    position: 'homepage_hero',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersApi.getAdminBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      alert('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      if (formData.title) formDataToSend.append('title', formData.title);
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.link) formDataToSend.append('link', formData.link);
      if (formData.linkText) formDataToSend.append('linkText', formData.linkText);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('uploadType', 'banners');
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else if (formData.imageUrl && !editingBanner) {
        formDataToSend.append('image', formData.imageUrl);
      }

      if (editingBanner) {
        await bannersApi.updateBanner(editingBanner.id, formDataToSend);
      } else {
        await bannersApi.createBanner(formDataToSend);
      }

      setShowModal(false);
      resetForm();
      loadBanners();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await bannersApi.deleteBanner(id);
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image: null,
      imageUrl: banner.image,
      link: banner.link || '',
      linkText: banner.linkText || '',
      position: banner.position,
      order: banner.order,
      isActive: banner.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: null,
      imageUrl: '',
      link: '',
      linkText: '',
      position: 'homepage_hero',
      order: 0,
      isActive: true,
    });
  };

  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) return image;
    return `${API_URL.replace('/api', '')}${image}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312e81]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-4xl text-[#312e81] mb-2">Banners</h1>
          <p className="text-gray-600">Manage hero images and homepage banners</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#312e81] text-white px-6 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <Image
                src={getImageUrl(banner.image)}
                alt={banner.title || 'Banner'}
                fill
                className="object-cover"
              />
              {!banner.isActive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Inactive
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{banner.title || 'Untitled Banner'}</h3>
              <p className="text-sm text-gray-500 mb-2">Position: {banner.position}</p>
              <p className="text-sm text-gray-500 mb-4">Order: {banner.order}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-heading text-[#312e81] mb-6">
              {editingBanner ? 'Edit Banner' : 'Add Banner'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.imageUrl && !formData.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Current image:</p>
                    <Image
                      src={getImageUrl(formData.imageUrl)}
                      alt="Current"
                      width={200}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="homepage_hero">Homepage Hero</option>
                    <option value="homepage_section1">Homepage Section 1</option>
                    <option value="homepage_section2">Homepage Section 2</option>
                    <option value="category_header">Category Header</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Shop Now"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#312e81] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] transition-colors"
                >
                  {editingBanner ? 'Update' : 'Create'} Banner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

