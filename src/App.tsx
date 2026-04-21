import { useState, useEffect } from 'react';
import { Warehouse, LayoutDashboard, Menu, X, LogOut, ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, Bluetooth, MapPin, Settings, UserCheck, BarChart3, BookOpen } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { PutAwayProcess } from './components/PutAwayProcess';
import { TakeAwayProcess } from './components/TakeAwayProcess';
import { BLETracking } from './components/BLETracking';
import { LocationTracking } from './components/LocationTracking';
import { QualityControl } from './components/QualityControl';
import { MasterDataManagement } from './components/MasterDataManagement';
import { UserApprovals } from './components/UserApprovals';
import { Reporting } from './components/Reporting';
import { Documentation } from './components/Documentation';
import { Login } from './components/Login';
import { seedMasterData } from './utils/seedData';
import { toast, Toaster } from 'sonner';
import { getSupabaseClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import logo from './assets/idTech_logo.png';

type Page = 'dashboard' | 'putaway' | 'takeaway' | 'ble' | 'location' | 'quality' | 'master' | 'approvals' | 'reporting' | 'documentation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('Warehouse Operator');

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient();

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token && session?.user?.id) {
          // Check approval status for existing session
          try {
            const approvalResponse = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-36ac7b49/check-approval`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({
                  user_id: session.user.id,
                }),
              }
            );

            const approvalData = await approvalResponse.json();

            // If no approval record exists (404) or unknown status, allow access (backward compatibility)
            if (approvalResponse.status === 404 || approvalData.status === 'unknown' || approvalData.status === 'approved') {
              setAccessToken(session.access_token);
              setUserEmail(session.user.email || '');
              setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Warehouse Operator');
              setIsAuthenticated(true);
            } else if (approvalData.status === 'pending' || approvalData.status === 'rejected') {
              // User is not approved, sign them out
              await supabase.auth.signOut();
              toast.error('Your account is not approved. Please contact an administrator.');
            }
          } catch (error) {
            // If approval check fails, allow the user in (backward compatibility)
            console.warn('Could not check approval status, allowing access:', error);
            setAccessToken(session.access_token);
            setUserEmail(session.user.email || '');
            setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Warehouse Operator');
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  // Initialize database with seed data on first load
  useEffect(() => {
    const initializeDatabase = async () => {
      if (!isAuthenticated) return;
      
      try {
        await seedMasterData();
        setIsSeeded(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    if (!isSeeded && isAuthenticated) {
      initializeDatabase();
    }
  }, [isSeeded, isAuthenticated]);

  const handleLoginSuccess = (token: string, email: string, name: string) => {
    setAccessToken(token);
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();

      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setAccessToken('');
      setUserEmail('');
      setUserName('Warehouse Operator');
      setCurrentPage('dashboard');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'putaway', label: 'Put-Away', icon: ArrowDownToLine },
    { id: 'takeaway', label: 'Take-Away', icon: ArrowUpFromLine },
    { id: 'quality', label: 'Quality Control', icon: ClipboardCheck },
    { id: 'ble', label: 'BLE Tracking', icon: Bluetooth },
    { id: 'location', label: 'Location Tracking', icon: MapPin },
    { id: 'master', label: 'Master Data', icon: Settings },
    { id: 'approvals', label: 'User Approvals', icon: UserCheck },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
      case 'putaway':
        return <PutAwayProcess />;
      case 'takeaway':
        return <TakeAwayProcess />;
      case 'ble':
        return <BLETracking />;
      case 'location':
        return <LocationTracking />;
      case 'quality':
        return <QualityControl />;
      case 'master':
        return <MasterDataManagement />;
      case 'approvals':
        return <UserApprovals userEmail={userEmail} />;
      case 'reporting':
        return <Reporting />;
      case 'documentation':
        return <Documentation />;
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page as Page)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex">
      {/* Vertical Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-800 text-white fixed h-full z-40">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 bg-white rounded px-2 flex items-center justify-center">
              <img src={logo} alt="ID TECH" className="h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold">WMS Pro</h1>
              <p className="text-xs text-slate-300">Warehouse Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{userName}</div>
              <div className="text-xs text-slate-300 truncate">{userEmail}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-800 text-white shadow-lg z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="h-8 bg-white rounded px-2 flex items-center justify-center">
              <img src={logo} alt="ID TECH" className="h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold">WMS Pro</h1>
            </div>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-slate-800 text-white shadow-2xl z-50 overflow-y-auto">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 bg-white rounded px-2 flex items-center justify-center">
                    <img src={logo} alt="ID TECH" className="h-8 object-contain" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">WMS Pro</h1>
                    <p className="text-xs text-slate-300">Warehouse Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="py-4 px-3">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as Page);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-700 mt-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{userName}</div>
                  <div className="text-xs text-slate-300 truncate">{userEmail}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar - Desktop Only */}
        <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  BLE Warehouse Management System
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>System Status: <span className="text-green-600 font-medium">● Online</span></span>
                <span>Active Beacons: <span className="font-medium">156</span></span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 lg:mt-0">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                © 2026 WMS Pro - BLE Warehouse Management System
              </div>
              <div className="text-sm text-gray-500">
                Version 2.0.1
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}