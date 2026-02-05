import { useParams } from 'react-router-dom';
import { useFollowerStats } from '../hooks/useSocial';
import FollowButton from '../components/social/FollowButton';
import FollowerList from '../components/social/FollowerList';
import ListsManager from '../components/social/ListsManager';
import { Loader } from 'lucide-react';
import { useState } from 'react';

export default function SocialPage() {
  const { userId = '' } = useParams();
  const { data: stats } = useFollowerStats(userId);
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'lists'>('followers');

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {stats && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-lg p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{userId}</h1>
              </div>
              <FollowButton userId={userId} isFollowing={false} />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-3xl font-bold text-blue-400">
                  {stats.followerCount || 0}
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Following</p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.followingCount || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 border-b border-gray-700">
          {(['followers', 'following', 'lists'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'followers' && <FollowerList userId={userId} type="followers" />}
        {activeTab === 'following' && <FollowerList userId={userId} type="following" />}
        {activeTab === 'lists' && <ListsManager userId={userId} />}
      </div>
    </div>
  );
}
