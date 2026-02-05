import { useFollowers, useFollowing } from '../../hooks/useSocial';
import { Users, Loader } from 'lucide-react';
import { useState } from 'react';

interface FollowerListProps {
  userId: string;
  type: 'followers' | 'following';
}

export default function FollowerList({ userId, type }: FollowerListProps) {
  const [page, setPage] = useState(1);
  const useHook = type === 'followers' ? useFollowers : useFollowing;
  const { data, isLoading, error } = useHook(userId, page);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">
          {type === 'followers' ? 'Followers' : 'Following'}
        </h3>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          Failed to load {type}
        </div>
      )}

      {data && data.data.length === 0 && (
        <p className="text-gray-400 text-center py-8">No {type} yet</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          >
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        ))}
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
