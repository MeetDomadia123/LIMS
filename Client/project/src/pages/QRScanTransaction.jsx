import React, { useState } from 'react';
import { QrCode, Package, Plus, Minus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { mockAuth } from '../utils/mockAuth';
import { showToast } from '../components/Toast';

const QRScanTransaction = () => {
  const user = mockAuth.getCurrentUser();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedComponent, setScannedComponent] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Mock component database
  const mockComponents = {
    'ARD-UNO-R3': { name: 'Arduino Uno R3', currentStock: 45, location: 'A1-B2' },
    'RPI-4B-4GB': { name: 'Raspberry Pi 4 Model B', currentStock: 23, location: 'A2-C1' },
    'ESP32-DEV-V1': { name: 'ESP32 DevKit V1', currentStock: 67, location: 'B1-A3' },
    'LM358N-DIP8': { name: 'LM358 Dual Op-Amp', currentStock: 234, location: 'C2-B1' },
    'HC-SR04': { name: 'HC-SR04 Ultrasonic Sensor', currentStock: 78, location: 'D1-C3' }
  };

  const reasons = {
    inward: [
      'New Stock Arrival',
      'Return from Production',
      'Quality Check Return',
      'Supplier Delivery'
    ],
    outward: [
      'Production Batch',
      'Prototype Development',
      'Quality Testing',
      'Research Project',
      'Manufacturing Line A',
      'Manufacturing Line B'
    ]
  };

  // Simulate QR scanning
  const simulateQRScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const componentIds = Object.keys(mockComponents);
      const randomId = componentIds[Math.floor(Math.random() * componentIds.length)];
      const component = mockComponents[randomId];
      
      setScannedComponent({
        id: randomId,
        ...component
      });
      setIsScanning(false);
      
      // Auto-select transaction type based on user role
      if (user.role === 'lab-technician') {
        setTransactionType('inward');
      } else if (user.role === 'manufacturing-engineer') {
        setTransactionType('outward');
      }
      
      showToast.success(`Component scanned: ${component.name}`);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scannedComponent || !transactionType || !quantity || !reason) {
      showToast.error('Please fill in all required fields');
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      showToast.error('Quantity must be greater than 0');
      return;
    }

    if (transactionType === 'outward' && qty > scannedComponent.currentStock) {
      showToast.error('Insufficient stock available');
      return;
    }

    setProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const action = transactionType === 'inward' ? 'added to' : 'removed from';
      showToast.success(
        `Successfully ${action} inventory: ${qty} units of ${scannedComponent.name}`
      );
      
      // Reset form
      setScannedComponent(null);
      setTransactionType('');
      setQuantity('');
      setReason('');
      
    } catch (error) {
      showToast.error('Transaction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const canScanInward = user.role === 'admin' || user.role === 'lab-technician';
  const canScanOutward = user.role === 'admin' || user.role === 'manufacturing-engineer';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
          <p className="text-gray-600 mt-2">Scan component QR codes for inventory transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Scanner</h2>
            
            <div className="text-center">
              {!isScanning ? (
                <div className="space-y-6">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  
                  <button
                    onClick={simulateQRScan}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    Start QR Scan
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    Click to simulate QR code scanning
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-48 h-48 mx-auto bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-300 animate-pulse">
                    <QrCode className="w-24 h-24 text-blue-500 animate-pulse" />
                  </div>
                  
                  <div className="text-blue-600">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="font-medium">Scanning QR Code...</p>
                    <p className="text-sm">Please hold the camera steady</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h2>
            
            {!scannedComponent ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Scan a component QR code to begin transaction</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scanned Component Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{scannedComponent.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Part Number: {scannedComponent.id}</p>
                    <p>Current Stock: {scannedComponent.currentStock}</p>
                    <p>Location: {scannedComponent.location}</p>
                  </div>
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Transaction Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {canScanInward && (
                      <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        transactionType === 'inward' ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="transactionType"
                          value="inward"
                          checked={transactionType === 'inward'}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="sr-only"
                        />
                        <ArrowUpCircle className={`w-5 h-5 mr-3 ${
                          transactionType === 'inward' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">Inward</p>
                          <p className="text-xs text-gray-500">Add to inventory</p>
                        </div>
                      </label>
                    )}

                    {canScanOutward && (
                      <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        transactionType === 'outward' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="transactionType"
                          value="outward"
                          checked={transactionType === 'outward'}
                          onChange={(e) => setTransactionType(e.target.value)}
                          className="sr-only"
                        />
                        <ArrowDownCircle className={`w-5 h-5 mr-3 ${
                          transactionType === 'outward' ? 'text-red-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">Outward</p>
                          <p className="text-xs text-gray-500">Remove from inventory</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <div className="relative">
                    {transactionType === 'inward' ? (
                      <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    ) : (
                      <Minus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      max={transactionType === 'outward' ? scannedComponent.currentStock : undefined}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter quantity"
                    />
                  </div>
                  {transactionType === 'outward' && (
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum available: {scannedComponent.currentStock}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select reason</option>
                    {transactionType && reasons[transactionType]?.map((reasonOption) => (
                      <option key={reasonOption} value={reasonOption}>
                        {reasonOption}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing || !transactionType || !quantity || !reason}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing Transaction...
                    </div>
                  ) : (
                    `Complete ${transactionType === 'inward' ? 'Inward' : 'Outward'} Transaction`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanTransaction;