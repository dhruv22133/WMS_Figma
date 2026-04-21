import { useState } from 'react';
import { ArrowUpFromLine, Package, MapPin, Scan, CheckCircle2, ChevronRight, Bluetooth, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'order' | 'locate' | 'verify' | 'complete';

interface TakeAwayData {
  // Order Details
  orderNumber: string;
  productName: string;
  sku: string;
  requestedQuantity: string;
  destination: string;
  purpose: string;
  
  // Location
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
  
  // Verification
  bleBeaconId: string;
  bleMacAddress: string;
  signalStrength: string;
  pickedQuantity: string;
  pickerName: string;
  notes: string;
}

export function TakeAwayProcess() {
  const [currentStep, setCurrentStep] = useState<Step>('order');
  const [isScanning, setIsScanning] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);
  const [formData, setFormData] = useState<TakeAwayData>({
    orderNumber: '',
    productName: '',
    sku: '',
    requestedQuantity: '',
    destination: '',
    purpose: 'order-fulfillment',
    warehouse: '',
    zone: '',
    aisle: '',
    rack: '',
    bin: '',
    bleBeaconId: '',
    bleMacAddress: '',
    signalStrength: '',
    pickedQuantity: '',
    pickerName: '',
    notes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const simulateBLEScan = () => {
    setIsScanning(true);
    setBleConnected(false);
    setTimeout(() => {
      const mockBeaconId = `BLE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      const mockMacAddress = Array.from({ length: 6 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      ).join(':');
      const mockSignal = -Math.floor(Math.random() * 40 + 50);
      
      setFormData((prev) => ({
        ...prev,
        bleBeaconId: mockBeaconId,
        bleMacAddress: mockMacAddress,
        signalStrength: mockSignal.toString(),
      }));
      setIsScanning(false);
      setBleConnected(true);
      toast.success('BLE beacon verified!');
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep === 'order') {
      if (!formData.productName || !formData.requestedQuantity) {
        toast.error('Please fill in all required order fields');
        return;
      }
      setCurrentStep('locate');
    } else if (currentStep === 'locate') {
      if (!formData.warehouse) {
        toast.error('Please specify the storage location');
        return;
      }
      setCurrentStep('verify');
    } else if (currentStep === 'verify') {
      if (!formData.bleBeaconId || !formData.pickedQuantity) {
        toast.error('Please scan beacon and confirm quantity');
        return;
      }
      setCurrentStep('complete');
      toast.success('Pick completed successfully!');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCurrentStep('order');
        setBleConnected(false);
        setFormData({
          orderNumber: '',
          productName: '',
          sku: '',
          requestedQuantity: '',
          destination: '',
          purpose: 'order-fulfillment',
          warehouse: '',
          zone: '',
          aisle: '',
          rack: '',
          bin: '',
          bleBeaconId: '',
          bleMacAddress: '',
          signalStrength: '',
          pickedQuantity: '',
          pickerName: '',
          notes: '',
        });
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep === 'locate') {
      setCurrentStep('order');
    } else if (currentStep === 'verify') {
      setCurrentStep('locate');
    }
  };

  const steps = [
    { id: 'order', label: 'Order Details', icon: ShoppingCart },
    { id: 'locate', label: 'Location', icon: MapPin },
    { id: 'verify', label: 'Verify & Pick', icon: Bluetooth },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 },
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <ArrowUpFromLine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Take-Away Process</h1>
              <p className="text-green-100 text-sm">Pick and remove inventory from storage</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getStepIndex(currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-6 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Order Details */}
          {currentStep === 'order' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  Order Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Order Number
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="ORD-XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Purpose
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    >
                      <option value="order-fulfillment">Order Fulfillment</option>
                      <option value="transfer">Warehouse Transfer</option>
                      <option value="production">Production Use</option>
                      <option value="quality-check">Quality Check</option>
                      <option value="return">Customer Return</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="SKU-XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Requested Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="requestedQuantity"
                      value={formData.requestedQuantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Shipping dock, Production line, etc."
                    />
                  </div>
                </div>

                {/* Info Notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Note:</span> Fill in the order details and requested quantity to proceed to location selection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 'locate' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Item Location
                </h2>

                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-800">
                    <div className="font-medium mb-2">Picking:</div>
                    <div className="flex items-center justify-between">
                      <span>{formData.productName}</span>
                      <span className="font-mono bg-white px-2 py-1 rounded">Qty: {formData.requestedQuantity}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Warehouse <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="WH-A">WH-A</option>
                      <option value="WH-B">WH-B</option>
                      <option value="WH-C">WH-C</option>
                      <option value="WH-D">WH-D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Zone
                    </label>
                    <input
                      type="text"
                      name="zone"
                      value={formData.zone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="A1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Aisle
                    </label>
                    <input
                      type="text"
                      name="aisle"
                      value={formData.aisle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Rack
                    </label>
                    <input
                      type="text"
                      name="rack"
                      value={formData.rack}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="R3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bin
                    </label>
                    <input
                      type="text"
                      name="bin"
                      value={formData.bin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="B05"
                    />
                  </div>
                </div>

                {formData.warehouse && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-700 mb-1 font-medium">Navigate to Location:</div>
                    <div className="text-lg font-mono font-semibold text-green-900">
                      {[formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                        .filter(Boolean)
                        .join('-')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Verify & Pick */}
          {currentStep === 'verify' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Bluetooth className="w-5 h-5 text-green-600" />
                  Verify & Pick Item
                </h2>

                {/* Location Info */}
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-mono font-medium">
                        {[formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                          .filter(Boolean)
                          .join('-')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-medium">{formData.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested:</span>
                      <span className="font-medium">{formData.requestedQuantity} units</span>
                    </div>
                  </div>
                </div>

                {/* BLE Beacon Verification */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <Bluetooth className="w-4 h-4 text-green-600" />
                      Scan BLE Beacon to Verify Item
                    </h3>
                    {bleConnected && (
                      <div className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={simulateBLEScan}
                    disabled={isScanning}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                  >
                    <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
                    {isScanning ? 'Scanning...' : 'Scan BLE Beacon'}
                  </button>

                  {bleConnected && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Beacon ID:</span>
                        <span className="font-mono font-medium">{formData.bleBeaconId}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">MAC Address:</span>
                        <span className="font-mono text-xs">{formData.bleMacAddress}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Signal:</span>
                        <span className="font-mono">{formData.signalStrength} dBm</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Picked Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pickedQuantity"
                      value={formData.pickedQuantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Picker Name
                    </label>
                    <input
                      type="text"
                      name="pickerName"
                      value={formData.pickerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Worker name or ID"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                      placeholder="Any notes or observations..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pick Complete!</h2>
              <p className="text-gray-600 mb-4">Item successfully removed from inventory</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order:</span>
                    <span className="font-medium">{formData.orderNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{formData.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beacon ID:</span>
                    <span className="font-mono text-xs">{formData.bleBeaconId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Picked Quantity:</span>
                    <span className="font-medium">{formData.pickedQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From Location:</span>
                    <span className="font-mono text-xs">
                      {[formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                        .filter(Boolean)
                        .join('-')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium capitalize">{formData.purpose.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'complete' && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
              {currentStep !== 'order' ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium text-lg shadow-md hover:shadow-lg"
              >
                {currentStep === 'verify' ? 'Complete Pick' : 'Continue to Next Step'}
                {currentStep !== 'verify' && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
