import React, { useState, useEffect, useRef } from 'react';
import { Camera, Package, TrendingUp, DollarSign, BarChart3, Plus, Search, X, Upload, Trash2, Undo2, PieChart, Edit, Save, Download, FileSpreadsheet } from 'lucide-react';

const lightModeStyle = `
  * {
    color-scheme: light !important;
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    background-color: #f9fafb !important;
    color: #111827 !important;
  }
  input, textarea, select {
    background-color: #ffffff !important;
    color: #111827 !important;
  }
`;

// Quantity Selector Modal
const QuantityModal = ({ product, onConfirm, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem'}}>
      <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '20rem', width: '100%'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Select Quantity</h3>
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>{product.name}</p>
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>Available: {product.stock} units</p>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{width: '3rem', height: '3rem', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold'}}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
            style={{flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '0.75rem', border: '2px solid #d1d5db', borderRadius: '0.5rem', color: '#111827'}}
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            style={{width: '3rem', height: '3rem', backgroundColor: '#DC2626', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold'}}
          >
            +
          </button>
          {activeTab === 'accounting' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
                <h3 style={{fontWeight: 'bold', fontSize: '1.25rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0}}>
                  <FileSpreadsheet size={24} color="#DC2626" />
                  Accounting & Reports
                </h3>
                <button
                  onClick={exportToExcel}
                  style={{padding: '0.75rem 1.5rem', backgroundColor: '#16A34A', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                  <Download size={20} />
                  Export to Excel
                </button>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem'}}>
                  <h4 style={{fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0'}}>Total Revenue</h4>
                  <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#10B981', margin: 0}}>₱{totalSales.toFixed(2)}</p>
                </div>
                <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem'}}>
                  <h4 style={{fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0'}}>Inventory Value</h4>
                  <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#DC2626', margin: 0}}>
                    ₱{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
                  </p>
                </div>
                <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem'}}>
                  <h4 style={{fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0'}}>Total Units Sold</h4>
                  <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0}}>
                    {sales.reduce((sum, s) => sum + (s.quantity || 1), 0)}
                  </p>
                </div>
              </div>

              <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1rem'}}>
                <h4 style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Revenue Breakdown</h4>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Product</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Units Sold</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Revenue</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(salesByProduct)
                        .sort(([, a], [, b]) => b.total - a.total)
                        .map(([productId, data]) => (
                          <tr key={productId} style={{borderBottom: '1px solid #f3f4f6'}}>
                            <td style={{padding: '0.75rem', color: '#111827', fontWeight: '500'}}>{data.productName}</td>
                            <td style={{padding: '0.75rem', textAlign: 'right', color: '#6b7280'}}>{data.totalUnits}</td>
                            <td style={{padding: '0.75rem', textAlign: 'right', color: '#10B981', fontWeight: '500'}}>₱{data.total.toFixed(2)}</td>
                            <td style={{padding: '0.75rem', textAlign: 'right', color: '#6b7280'}}>{((data.total / totalSales) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem'}}>
                <h4 style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Current Inventory</h4>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                        <th style={{textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Product</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Code</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Price</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Stock</th>
                        <th style={{textAlign: 'right', padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '500'}}>Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                          <td style={{padding: '0.75rem', color: '#111827', fontWeight: '500'}}>{product.name}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#6b7280', fontSize: '0.875rem'}}>{product.code}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#6b7280'}}>₱{product.price.toFixed(2)}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: product.stock < 10 ? '#ef4444' : '#6b7280', fontWeight: product.stock < 10 ? 'bold' : 'normal'}}>
                            {product.stock}
                          </td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#10B981', fontWeight: '500'}}>
                            ₱{(product.price * product.stock).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button
            onClick={onClose}
            style={{flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', cursor: 'pointer', fontWeight: '500'}}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            style={{flex: 1, padding: '0.75rem', backgroundColor: '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500'}}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Stock Modal
const EditStockModal = ({ product, onSave, onClose }) => {
  const [stock, setStock] = useState(product.stock);
  
  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem'}}>
      <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '20rem', width: '100%'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Edit Stock</h3>
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>{product.name}</p>
        
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#111827'}}>Stock Quantity</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
            style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', color: '#111827'}}
          />
        </div>
        
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button
            onClick={onClose}
            style={{flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', cursor: 'pointer', fontWeight: '500'}}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(stock)}
            style={{flex: 1, padding: '0.75rem', backgroundColor: '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500'}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Date Modal
const EditDateModal = ({ sale, onSave, onClose }) => {
  const [dateTime, setDateTime] = useState(() => {
    const date = new Date(sale.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  
  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem'}}>
      <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '20rem', width: '100%'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>Edit Date & Time</h3>
        <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>{sale.productName}</p>
        
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#111827'}}>Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', color: '#111827', fontSize: '0.875rem'}}
          />
        </div>
        
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button
            onClick={onClose}
            style={{flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', cursor: 'pointer', fontWeight: '500'}}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const newDate = new Date(dateTime);
              const formattedDate = newDate.toLocaleString('en-US', {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });
              onSave(formattedDate);
            }}
            style={{flex: 1, padding: '0.75rem', backgroundColor: '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500'}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const BarcodeScanner = ({ onScan, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const readerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Html5QrcodeScanner) startScanner();
    };
    
    document.body.appendChild(script);

    return () => {
      if (readerRef.current) {
        readerRef.current.clear().catch(err => console.log(err));
      }
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const startScanner = () => {
    try {
      const html5QrcodeScanner = new window.Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          onScan(decodedText);
          html5QrcodeScanner.clear();
        },
        (error) => {}
      );

      readerRef.current = html5QrcodeScanner;
    } catch (err) {
      setError('Camera not available. Please use manual entry.');
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
      <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0}}>Scan Product</h3>
          <button onClick={onClose} style={{color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'}}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <div id="reader" style={{width: '100%'}}></div>
          {error && <p style={{fontSize: '0.875rem', color: '#DC2626', marginTop: '0.5rem', textAlign: 'center'}}>{error}</p>}
        </div>

        <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
          <p style={{fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem'}}>Or enter code manually:</p>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Enter barcode/QR code"
              style={{flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
            />
            <button 
              onClick={handleManualSubmit}
              style={{padding: '0.5rem 1rem', backgroundColor: '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500'}}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ onAdd, onClose, initialCode }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: initialCode || '',
    price: '',
    stock: '0',
    image: ''
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.code && formData.price) {
      onAdd({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      });
      setFormData({ name: '', code: '', price: '', stock: '0', image: '' });
    }
  };

  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
      <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0}}>Add New Product</h3>
          <button onClick={onClose} style={{color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem'}}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#111827'}}>Product Image</label>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              {formData.image && (
                <img src={formData.image} alt="Product" style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '2px solid #e5e7eb'}} />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{flex: 1, padding: '0.5rem 1rem', border: '2px dashed #d1d5db', borderRadius: '0.5rem', backgroundColor: '#f9fafb', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '500'}}
              >
                <Upload size={20} />
                {formData.image ? 'Change Image' : 'Upload Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
            </div>
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#111827'}}>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
              placeholder="e.g., Coca Cola 500ml"
              autoFocus
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#111827'}}>Barcode/QR Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
              placeholder="e.g., 1234567890"
            />
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#111827'}}>Price (₱) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: '#111827'}}>Initial Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
                placeholder="0"
              />
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '0.5rem', paddingTop: '0.5rem'}}>
            <button
              onClick={onClose}
              style={{flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', cursor: 'pointer', fontWeight: '500'}}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.code || !formData.price}
              style={{flex: 1, padding: '0.75rem 1rem', backgroundColor: (!formData.name || !formData.code || !formData.price) ? '#d1d5db' : '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: (!formData.name || !formData.code || !formData.price) ? 'not-allowed' : 'pointer', fontWeight: '500'}}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    'bg-green-500': '#10B981',
    'bg-red-600': '#DC2626',
    'bg-purple-500': '#A855F7',
    'bg-orange-500': '#F97316'
  };

  return (
    <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem', minHeight: '100px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%'}}>
        <div style={{flex: 1}}>
          <p style={{fontSize: '0.75rem', color: '#6b7280', margin: 0, marginBottom: '0.25rem'}}>{label}</p>
          <p style={{fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 'bold', color: '#111827', margin: 0, wordBreak: 'break-word'}}>{value}</p>
        </div>
        <div style={{padding: '0.75rem', borderRadius: '9999px', backgroundColor: colorMap[color], flexShrink: 0}}>
          <Icon size={20} color="#ffffff" />
        </div>
      </div>
    </div>
  );
};

const SalesTracker = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [deletedSales, setDeletedSales] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showEditStock, setShowEditStock] = useState(false);
  const [showEditDate, setShowEditDate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [scannedCode, setScannedCode] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedSales = localStorage.getItem('sales');
    const savedDeletedSales = localStorage.getItem('deletedSales');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedDeletedSales) setDeletedSales(JSON.parse(savedDeletedSales));
  }, []);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const saveSales = (newSales) => {
    setSales(newSales);
    localStorage.setItem('sales', JSON.stringify(newSales));
  };

  const saveDeletedSales = (deleted) => {
    setDeletedSales(deleted);
    localStorage.setItem('deletedSales', JSON.stringify(deleted));
  };

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

  const getPhilippineTime = () => {
    return new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleScan = (code) => {
    const product = products.find(p => p.code === code);
    
    if (product) {
      if (product.stock === 0) {
        alert('⚠️ Out of stock!');
        setShowScanner(false);
        return;
      }
      setSelectedProduct(product);
      setShowScanner(false);
      setShowQuantityModal(true);
    } else {
      setScannedCode(code);
      setShowScanner(false);
      setShowProductForm(true);
    }
  };

  const handleConfirmQuantity = (quantity) => {
    if (!selectedProduct) return;
    
    const totalPrice = selectedProduct.price * quantity;
    const newSale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: totalPrice,
      quantity: quantity,
      unitPrice: selectedProduct.price,
      timestamp: getPhilippineTime()
    };
    
    saveSales([newSale, ...sales]);
    
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
    );
    saveProducts(updatedProducts);
    
    setShowQuantityModal(false);
    setSelectedProduct(null);
    alert(`✅ Sale recorded!\n${selectedProduct.name}\n×${quantity} = ₱${totalPrice.toFixed(2)}`);
  };

  const handleEditStock = (newStock) => {
    if (!selectedProduct) return;
    
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id ? { ...p, stock: newStock } : p
    );
    saveProducts(updatedProducts);
    setShowEditStock(false);
    setSelectedProduct(null);
  };

  const handleEditDate = (newDate) => {
    if (!selectedSale) return;
    
    const updatedSales = sales.map(s =>
      s.id === selectedSale.id ? { ...s, timestamp: newDate } : s
    );
    saveSales(updatedSales);
    setShowEditDate(false);
    setSelectedSale(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
    }
  };

  const handleDeleteSale = (saleId) => {
    if (window.confirm('Delete this sale?')) {
      const saleToDelete = sales.find(s => s.id === saleId);
      const updatedSales = sales.filter(s => s.id !== saleId);
      saveSales(updatedSales);
      saveDeletedSales([saleToDelete, ...deletedSales]);
      
      const product = products.find(p => p.id === saleToDelete.productId);
      if (product) {
        const updatedProducts = products.map(p => 
          p.id === product.id ? { ...p, stock: p.stock + (saleToDelete.quantity || 1) } : p
        );
        saveProducts(updatedProducts);
      }
    }
  };

  const handleUndoSale = () => {
    if (deletedSales.length === 0) return;
    
    const saleToRestore = deletedSales[0];
    const updatedDeletedSales = deletedSales.slice(1);
    saveDeletedSales(updatedDeletedSales);
    saveSales([saleToRestore, ...sales]);
    
    const product = products.find(p => p.id === saleToRestore.productId);
    if (product) {
      const updatedProducts = products.map(p => 
        p.id === product.id ? { ...p, stock: Math.max(0, p.stock - (saleToRestore.quantity || 1)) } : p
      );
      saveProducts(updatedProducts);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.price, 0);
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });
    return saleDate === today;
  });
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.price, 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const salesByProduct = sales.reduce((acc, sale) => {
    if (!acc[sale.productId]) {
      acc[sale.productId] = {
        productName: sale.productName,
        count: 0,
        totalUnits: 0,
        total: 0,
        sales: []
      };
    }
    acc[sale.productId].count++;
    acc[sale.productId].totalUnits += (sale.quantity || 1);
    acc[sale.productId].total += sale.price;
    acc[sale.productId].sales.push(sale);
    return acc;
  }, {});

  const exportToExcel = () => {
    let csv = 'Sales Report\n\n';
    csv += 'SUMMARY\n';
    csv += `Total Revenue,₱${totalSales.toFixed(2)}\n`;
    csv += `Today's Revenue,₱${todayRevenue.toFixed(2)}\n`;
    csv += `Total Products,${products.length}\n`;
    csv += `Total Transactions,${sales.length}\n\n\n`;
    
    csv += 'DETAILED SALES TRANSACTIONS\n';
    csv += 'Date & Time,Product Name,Quantity,Unit Price,Total Price\n';
    sales.forEach(sale => {
      csv += `${sale.timestamp},${sale.productName},${sale.quantity || 1},₱${(sale.unitPrice || sale.price).toFixed(2)},₱${sale.price.toFixed(2)}\n`;
    });
    
    csv += '\n\nSALES BY PRODUCT\n';
    csv += 'Product Name,Units Sold,Total Revenue,Number of Transactions\n';
    Object.entries(salesByProduct)
      .sort(([, a], [, b]) => b.total - a.total)
      .forEach(([, data]) => {
        csv += `${data.productName},${data.totalUnits},₱${data.total.toFixed(2)},${data.count}\n`;
      });
    
    csv += '\n\nCURRENT INVENTORY\n';
    csv += 'Product Name,Code,Price,Stock,Total Value\n';
    products.forEach(p => {
      csv += `${p.name},${p.code},₱${p.price.toFixed(2)},${p.stock},₱${(p.price * p.stock).toFixed(2)}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style>{lightModeStyle}</style>
      <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', width: '100%', overflowX: 'hidden'}}>
        <div style={{backgroundColor: '#DC2626', color: '#ffffff', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <h1 style={{fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 'bold', margin: 0}}>Nagimasen Sales Tracker</h1>
            <p style={{fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', color: '#fecaca', margin: 0}}>QR & Barcode Scanner</p>
            {!isOnline && (
              <div style={{backgroundColor: '#FFA500', color: '#ffffff', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500'}}>
                📡 Offline Mode
              </div>
            )}
          </div>
        </div>

        <div style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10, overflowX: 'auto'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex'}}>
            {['dashboard', 'products', 'sales', 'analytics', 'accounting'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: '0 0 auto',
                  padding: '0.75rem 1rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: activeTab === tab ? '#DC2626' : '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #DC2626' : 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab === 'analytics' ? 'Sales by Product' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{padding: '1rem', paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto'}}>
          {activeTab === 'dashboard' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
                <StatsCard icon={DollarSign} label="Total Revenue" value={`₱${totalSales.toFixed(2)}`} color="bg-green-500" />
                <StatsCard icon={TrendingUp} label="Today's Sales" value={`₱${todayRevenue.toFixed(2)}`} color="bg-red-600" />
                <StatsCard icon={Package} label="Products" value={products.length} color="bg-purple-500" />
                <StatsCard icon={BarChart3} label="Transactions" value={sales.length} color="bg-orange-500" />
              </div>

              {deletedSales.length > 0 && (
                <div style={{backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.5rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'}}>
                  <span style={{color: '#92400E', fontSize: '0.875rem'}}>Last sale deleted</span>
                  <button
                    onClick={handleUndoSale}
                    style={{padding: '0.5rem 1rem', backgroundColor: '#DC2626', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'}}
                  >
                    <Undo2 size={16} />
                    Undo
                  </button>
                </div>
              )}

              <div style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
                <h3 style={{fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#111827'}}>Recent Sales</h3>
                {sales.slice(0, 10).map(sale => (
                  <div key={sale.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <div style={{flex: '1 1 200px', minWidth: 0}}>
                      <p style={{fontWeight: '500', color: '#111827', margin: 0, fontSize: '0.875rem'}}>{sale.productName}</p>
                      <p style={{fontSize: '0.75rem', color: '#6b7280', margin: 0}}>{sale.timestamp}</p>
                      {sale.quantity > 1 && <p style={{fontSize: '0.75rem', color: '#DC2626', margin: 0}}>×{sale.quantity} units</p>}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <p style={{fontWeight: 'bold', color: '#10B981', margin: 0, whiteSpace: 'nowrap', fontSize: '0.875rem'}}>₱{sale.price.toFixed(2)}</p>
                      <button
                        onClick={() => { setSelectedSale(sale); setShowEditDate(true); }}
                        style={{color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}
                        title="Edit date"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && <p style={{color: '#6b7280', textAlign: 'center', padding: '2rem 0'}}>No sales yet!</p>}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{position: 'relative'}}>
                <Search style={{position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{width: '100%', paddingLeft: '2.5rem', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: '#111827', outline: 'none'}}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                {filteredProducts.map(product => (
                  <div key={product.id} style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
                    {product.image && (
                      <img src={product.image} alt={product.name} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.5rem'}} />
                    )}
                    <h4 style={{fontWeight: 'bold', fontSize: '1rem', color: '#111827', margin: '0 0 0.5rem 0'}}>{product.name}</h4>
                    <p style={{fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0'}}>Code: {product.code}</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                      <p style={{fontSize: '0.875rem', color: '#6b7280', margin: 0}}>Stock: {product.stock}</p>
                      <button
                        onClick={() => { setSelectedProduct(product); setShowEditStock(true); }}
                        style={{color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}
                        title="Edit stock"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem'}}>
                      <p style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#DC2626', margin: 0}}>₱{product.price.toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{fontSize: '0.75rem', color: '#ffffff', padding: '0.5rem 0.75rem', backgroundColor: '#ef4444', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500'}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div style={{textAlign: 'center', padding: '3rem 0'}}>
                  <Package size={48} style={{margin: '0 auto 0.5rem', color: '#d1d5db'}} />
                  <p style={{fontWeight: '500', color: '#6b7280'}}>No products found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sales' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {sales.map(sale => (
                <div key={sale.id} style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                    <div style={{flex: '1 1 200px'}}>
                      <h4 style={{fontWeight: 'bold', color: '#111827', margin: 0, fontSize: '1rem'}}>{sale.productName}</h4>
                      <p style={{fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0'}}>{sale.timestamp}</p>
                      {sale.quantity > 1 && <p style={{fontSize: '0.875rem', color: '#DC2626', margin: 0}}>Quantity: {sale.quantity} × ₱{sale.unitPrice.toFixed(2)}</p>}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <p style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#10B981', margin: 0}}>₱{sale.price.toFixed(2)}</p>
                      <button
                        onClick={() => { setSelectedSale(sale); setShowEditDate(true); }}
                        style={{padding: '0.5rem', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer'}}
                        title="Edit date"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        style={{padding: '0.5rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer'}}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {sales.length === 0 && (
                <div style={{textAlign: 'center', padding: '3rem 0'}}>
                  <BarChart3 size={48} style={{margin: '0 auto 0.5rem', color: '#d1d5db'}} />
                  <p style={{fontWeight: '500', color: '#6b7280'}}>No sales yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h3 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <PieChart size={24} color="#DC2626" />
                Sales by Product
              </h3>
              
              {Object.entries(salesByProduct).length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {Object.entries(salesByProduct)
                    .sort(([, a], [, b]) => b.total - a.total)
                    .map(([productId, data]) => (
                      <div key={productId} style={{backgroundColor: '#ffffff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem'}}>
                          <h4 style={{fontWeight: 'bold', fontSize: '1.125rem', color: '#111827', margin: 0}}>{data.productName}</h4>
                          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <span style={{fontSize: '0.875rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px'}}>
                              {data.totalUnits} unit{data.totalUnits !== 1 ? 's' : ''} sold
                            </span>
                            <span style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#10B981'}}>₱{data.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', maxHeight: '200px', overflowY: 'auto'}}>
                          <p style={{fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem'}}>Sale History:</p>
                          {data.sales.map(sale => (
                            <div key={sale.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem'}}>
                              <span style={{color: '#6b7280'}}>{sale.timestamp}</span>
                              <span style={{color: '#10B981', fontWeight: '500'}}>₱{sale.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '3rem 0', backgroundColor: '#ffffff', borderRadius: '0.5rem'}}>
                  <PieChart size={48} style={{margin: '0 auto 0.5rem', color: '#d1d5db'}} />
                  <p style={{fontWeight: '500', color: '#6b7280'}}>No sales data yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{position: 'fixed', bottom: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 40}}>
          <button
            onClick={() => { setScannedCode(''); setShowProductForm(true); }}
            style={{backgroundColor: '#16A34A', color: '#ffffff', padding: '1rem', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer'}}
            title="Add Product"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={() => setShowScanner(true)}
            style={{backgroundColor: '#DC2626', color: '#ffffff', padding: '1rem', borderRadius: '9999px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer'}}
            title="Scan Product"
          >
            <Camera size={24} />
          </button>
        </div>

        {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
        {showProductForm && (
          <ProductForm
            onAdd={handleAddProduct}
            onClose={() => { setShowProductForm(false); setScannedCode(''); }}
            initialCode={scannedCode}
          />
        )}
        {showQuantityModal && selectedProduct && (
          <QuantityModal
            product={selectedProduct}
            onConfirm={handleConfirmQuantity}
            onClose={() => { setShowQuantityModal(false); setSelectedProduct(null); }}
          />
        )}
        {showEditStock && selectedProduct && (
          <EditStockModal
            product={selectedProduct}
            onSave={handleEditStock}
            onClose={() => { setShowEditStock(false); setSelectedProduct(null); }}
          />
        )}
        {showEditDate && selectedSale && (
          <EditDateModal
            sale={selectedSale}
            onSave={handleEditDate}
            onClose={() => { setShowEditDate(false); setSelectedSale(null); }}
          />
        )}
      </div>
    </>
  );
};

export default SalesTracker;