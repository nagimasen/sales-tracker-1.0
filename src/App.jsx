import React, { useState, useEffect, useRef } from 'react';
import { Camera, Package, TrendingUp, DollarSign, BarChart3, Plus, Search, X } from 'lucide-react';

// ============= STORAGE UTILITIES =============

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error('Error reading from storage:', err);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Error writing to storage:', err);
      return false;
    }
  }
};

// ============= COMPONENTS =============

// Scanner Component
const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let stream = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsScanning(true);
        setError('');
      } catch (err) {
        console.error('Camera access denied:', err);
        setError('Camera not available. Please use manual entry.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Scan Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full rounded-lg bg-gray-900"
            style={{ maxHeight: '300px' }}
          />
          {error ? (
            <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
          ) : (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {isScanning ? 'Position barcode in view' : 'Starting camera...'}
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Enter code manually:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Enter barcode/QR code"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button 
              onClick={handleManualSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ onAdd, onClose, initialCode }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: initialCode || '',
    price: '',
    stock: '0'
  });

  const handleSubmit = () => {
    if (formData.name && formData.code && formData.price) {
      onAdd({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      });
      setFormData({ name: '', code: '', price: '', stock: '0' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Product</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Coca Cola 500ml"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Barcode/QR Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1234567890"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Initial Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.code || !formData.price}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

// ============= MAIN APP =============

const SalesTracker = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = storage.get('products');
    const savedSales = storage.get('sales');
    
    if (savedProducts) setProducts(savedProducts);
    if (savedSales) setSales(savedSales);
  }, []);

  // Save products to localStorage
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    storage.set('products', newProducts);
  };

  // Save sales to localStorage
  const saveSales = (newSales) => {
    setSales(newSales);
    storage.set('sales', newSales);
  };

  // Add new product
  const handleAddProduct = (product) => {
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      createdAt: new Date().toISOString()
    };
    saveProducts([...products, newProduct]);
    setShowProductForm(false);
    setScannedCode('');
  };

  // Handle barcode scan
  const handleScan = (code) => {
    const product = products.find(p => p.code === code);
    
    if (product) {
      const newSale = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        timestamp: new Date().toISOString()
      };
      
      saveSales([newSale, ...sales]);
      
      // Update stock
      const updatedProducts = products.map(p => 
        p.id === product.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
      );
      saveProducts(updatedProducts);
      
      setShowScanner(false);
      alert(`✅ Sale recorded!\n${product.name}\n$${product.price.toFixed(2)}`);
    } else {
      setScannedCode(code);
      setShowScanner(false);
      setShowProductForm(true);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
    }
  };

  // Calculate stats
  const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  });
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.price, 0);

  // Filter products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Sales Tracker Pro</h1>
        <p className="text-blue-100 text-sm">QR & Barcode Scanner</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'products' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'sales' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Sales
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${totalSales.toFixed(2)}`}
                color="bg-green-500"
              />
              <StatsCard
                icon={TrendingUp}
                label="Today's Sales"
                value={`$${todayRevenue.toFixed(2)}`}
                color="bg-blue-500"
              />
              <StatsCard
                icon={Package}
                label="Products"
                value={products.length}
                color="bg-purple-500"
              />
              <StatsCard
                icon={BarChart3}
                label="Total Transactions"
                value={sales.length}
                color="bg-orange-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-3">Recent Sales</h3>
              {sales.slice(0, 10).map(sale => (
                <div key={sale.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{sale.productName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">${sale.price.toFixed(2)}</p>
                </div>
              ))}
              {sales.length === 0 && (
                <p className="text-gray-500 text-center py-4">No sales yet. Start by adding products!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <p className="text-sm text-gray-600">Code: {product.code}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">No products found</p>
                  <p className="text-sm">Click the + button to add your first product</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-2">
            {sales.map(sale => (
              <div key={sale.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{sale.productName}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(sale.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">${sale.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-2 text-gray-300" />
                <p className="font-medium">No sales recorded yet</p>
                <p className="text-sm">Scan products to record sales</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
        <button
          onClick={() => {
            setScannedCode('');
            setShowProductForm(true);
          }}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
          title="Add Product"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
          title="Scan Product"
        >
          <Camera size={24} />
        </button>
      </div>

      {/* Modals */}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
      
      {showProductForm && (
        <ProductForm
          onAdd={handleAddProduct}
          onClose={() => {
            setShowProductForm(false);
            setScannedCode('');
          }}
          initialCode={scannedCode}
        />
      )}
    </div>
  );
};

export default SalesTracker;