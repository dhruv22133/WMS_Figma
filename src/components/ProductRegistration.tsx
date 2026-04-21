import { useState } from 'react';
import { Warehouse, Bluetooth, CheckCircle2, Scan, MapPin, Box, Package2, ClipboardCheck, AlertTriangle, Signal } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormData {
  productName: string;
  category: string;
  sku: string;
  bleBeaconId: string;
  bleMacAddress: string;
  signalStrength: string;
  quantity: string;
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
  condition: string;
  supplier: string;
  qaStatus: string;
  qaInspector: string;
  qaNotes: string;
  isHold: boolean;
  holdReason: string;
  holdArea: string;
}

export function ProductRegistration() {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    category: '',
    sku: '',
    bleBeaconId: '',
    bleMacAddress: '',
    signalStrength: '',
    quantity: '',
    warehouse: '',
    zone: '',
    aisle: '',
    rack: '',
    bin: '',
    condition: 'new',
    supplier: '',
    qaStatus: 'pending',
    qaInspector: '',
    qaNotes: '',
    isHold: false,
    holdReason: '',
    holdArea: '',
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const simulateBLEScan = () => {
    setIsScanning(true);
    setBleConnected(false);
    // Simulate BLE beacon scanning delay
    setTimeout(() => {
      const mockBeaconId = `BLE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      const mockMacAddress = Array.from({ length: 6 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      ).join(':');
      const mockSignal = -Math.floor(Math.random() * 40 + 50); // -50 to -90 dBm
      
      setFormData((prev) => ({
        ...prev,
        bleBeaconId: mockBeaconId,
        bleMacAddress: mockMacAddress,
        signalStrength: mockSignal.toString(),
      }));
      setIsScanning(false);
      setBleConnected(true);
      toast.success('BLE beacon detected and connected!');
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.bleBeaconId || !formData.quantity || !formData.warehouse) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.isHold && !formData.holdReason) {
      toast.error('Please specify hold reason');
      return;
    }

    // Simulate successful registration
    setIsSubmitted(true);
    const location = formData.isHold && formData.holdArea 
      ? `HOLD-${formData.holdArea}` 
      : `${formData.warehouse}-${formData.zone}-${formData.aisle}-${formData.rack}-${formData.bin}`;
    toast.success(`Product registered at ${location}`);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setBleConnected(false);
      setFormData({
        productName: '',
        category: '',
        sku: '',
        bleBeaconId: '',
        bleMacAddress: '',
        signalStrength: '',
        quantity: '',
        warehouse: '',
        zone: '',
        aisle: '',
        rack: '',
        bin: '',
        condition: 'new',
        supplier: '',
        qaStatus: 'pending',
        qaInspector: '',
        qaNotes: '',
        isHold: false,
        holdReason: '',
        holdArea: '',
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-lg">
                <Warehouse className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Warehouse Inventory</h1>
                <p className="text-slate-300 text-sm">BLE Beacon Tracking System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-300">Date</div>
              <div className="text-white font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package2 className="w-5 h-5 text-slate-600" />
              Product Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1.5">
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="SKU-XXXXX"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                >
                  <option value="">Select category</option>
                  <option value="raw-materials">Raw Materials</option>
                  <option value="finished-goods">Finished Goods</option>
                  <option value="components">Components</option>
                  <option value="packaging">Packaging</option>
                  <option value="tools">Tools & Equipment</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Supplier
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="Supplier name"
                />
              </div>
            </div>
          </div>

          {/* RFID Tag Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-blue-600" />
                BLE Beacon
              </h2>
              {bleConnected && (
                <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Connected
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Scan Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={simulateBLEScan}
                  disabled={isScanning}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Bluetooth className={`w-6 h-6 ${isScanning ? 'animate-pulse' : ''}`} />
                  <span className="font-medium">
                    {isScanning ? 'Scanning for BLE Beacons...' : 'Scan BLE Beacon'}
                  </span>
                </button>
              </div>

              {/* BLE Beacon ID */}
              <div>
                <label htmlFor="bleBeaconId" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Beacon ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Bluetooth className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="bleBeaconId"
                    name="bleBeaconId"
                    value={formData.bleBeaconId}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-mono"
                    placeholder="BLE-XXXXXXXX"
                    required
                  />
                </div>
              </div>

              {/* MAC Address and Signal Strength */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bleMacAddress" className="block text-sm font-medium text-gray-700 mb-1.5">
                    MAC Address
                  </label>
                  <input
                    type="text"
                    id="bleMacAddress"
                    name="bleMacAddress"
                    value={formData.bleMacAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"
                    placeholder="AA:BB:CC:DD:EE:FF"
                  />
                </div>
                <div>
                  <label htmlFor="signalStrength" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Signal Strength (dBm)
                  </label>
                  <div className="relative">
                    <Signal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="signalStrength"
                      name="signalStrength"
                      value={formData.signalStrength}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="-65"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* BLE Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">BLE Technology:</span> Low-energy Bluetooth beacons provide real-time location tracking with battery life up to 2-5 years.
                </p>
              </div>
            </div>
          </div>

          {/* QA Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-slate-600" />
              Quality Assurance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* QA Status */}
              <div>
                <label htmlFor="qaStatus" className="block text-sm font-medium text-gray-700 mb-1.5">
                  QA Status
                </label>
                <select
                  id="qaStatus"
                  name="qaStatus"
                  value={formData.qaStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                >
                  <option value="pending">Pending Inspection</option>
                  <option value="in-progress">In Progress</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="conditional">Conditional Pass</option>
                </select>
              </div>

              {/* QA Inspector */}
              <div>
                <label htmlFor="qaInspector" className="block text-sm font-medium text-gray-700 mb-1.5">
                  QA Inspector
                </label>
                <input
                  type="text"
                  id="qaInspector"
                  name="qaInspector"
                  value={formData.qaInspector}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="Inspector name"
                />
              </div>

              {/* QA Notes */}
              <div className="md:col-span-2">
                <label htmlFor="qaNotes" className="block text-sm font-medium text-gray-700 mb-1.5">
                  QA Notes
                </label>
                <textarea
                  id="qaNotes"
                  name="qaNotes"
                  value={formData.qaNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition resize-none"
                  placeholder="Inspection notes, defects, or quality observations..."
                />
              </div>
            </div>
          </div>

          {/* Hold Area Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="isHold"
                name="isHold"
                checked={formData.isHold}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <div className="flex-1">
                <label htmlFor="isHold" className="flex items-center gap-2 text-lg font-semibold text-gray-800 cursor-pointer">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Place in Hold Area
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Check this box if the product needs to be placed on hold
                </p>
              </div>
            </div>

            {formData.isHold && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hold Area */}
                  <div>
                    <label htmlFor="holdArea" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hold Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="holdArea"
                      name="holdArea"
                      value={formData.holdArea}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                      required={formData.isHold}
                    >
                      <option value="">Select hold area</option>
                      <option value="QA-HOLD-1">QA Hold Area 1</option>
                      <option value="QA-HOLD-2">QA Hold Area 2</option>
                      <option value="DAMAGE-HOLD">Damage Hold</option>
                      <option value="QUARANTINE">Quarantine Zone</option>
                      <option value="RETURN-HOLD">Return Hold</option>
                      <option value="CUSTOM-HOLD">Custom Hold</option>
                    </select>
                  </div>

                  {/* Hold Reason */}
                  <div>
                    <label htmlFor="holdReason" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hold Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="holdReason"
                      name="holdReason"
                      value={formData.holdReason}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-white"
                      required={formData.isHold}
                    >
                      <option value="">Select reason</option>
                      <option value="qa-failed">QA Failed</option>
                      <option value="damaged">Damaged</option>
                      <option value="missing-docs">Missing Documentation</option>
                      <option value="wrong-item">Wrong Item</option>
                      <option value="expired">Expired/Near Expiry</option>
                      <option value="recall">Product Recall</option>
                      <option value="investigation">Under Investigation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-100 border border-amber-300 rounded p-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Hold Status:</span> This product will be placed in the hold area and will not be available for regular warehouse operations until released.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-600" />
              Storage Location
              {formData.isHold && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                  Overridden by Hold Area
                </span>
              )}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Warehouse */}
              <div>
                <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  id="warehouse"
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  required
                >
                  <option value="">Select</option>
                  <option value="WH-A">WH-A</option>
                  <option value="WH-B">WH-B</option>
                  <option value="WH-C">WH-C</option>
                  <option value="WH-D">WH-D</option>
                </select>
              </div>

              {/* Zone */}
              <div>
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Zone
                </label>
                <input
                  type="text"
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="A1"
                />
              </div>

              {/* Aisle */}
              <div>
                <label htmlFor="aisle" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Aisle
                </label>
                <input
                  type="text"
                  id="aisle"
                  name="aisle"
                  value={formData.aisle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="12"
                />
              </div>

              {/* Rack */}
              <div>
                <label htmlFor="rack" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rack
                </label>
                <input
                  type="text"
                  id="rack"
                  name="rack"
                  value={formData.rack}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="R3"
                />
              </div>

              {/* Bin */}
              <div>
                <label htmlFor="bin" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bin
                </label>
                <input
                  type="text"
                  id="bin"
                  name="bin"
                  value={formData.bin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="B05"
                />
              </div>
            </div>

            {/* Location Preview */}
            {(formData.warehouse || formData.zone || formData.aisle || formData.rack || formData.bin) && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-sm text-slate-600 mb-1">Full Location:</div>
                <div className="text-lg font-mono font-semibold text-slate-800">
                  {formData.isHold 
                    ? `${formData.holdArea || 'HOLD-AREA'} (Hold Override Active)`
                    : [formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                        .filter(Boolean)
                        .join('-') || 'Not specified'}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3.5 rounded-lg font-medium hover:from-slate-800 hover:to-slate-900 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Product Registered Successfully!
                </>
              ) : (
                <>
                  <Box className="w-5 h-5" />
                  Register Product in Warehouse
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-600 flex items-center gap-2">
              <Bluetooth className="w-4 h-4 text-blue-600" />
              BLE beacon tracking enabled for real-time inventory management
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}