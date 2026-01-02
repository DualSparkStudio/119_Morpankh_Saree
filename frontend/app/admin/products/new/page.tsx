'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { categoriesApi, Category } from '@/lib/api/categories';

export default function NewProductPage() {
  const router = useRouter();
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
    showInPremium: false,
    showInTrending: false,
    showInCategories: false,
    tags: [] as string[],
    variants: [] as Array<{
      name: string;
      color?: string;
      fabric?: string;
      occasion?: string;
      price: string;
      sku: string;
      barcode?: string;
      variantCode?: string;
    }>,
  });

  // Function to generate slug from product name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        barcode: formData.barcode || null,
        categoryId: formData.categoryId,
        basePrice: parseFloat(formData.basePrice),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        images: formData.images.filter(img => img && img.trim() !== ''),
        fabricType: formData.fabricType || null,
        sareeLength: formData.sareeLength ? parseFloat(formData.sareeLength) : null,
        blouseIncluded: formData.blouseIncluded,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        showInPremium: formData.showInPremium,
        showInTrending: formData.showInTrending,
        showInCategories: formData.showInCategories,
        tags: formData.tags,
        variants: formData.variants.length > 0 ? formData.variants.map(v => ({
          name: v.name,
          color: v.color || null,
          fabric: v.fabric || null,
          occasion: v.occasion || null,
          price: v.price ? parseFloat(v.price) : null,
          sku: v.sku,
          barcode: v.barcode || null,
          variantCode: v.variantCode || null,
        })) : undefined,
      };

      await adminApi.createProduct(productData);
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create product';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData({ ...formData, images: [...formData.images, url.trim()] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    const tag = prompt('Enter tag:');
    if (tag && tag.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tag.trim()] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          name: '',
          color: '',
          fabric: '',
          occasion: '',
          price: '',
          sku: '',
          barcode: '',
          variantCode: '',
        },
      ],
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const getImageUrl = (image: string): string => {
    if (!image || image.trim() === '') return '';
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/uploads')) {
      if (typeof window !== 'undefined') {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        if (apiUrl.startsWith('http')) {
          const baseUrl = apiUrl.replace('/api', '');
          return `${baseUrl}${image}`;
        }
        return image;
      }
      return image;
    }
    if (image.startsWith('/')) {
      return image;
    }
    return image;
  };

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
        <h1 className="font-heading text-4xl text-[#312e81] mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product in your catalog</p>
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
                setSlugManuallyEdited(true);
              }}
              onFocus={() => setSlugManuallyEdited(true)}
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
                return (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onLoad={(e) => {
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

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Variants (Optional)</label>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-2 text-sm text-[#312e81] hover:text-[#1e3a8a]"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>
          {formData.variants.length > 0 && (
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Variant Name *</label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="e.g., Color: Red, Size: M"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Variant SKU *</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={variant.color || ''}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price Override (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price || ''}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Barcode</label>
                    <input
                      type="text"
                      value={variant.barcode || ''}
                      onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Variant Code (QR)</label>
                    <input
                      type="text"
                      value={variant.variantCode || ''}
                      onChange={(e) => updateVariant(index, 'variantCode', e.target.value)}
                      placeholder="e.g., SR-SILK-RED-001"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Variant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {saving ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

