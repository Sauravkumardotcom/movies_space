import AdminStatsPanel from '../components/admin/AdminStatsPanel';
import AdminUsersList from '../components/admin/AdminUsersList';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <AdminStatsPanel />

        <div className="border-t border-gray-700 pt-12">
          <AdminUsersList />
        </div>
      </div>
    </div>
  );
}
