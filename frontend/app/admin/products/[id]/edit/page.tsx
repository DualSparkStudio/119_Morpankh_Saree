'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { categoriesApi, Category } from '@/lib/api/categories';
import { Product } from '@/lib/api/products';
import { PromptModal, AlertModal, ConfirmModal } from '@/components/Modal';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showTagPrompt, setShowTagPrompt] = useState(false);
  const [showColorPrompt, setShowColorPrompt] = useState(false);
  const [showColorImagePrompt, setShowColorImagePrompt] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(null);
  const [colorToDelete, setColorToDelete] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; variant?: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });
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
    showInPremium: false,
    showInTrending: false,
    showInCategories: false,
    tags: [] as string[],
    colors: [] as Array<{
      id?: string;
      color: string;
      colorCode?: string;
      images: string[];
      sku?: string;
      barcode?: string;
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
        showInPremium: (productData as any).showInPremium ?? false,
        showInTrending: (productData as any).showInTrending ?? false,
        showInCategories: (productData as any).showInCategories ?? false,
        tags: (productData as any).tags || [],
        colors: (productData as any).colors?.map((c: any) => ({
          id: c.id,
          color: c.color,
          colorCode: c.colorCode || '',
          images: c.images || [],
          sku: c.sku || '',
          barcode: c.barcode || '',
        })) || [],
      });
      setSlugManuallyEdited(false); // Reset flag when loading product data
    } catch (error: any) {
      console.error('Error loading data:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: 'Failed to load product data',
        variant: 'error',
      });
      setTimeout(() => router.push('/admin/products'), 2000);
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
        showInPremium: formData.showInPremium,
        showInTrending: formData.showInTrending,
        showInCategories: formData.showInCategories,
        tags: formData.tags,
        // Note: variants are not included here to prevent duplicate creation
        // Variants should be managed through a separate API endpoint if needed
      };

      await adminApi.updateProduct(id, productData);
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
      setAlert({
        isOpen: true,
        title: 'Error',
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Convert Google Drive share link to direct image URL
  const convertGoogleDriveUrl = (url: string): string => {
    // Check if it's a Google Drive share link
    const driveShareMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveShareMatch) {
      const fileId = driveShareMatch[1];
      // Use thumbnail format which is more reliable for embedding
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
    }
    // Check if it's already a direct Google Drive image URL (convert old format to new)
    const oldFormatMatch = url.match(/drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/);
    if (oldFormatMatch) {
      const fileId = oldFormatMatch[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
    }
    // Return as is if not a Google Drive link
    return url;
  };

  const addTag = (tag: string) => {
    if (tag) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Color management functions
  const addColor = async (colorName: string) => {
    if (!colorName || !colorName.trim()) return;

    try {
      const colorData = {
        color: colorName.trim(),
        colorCode: '',
        images: [],
        sku: '',
        barcode: '',
      };
      const newColor = await adminApi.addProductColor(id, colorData);
      setFormData({
        ...formData,
        colors: [...formData.colors, { ...colorData, id: newColor.id }],
      });
    } catch (error: any) {
      console.error('Error adding color:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add color',
        variant: 'error',
      });
    }
  };

  const updateColor = async (colorIndex: number, field: string, value: any) => {
    const color = formData.colors[colorIndex];
    if (!color.id) {
      // Local update for new colors
      const updatedColors = [...formData.colors];
      updatedColors[colorIndex] = { ...updatedColors[colorIndex], [field]: value };
      setFormData({ ...formData, colors: updatedColors });
      return;
    }

    // Update via API
    try {
      const updateData: any = {};
      if (field === 'images') {
        updateData.images = value;
      } else {
        updateData[field] = value;
      }
      await adminApi.updateProductColor(id, color.id, updateData);
      const updatedColors = [...formData.colors];
      updatedColors[colorIndex] = { ...updatedColors[colorIndex], [field]: value };
      setFormData({ ...formData, colors: updatedColors });
    } catch (error: any) {
      console.error('Error updating color:', error);
      setAlert({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update color',
        variant: 'error',
      });
    }
  };

  const handleRemoveColor = (colorIndex: number) => {
    setColorToDelete(colorIndex);
    setShowDeleteConfirm(true);
  };

  const removeColor = async () => {
    if (colorToDelete === null) return;
    const color = formData.colors[colorToDelete];

    if (color.id) {
      try {
        await adminApi.deleteProductColor(id, color.id);
      } catch (error: any) {
        console.error('Error deleting color:', error);
        setAlert({
          isOpen: true,
          title: 'Error',
          message: error.response?.data?.message || 'Failed to delete color',
          variant: 'error',
        });
        return;
      }
    }

    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== colorToDelete),
    });
    setColorToDelete(null);
  };

  const addColorImage = (colorIndex: number) => {
    setCurrentColorIndex(colorIndex);
    setShowColorImagePrompt(true);
  };

  const handleColorImageSubmit = (url: string) => {
    if (currentColorIndex !== null && url.trim()) {
      const color = formData.colors[currentColorIndex];
      const updatedImages = [...color.images, url.trim()];
      updateColor(currentColorIndex, 'images', updatedImages);
    }
    setCurrentColorIndex(null);
  };

  const removeColorImage = (colorIndex: number, imageIndex: number) => {
    const color = formData.colors[colorIndex];
    const updatedImages = color.images.filter((_, i) => i !== imageIndex);
    updateColor(colorIndex, 'images', updatedImages);
  };

  const getImageUrl = (image: string): string => {
    if (!image || image.trim() === '') return '';
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

        {/* Colors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Colors</label>
            <button
              type="button"
              onClick={() => setShowColorPrompt(true)}
              className="inline-flex items-center gap-2 text-sm text-[#312e81] hover:text-[#1e3a8a]"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </button>
          </div>
          {formData.colors.length > 0 && (
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              {formData.colors.map((color, index) => (
                <div key={color.id || index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Color Name *</label>
                      <input
                        type="text"
                        value={color.color}
                        onChange={(e) => updateColor(index, 'color', e.target.value)}
                        placeholder="e.g., Green, Red, Blue"
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Color Code (Hex)</label>
                      <input
                        type="text"
                        value={color.colorCode || ''}
                        onChange={(e) => updateColor(index, 'colorCode', e.target.value)}
                        placeholder="#22c55e"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">SKU (Optional)</label>
                      <input
                        type="text"
                        value={color.sku || ''}
                        onChange={(e) => updateColor(index, 'sku', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Barcode (Optional)</label>
                      <input
                        type="text"
                        value={color.barcode || ''}
                        onChange={(e) => updateColor(index, 'barcode', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Color Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-700">Images (3-4 images recommended) *</label>
                      <button
                        type="button"
                        onClick={() => addColorImage(index)}
                        className="text-xs text-[#312e81] hover:text-[#1e3a8a]"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        Add Image
                      </button>
                    </div>
                    {color.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {color.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={getImageUrl(img)}
                              alt={`${color.color} ${imgIndex + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.png';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeColorImage(index, imgIndex)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {color.images.length === 0 && (
                      <p className="text-xs text-gray-500">No images added. Click "Add Image" to add images for this color.</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Color
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <button
              type="button"
              onClick={() => setShowTagPrompt(true)}
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
        <div className="space-y-4">
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
          
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Show in Home Page Sections:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInPremium}
                  onChange={(e) => setFormData({ ...formData, showInPremium: e.target.checked })}
                  className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
                />
                <span className="text-sm font-medium text-gray-700">Show in Premium Patterns</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInTrending}
                  onChange={(e) => setFormData({ ...formData, showInTrending: e.target.checked })}
                  className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
                />
                <span className="text-sm font-medium text-gray-700">Show in Trending Patterns</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInCategories}
                  onChange={(e) => setFormData({ ...formData, showInCategories: e.target.checked })}
                  className="w-4 h-4 text-[#312e81] border-gray-300 rounded focus:ring-[#1e3a8a]"
                />
                <span className="text-sm font-medium text-gray-700">Show in Categories Carousel</span>
              </label>
            </div>
          </div>
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

      {/* Modals */}
      <PromptModal
        isOpen={showTagPrompt}
        onClose={() => setShowTagPrompt(false)}
        title="Add Tag"
        label="Tag Name"
        placeholder="Enter tag name"
        onSubmit={addTag}
      />

      <PromptModal
        isOpen={showColorPrompt}
        onClose={() => setShowColorPrompt(false)}
        title="Add Color"
        label="Color Name"
        placeholder="Enter color name (e.g., Green, Red, Blue)"
        onSubmit={addColor}
      />

      <PromptModal
        isOpen={showColorImagePrompt}
        onClose={() => {
          setShowColorImagePrompt(false);
          setCurrentColorIndex(null);
        }}
        title="Add Image URL"
        label="Image URL"
        placeholder="Enter image URL (Google Drive links will be auto-converted)"
        onSubmit={handleColorImageSubmit}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setColorToDelete(null);
        }}
        title="Delete Color"
        message={colorToDelete !== null ? `Are you sure you want to remove the color "${formData.colors[colorToDelete]?.color}"?` : ''}
        onConfirm={removeColor}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
      />
    </div>
  );
}

