'use client';

import { useState } from 'react';
import { Scan, Package } from 'lucide-react';

export default function AdminInventoryPage() {
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-[#312e81] mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage stock levels with barcode scanning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barcode Scanner */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Scan className="w-6 h-6 text-[#312e81]" />
            <h2 className="font-heading text-2xl text-[#312e81]">Barcode Scanner</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scan Barcode / QR Code
            </label>
            <input
              type="text"
              placeholder="Enter or scan barcode..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent">
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Type
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent">
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline Store</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add any notes about this transaction..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <button
            className="w-full bg-[#312e81] hover:bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Process Transaction
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-[#312e81]" />
            <h2 className="font-heading text-2xl text-[#312e81]">Recent Transactions</h2>
          </div>

          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent transactions</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use Barcode Scanner:</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Use a barcode scanner device connected to your computer</li>
          <li>Or manually enter the barcode/QR code in the input field</li>
          <li>Select transaction type (Stock IN or Stock OUT)</li>
          <li>Enter quantity and select stock type</li>
          <li>Click "Process Transaction" to update inventory</li>
        </ul>
      </div>
    </div>
  );
}

