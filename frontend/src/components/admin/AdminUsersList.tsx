import { useState } from 'react';
import { useAdminUsers, useBanUser } from '../../hooks/useAdmin';
import { Loader, Ban } from 'lucide-react';

export default function AdminUsersList() {
  const [page, setPage] = useState(1);
  const [banReason, setBanReason] = useState('');
  const { data, isLoading } = useAdminUsers(page);
  const banUser = useBanUser();

  const handleBan = (userId: string) => {
    if (confirm(`Ban this user? ${banReason ? 'Reason: ' + banReason : ''}`)) {
      banUser.mutate(userId, banReason, {
        onSuccess: () => setBanReason(''),
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Users</h2>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="px-4 py-3 text-white">Username</th>
              <th className="px-4 py-3 text-white">Email</th>
              <th className="px-4 py-3 text-white">Admin</th>
              <th className="px-4 py-3 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition"
              >
                <td className="px-4 py-3 text-gray-200">{user.username}</td>
                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      user.isAdmin
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-green-900/50 text-green-300'
                    }`}
                  >
                    {user.isAdmin ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleBan(user.id)}
                    disabled={banUser.isPending}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
          >
            Previous
          </button>
          <span className="text-gray-400 py-2">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.totalPages}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
