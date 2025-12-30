'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { Product } from '@/lib/api/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [pagination.page, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
      });
      
      // Debug: Log product images to see what's in the database
      response.products.forEach((product) => {
        const imageCount = product.images?.length || 0;
        const firstImageUrl = product.images?.[0] || '';
        const processedUrl = firstImageUrl ? getImageUrl(firstImageUrl) : '';
        console.log(`Product: ${product.name} (${product.sku})`, {
          'Number of Images in Database': imageCount,
          'Raw Images Array': product.images,
          'First Image URL (Raw from DB)': firstImageUrl || 'NO IMAGE',
          'First Image URL (Processed)': processedUrl || 'EMPTY AFTER PROCESSING',
          'Status': imageCount === 0 ? '⚠️ NO IMAGES - Add images via admin panel' : processedUrl ? `✅ Image URL ready` : '⚠️ Image URL is empty after processing',
        });
      });
      
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminApi.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const getImageUrl = (image: string | undefined): string => {
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
    // Old hardcoded paths like /images/products/... don't exist - return empty
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl text-[#312e81] mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#312e81]"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4 border border-gray-200">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
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
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.basePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="text-[#1e3a8a] hover:text-[#312e81]"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination({ ...pagination, page })}
                  className={`px-4 py-2 border rounded-lg ${
                    pagination.page === page
                      ? 'bg-[#312e81] text-white border-[#312e81]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

