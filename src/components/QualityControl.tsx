import { useState } from 'react';
import { ClipboardCheck, Package, Scan, CheckCircle, XCircle, AlertTriangle, Camera, FileText, Bluetooth } from 'lucide-react';
import { toast } from 'sonner';

type InspectionStatus = 'pending' | 'passed' | 'failed' | 'hold';

interface QCItem {
  id: string;
  beaconId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedDate: string;
  status: InspectionStatus;
  inspector?: string;
  notes?: string;
  defects?: string[];
}

export function QualityControl() {
  const [activeTab, setActiveTab] = useState<'inspect' | 'history'>('inspect');
  const [isScanning, setIsScanning] = useState(false);
  const [currentItem, setCurrentItem] = useState<QCItem | null>(null);
  const [inspectionForm, setInspectionForm] = useState({
    condition: 'new',
    visualInspection: true,
    dimensionsCheck: true,
    functionalTest: true,
    packagingIntact: true,
    quantityVerified: true,
    inspector: '',
    notes: '',
    defects: '',
    decision: 'passed' as InspectionStatus,
  });

  const [pendingItems] = useState<QCItem[]>([
    {
      id: 'QC-001',
      beaconId: 'BLE-F2D8E3A1',
      productName: 'Industrial Bearing Set',
      sku: 'SKU-BRG-450',
      quantity: 25,
      receivedDate: '2026-01-09 08:30',
      status: 'pending',
    },
    {
      id: 'QC-002',
      beaconId: 'BLE-A5C9D1F4',
      productName: 'Hydraulic Pump',
      sku: 'SKU-HYD-780',
      quantity: 8,
      receivedDate: '2026-01-09 09:15',
      status: 'pending',
    },
    {
      id: 'QC-003',
      beaconId: 'BLE-E8B3F7C2',
      productName: 'Electric Motor 3HP',
      sku: 'SKU-MTR-3HP',
      quantity: 12,
      receivedDate: '2026-01-09 10:00',
      status: 'pending',
    },
  ]);

  const [completedItems] = useState<QCItem[]>([
    {
      id: 'QC-098',
      beaconId: 'BLE-D4B8E2F1',
      productName: 'Steel Cable 50m',
      sku: 'SKU-CBL-50M',
      quantity: 15,
      receivedDate: '2026-01-08 14:20',
      status: 'passed',
      inspector: 'John Smith',
      notes: 'All checks passed. Good condition.',
    },
    {
      id: 'QC-097',
      beaconId: 'BLE-C3F1A9E5',
      productName: 'Valve Assembly',
      sku: 'SKU-VLV-250',
      quantity: 10,
      receivedDate: '2026-01-08 13:45',
      status: 'hold',
      inspector: 'Sarah Johnson',
      notes: 'Minor packaging damage. Held for review.',
      defects: ['Packaging damage', 'Dents on exterior'],
    },
    {
      id: 'QC-096',
      beaconId: 'BLE-B7E3D5A8',
      productName: 'Control Panel',
      sku: 'SKU-CTL-900',
      quantity: 5,
      receivedDate: '2026-01-08 11:30',
      status: 'failed',
      inspector: 'Mike Davis',
      notes: 'Failed functional test. Missing components.',
      defects: ['Missing screws', 'Incorrect wiring', 'Damaged display'],
    },
  ]);

  const simulateBLEScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomItem = pendingItems[Math.floor(Math.random() * pendingItems.length)];
      setCurrentItem(randomItem);
      setIsScanning(false);
      toast.success(`Scanned: ${randomItem.productName}`);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setInspectionForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setInspectionForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitInspection = () => {
    if (!currentItem) return;
    
    if (!inspectionForm.inspector) {
      toast.error('Please enter inspector name');
      return;
    }

    const status = inspectionForm.decision;
    toast.success(
      status === 'passed' 
        ? 'Item passed inspection and moved to inventory' 
        : status === 'hold'
        ? 'Item placed on hold for review'
        : 'Item failed inspection and marked for return'
    );

    // Reset form
    setCurrentItem(null);
    setInspectionForm({
      condition: 'new',
      visualInspection: true,
      dimensionsCheck: true,
      functionalTest: true,
      packagingIntact: true,
      quantityVerified: true,
      inspector: '',
      notes: '',
      defects: '',
      decision: 'passed',
    });
  };

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'hold': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status: InspectionStatus) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'hold': return <AlertTriangle className="w-4 h-4" />;
      default: return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quality Control</h1>
            <p className="text-sm text-gray-600">Inspect and validate incoming inventory</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{pendingItems.length}</div>
            <div className="text-sm text-blue-600">Pending</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {completedItems.filter(i => i.status === 'passed').length}
            </div>
            <div className="text-sm text-green-600">Passed</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">
              {completedItems.filter(i => i.status === 'hold').length}
            </div>
            <div className="text-sm text-orange-600">On Hold</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {completedItems.filter(i => i.status === 'failed').length}
            </div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inspect')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'inspect'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Inspection
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'history'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Inspection Tab */}
        {activeTab === 'inspect' && (
          <div className="p-6 space-y-6">
            {/* Scan Section */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Bluetooth className="w-4 h-4 text-orange-600" />
                Scan Item for Inspection
              </h3>
              <button
                onClick={simulateBLEScan}
                disabled={isScanning}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
                {isScanning ? 'Scanning...' : 'Scan BLE Beacon'}
              </button>
            </div>

            {/* Current Item */}
            {currentItem && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Item Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Product:</span>
                      <div className="font-medium text-gray-800">{currentItem.productName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">SKU:</span>
                      <div className="font-medium text-gray-800">{currentItem.sku}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Beacon ID:</span>
                      <div className="font-mono text-gray-800">{currentItem.beaconId}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <div className="font-medium text-gray-800">{currentItem.quantity} units</div>
                    </div>
                  </div>
                </div>

                {/* Inspection Checklist */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Inspection Checklist</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'visualInspection', label: 'Visual Inspection' },
                      { name: 'dimensionsCheck', label: 'Dimensions Check' },
                      { name: 'functionalTest', label: 'Functional Test' },
                      { name: 'packagingIntact', label: 'Packaging Intact' },
                      { name: 'quantityVerified', label: 'Quantity Verified' },
                    ].map((check) => (
                      <label key={check.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                        <input
                          type="checkbox"
                          name={check.name}
                          checked={inspectionForm[check.name as keyof typeof inspectionForm] as boolean}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-800">{check.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={inspectionForm.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Inspector Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="inspector"
                      value={inspectionForm.inspector}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Defects Found (if any)
                    </label>
                    <input
                      type="text"
                      name="defects"
                      value={inspectionForm.defects}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Separate multiple defects with commas"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={inspectionForm.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                      placeholder="Additional observations..."
                    />
                  </div>
                </div>

                {/* Decision */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Inspection Decision <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setInspectionForm(prev => ({ ...prev, decision: 'passed' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        inspectionForm.decision === 'passed'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${
                        inspectionForm.decision === 'passed' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-medium ${
                        inspectionForm.decision === 'passed' ? 'text-green-700' : 'text-gray-600'
                      }`}>Pass</div>
                    </button>
                    <button
                      onClick={() => setInspectionForm(prev => ({ ...prev, decision: 'hold' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        inspectionForm.decision === 'hold'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <AlertTriangle className={`w-6 h-6 mx-auto mb-2 ${
                        inspectionForm.decision === 'hold' ? 'text-orange-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-medium ${
                        inspectionForm.decision === 'hold' ? 'text-orange-700' : 'text-gray-600'
                      }`}>Hold</div>
                    </button>
                    <button
                      onClick={() => setInspectionForm(prev => ({ ...prev, decision: 'failed' }))}
                      className={`p-4 border-2 rounded-lg transition ${
                        inspectionForm.decision === 'failed'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <XCircle className={`w-6 h-6 mx-auto mb-2 ${
                        inspectionForm.decision === 'failed' ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <div className={`font-medium ${
                        inspectionForm.decision === 'failed' ? 'text-red-700' : 'text-gray-600'
                      }`}>Fail</div>
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmitInspection}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-lg"
                >
                  Submit Inspection
                </button>
              </div>
            )}

            {/* Pending Items Queue */}
            {!currentItem && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Pending Inspections ({pendingItems.length})</h3>
                <div className="space-y-3">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-orange-600" />
                          <div>
                            <div className="font-medium text-gray-800">{item.productName}</div>
                            <div className="text-sm text-gray-600">
                              {item.sku} • Beacon: {item.beaconId} • Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Received: {item.receivedDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="space-y-3">
              {completedItems.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-800">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          {item.sku} • Beacon: {item.beaconId}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  {item.inspector && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Inspector:</span> {item.inspector}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                  {item.defects && item.defects.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-red-600">Defects:</span>
                      <ul className="list-disc list-inside text-red-600 mt-1">
                        {item.defects.map((defect, idx) => (
                          <li key={idx}>{defect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Inspected: {item.receivedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
