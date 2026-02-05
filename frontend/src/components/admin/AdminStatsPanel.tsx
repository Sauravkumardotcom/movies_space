import { useState } from 'react';
import { usePlatformStats } from '../../hooks/useAdmin';
import { Loader, BarChart3 } from 'lucide-react';

export default function AdminStatsPanel() {
  const { data, isLoading } = usePlatformStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Platform Statistics</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-blue-300">{data.totalUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Movies</p>
            <p className="text-3xl font-bold text-purple-300">{data.totalMovies}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 border border-pink-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Music</p>
            <p className="text-3xl font-bold text-pink-300">{data.totalMusic}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Shorts</p>
            <p className="text-3xl font-bold text-green-300">{data.totalShorts}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border border-yellow-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Comments</p>
            <p className="text-3xl font-bold text-yellow-300">{data.totalComments}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border border-orange-700 p-6 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Ratings</p>
            <p className="text-3xl font-bold text-orange-300">{data.totalRatings}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 border border-cyan-700 p-6 rounded-lg md:col-span-2 lg:col-span-1">
            <p className="text-gray-300 text-sm mb-2">Total Content</p>
            <p className="text-3xl font-bold text-cyan-300">{data.totalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
}
