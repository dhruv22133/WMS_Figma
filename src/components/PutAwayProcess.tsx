import { useState } from 'react';
import { ArrowDownToLine, Package, Scan, ClipboardCheck, MapPin, CheckCircle2, ChevronRight, Bluetooth, Signal } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'receiving' | 'inspection' | 'location' | 'complete';

interface PutAwayData {
  // Receiving
  bleBeaconId: string;
  bleMacAddress: string;
  signalStrength: string;
  productName: string;
  sku: string;
  quantity: string;
  supplier: string;
  purchaseOrder: string;
  
  // Inspection
  condition: string;
  qaStatus: string;
  qaInspector: string;
  qaNotes: string;
  
  // Location
  warehouse: string;
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
}

export function PutAwayProcess() {
  const [currentStep, setCurrentStep] = useState<Step>('receiving');
  const [isScanning, setIsScanning] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);
  const [formData, setFormData] = useState<PutAwayData>({
    bleBeaconId: '',
    bleMacAddress: '',
    signalStrength: '',
    productName: '',
    sku: '',
    quantity: '',
    supplier: '',
    purchaseOrder: '',
    condition: 'new',
    qaStatus: 'passed',
    qaInspector: '',
    qaNotes: '',
    warehouse: '',
    zone: '',
    aisle: '',
    rack: '',
    bin: '',
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
      toast.success('BLE beacon detected!');
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep === 'receiving') {
      if (!formData.bleBeaconId || !formData.productName || !formData.quantity) {
        toast.error('Please fill in all required receiving fields');
        return;
      }
      setCurrentStep('inspection');
    } else if (currentStep === 'inspection') {
      setCurrentStep('location');
    } else if (currentStep === 'location') {
      if (!formData.warehouse) {
        toast.error('Please select a warehouse');
        return;
      }
      setCurrentStep('complete');
      const location = [formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
        .filter(Boolean)
        .join('-');
      toast.success(`Put-away completed at ${location}`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setCurrentStep('receiving');
        setBleConnected(false);
        setFormData({
          bleBeaconId: '',
          bleMacAddress: '',
          signalStrength: '',
          productName: '',
          sku: '',
          quantity: '',
          supplier: '',
          purchaseOrder: '',
          condition: 'new',
          qaStatus: 'passed',
          qaInspector: '',
          qaNotes: '',
          warehouse: '',
          zone: '',
          aisle: '',
          rack: '',
          bin: '',
        });
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep === 'inspection') {
      setCurrentStep('receiving');
    } else if (currentStep === 'location') {
      setCurrentStep('inspection');
    }
  };

  const steps = [
    { id: 'receiving', label: 'Receiving', icon: Package },
    { id: 'inspection', label: 'Inspection', icon: ClipboardCheck },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 },
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <ArrowDownToLine className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Put-Away Process</h1>
              <p className="text-blue-100 text-sm">Receive, inspect, and store inventory</p>
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
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
          {/* Step 1: Receiving */}
          {currentStep === 'receiving' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Receiving Information
                </h2>

                {/* BLE Beacon Section */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <Bluetooth className="w-4 h-4 text-blue-600" />
                      BLE Beacon Scan
                    </h3>
                    {bleConnected && (
                      <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        Connected
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={simulateBLEScan}
                    disabled={isScanning}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
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
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="SKU-XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Purchase Order
                    </label>
                    <input
                      type="text"
                      name="purchaseOrder"
                      value={formData.purchaseOrder}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="PO-XXXXX"
                    />
                  </div>
                </div>

                {/* Required Fields Notice */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Please scan BLE beacon and fill in all required fields (*) to proceed to inspection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Inspection */}
          {currentStep === 'inspection' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  Quality Inspection
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      QA Status
                    </label>
                    <select
                      name="qaStatus"
                      value={formData.qaStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="passed">Passed</option>
                      <option value="conditional">Conditional Pass</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Inspector Name
                    </label>
                    <input
                      type="text"
                      name="qaInspector"
                      value={formData.qaInspector}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Inspector name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Inspection Notes
                    </label>
                    <textarea
                      name="qaNotes"
                      value={formData.qaNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Any observations, defects, or notes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 'location' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Storage Location
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Warehouse <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="B05"
                    />
                  </div>
                </div>

                {formData.warehouse && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1 font-medium">Storage Location:</div>
                    <div className="text-lg font-mono font-semibold text-blue-900">
                      {[formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                        .filter(Boolean)
                        .join('-')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 'complete' && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Put-Away Complete!</h2>
              <p className="text-gray-600 mb-4">The product has been successfully stored</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{formData.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beacon ID:</span>
                    <span className="font-mono text-xs">{formData.bleBeaconId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-mono text-xs">
                      {[formData.warehouse, formData.zone, formData.aisle, formData.rack, formData.bin]
                        .filter(Boolean)
                        .join('-')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">QA Status:</span>
                    <span className="font-medium capitalize">{formData.qaStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'complete' && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
              {currentStep !== 'receiving' ? (
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
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium text-lg shadow-md hover:shadow-lg"
              >
                {currentStep === 'location' ? 'Complete Put-Away' : 'Continue to Next Step'}
                {currentStep !== 'location' && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}