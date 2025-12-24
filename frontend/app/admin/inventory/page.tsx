'use client';

import { useState, useEffect } from 'react';
import { Scan, Package, CheckCircle, XCircle } from 'lucide-react';
import { inventoryApi, StockLog } from '@/lib/api/inventory';

export default function AdminInventoryPage() {
  const [scanValue, setScanValue] = useState('');
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState('1');
  const [stockType, setStockType] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState<StockLog[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const response = await inventoryApi.getStockLogs({ page: 1, limit: 10 });
      setRecentLogs(response.logs);
    } catch (error) {
      console.error('Error loading stock logs:', error);
    }
  };

  const handleScan = async () => {
    if (!scanValue.trim() || !quantity) {
      setErrorMessage('Please enter barcode/variant code and quantity');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Determine if it's a variant_code (QR format like "SR-SILK-RED-001") or barcode
      const isVariantCode = /^[A-Z]+-[A-Z]+-[A-Z]+-\d+$/i.test(scanValue.trim());
      
      const requestData = {
        ...(isVariantCode ? { variant_code: scanValue.trim() } : { barcode: scanValue.trim() }),
        quantity: parseInt(quantity),
        transactionType,
        stockType,
        reason: transactionType === 'IN' ? 'Stock IN' : 'Stock OUT',
        notes: notes.trim() || undefined,
      };

      const response = await inventoryApi.scanStock(requestData);
      
      setSuccessMessage(response.message);
      setScanValue('');
      setQuantity('1');
      setNotes('');
      
      // Reload recent logs
      await loadRecentLogs();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || error.message || 'Failed to process transaction');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

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
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scan Barcode / QR Code (Variant Code)
            </label>
            <input
              type="text"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="Enter or scan barcode/variant code (e.g., SR-SILK-RED-001)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleScan();
                }
              }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Supports both barcode and variant_code (QR format: SR-SILK-RED-001)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'IN' | 'OUT')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            >
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Type
            </label>
            <select
              value={stockType}
              onChange={(e) => setStockType(e.target.value as 'ONLINE' | 'OFFLINE')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            >
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this transaction..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full bg-[#312e81] hover:bg-[#1e3a8a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Processing...' : 'Process Transaction'}
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-[#312e81]" />
            <h2 className="font-heading text-2xl text-[#312e81]">Recent Transactions</h2>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent transactions</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{log.product?.name || 'Product'}</p>
                      {log.variant && (
                        <p className="text-sm text-gray-600">{log.variant.name}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.transactionType === 'IN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.transactionType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Qty: {log.quantity}</span>
                    <span>{log.stockType}</span>
                    <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                  {log.notes && (
                    <p className="text-xs text-gray-500 mt-1">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use QR Code / Barcode Scanner:</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li><strong>Variant Code (QR):</strong> Scan or enter variant code (e.g., "SR-SILK-RED-001")</li>
          <li><strong>Barcode:</strong> Scan or enter product/variant barcode</li>
          <li>Select transaction type (Stock IN or Stock OUT)</li>
          <li>Enter quantity and select stock type (Online/Offline)</li>
          <li>Click "Process Transaction" to update inventory instantly</li>
          <li>Stock updates are reflected immediately across all channels</li>
        </ul>
        <p className="mt-3 text-sm text-blue-700">
          <strong>Note:</strong> The system automatically detects if the scanned value is a variant_code (QR format) or barcode.
        </p>
      </div>
    </div>
  );
}

