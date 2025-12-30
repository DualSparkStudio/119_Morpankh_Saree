'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, X } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { categoriesApi, Category } from '@/lib/api/categories';
import { Product } from '@/lib/api/products';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    barcode: '',
    categoryId: '',
    basePrice: '',
    compareAtPrice: '',
    costPrice: '',
    images: [] as string[],
    fabricType: '',
    sareeLength: '',
    blouseIncluded: false,
    isActive: true,
    isFeatured: false,
    tags: [] as string[],
    variants: [] as Array<{
      id?: string;
      name: string;
      color?: string;
      fabric?: string;
      occasion?: string;
      price: string;
      sku: string;
    }>,
  });

  // Function to generate slug from product name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProductData = async () => {
    try {
      setLoading(true);
      const productData = await adminApi.getProductById(id);
      setFormData({
        name: productData.name,
        slug: productData.slug,
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        sku: productData.sku,
        barcode: productData.barcode || '',
        categoryId: productData.category?.id || '',
        basePrice: productData.basePrice?.toString() || '',
        compareAtPrice: productData.compareAtPrice?.toString() || '',
        costPrice: (productData as any).costPrice?.toString() || '',
        images: (productData.images || []).filter(img => !img.startsWith('/images/products/')),
        fabricType: (productData as any).fabricType || '',
        sareeLength: (productData as any).sareeLength?.toString() || '',
        blouseIncluded: (productData as any).blouseIncluded ?? false,
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? false,
        tags: (productData as any).tags || [],
        variants: productData.variants?.map(v => ({
          ...v,
          price: v.price?.toString() || '',
        })) || [],
      });
      setSlugManuallyEdited(false); // Reset flag when loading product data
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert('Failed to load product data');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Don't include variants in update - they should be managed separately
      // to avoid creating duplicates
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        barcode: formData.barcode || null,
        categoryId: formData.categoryId,
        basePrice: parseFloat(formData.basePrice),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        // Filter out old hardcoded paths and empty strings
        images: formData.images.filter(img => img && img.trim() !== '' && !img.startsWith('/images/products/')),
        fabricType: formData.fabricType || null,
        sareeLength: formData.sareeLength ? parseFloat(formData.sareeLength) : null,
        blouseIncluded: formData.blouseIncluded,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        tags: formData.tags,
        // Note: variants are not included here to prevent duplicate creation
        // Variants should be managed through a separate API endpoint if needed
      };

      await adminApi.updateProduct(id, productData);
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    const tag = prompt('Enter tag:');
    if (tag) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const getImageUrl = (image: string): string => {
    if (!image) return '';
    // If it's already a full URL, return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // If it starts with /uploads, it's from the backend
    if (image.startsWith('/uploads')) {
      // In production, backend serves /uploads directly on the same domain
      // In development, we need to prepend the backend URL
      if (typeof window !== 'undefined') {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        if (apiUrl.startsWith('http')) {
          // Development: extract base URL
          const baseUrl = apiUrl.replace('/api', '');
          return `${baseUrl}${image}`;
        } else {
          // Production: same domain, backend serves /uploads directly
          return image;
        }
      }
      return image;
    }
    // Old hardcoded paths like /images/products/... - return empty
    if (image.startsWith('/images/products/')) {
      return '';
    }
    // If it starts with /, it might be a frontend public image
    if (image.startsWith('/')) {
      return image;
    }
    // Otherwise, assume it's a relative path
    return image;
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
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#312e81] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="font-heading text-4xl text-[#312e81] mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value;
                setFormData({
                  ...formData,
                  name: newName,
                  // Auto-update slug only if it hasn't been manually edited
                  slug: slugManuallyEdited ? formData.slug : generateSlug(newName),
                });
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value });
                setSlugManuallyEdited(true); // Mark as manually edited
              }}
              onFocus={() => setSlugManuallyEdited(true)} // Mark as manually edited when focused
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              placeholder="Auto-generated from product name"
            />
            {!slugManuallyEdited && (
              <p className="mt-1 text-xs text-gray-500">
                Slug will auto-update when you change the product name
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare At Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
          />
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fabric Type
            </label>
            <input
              type="text"
              value={formData.fabricType}
              onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
              placeholder="e.g., Silk, Cotton"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saree Length (meters)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.sareeLength}
              onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.blouseIncluded}
                onChange={(e) => setFormData({ ...formData, blouseIncluded: e.target.checked })}
                className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
              />
              <span className="text-sm font-medium text-gray-700">Blouse Included</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <button
              type="button"
              onClick={addImage}
              className="text-sm text-[#312e81] hover:text-[#1e3a8a]"
            >
              + Add Image URL
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No images added. Click "+ Add Image URL" to add images.</p>
              </div>
            ) : (
              formData.images.map((image, index) => {
                const imageUrl = getImageUrl(image);
                // Use regular img tag for all images to avoid Next.js Image optimization issues
                // This ensures images from backend, frontend public folder, or external URLs all work
                return (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Hide image if it fails to load
                          target.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          // Image loaded successfully
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <button
              type="button"
              onClick={addTag}
              className="text-sm text-[#312e81] hover:text-[#1e3a8a]"
            >
              + Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

