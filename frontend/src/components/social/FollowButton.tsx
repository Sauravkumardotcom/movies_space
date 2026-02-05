import { useState } from 'react';
import { useFollow, useUnfollow } from '../../hooks/useSocial';
import { Loader } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onSuccess?: () => void;
}

export default function FollowButton({
  userId,
  isFollowing,
  onSuccess,
}: FollowButtonProps) {
  const follow = useFollow(userId);
  const unfollow = useUnfollow(userId);
  const [localFollowing, setLocalFollowing] = useState(isFollowing);

  const handleClick = async () => {
    if (localFollowing) {
      unfollow.mutate(undefined, {
        onSuccess: () => {
          setLocalFollowing(false);
          onSuccess?.();
        },
      });
    } else {
      follow.mutate(undefined, {
        onSuccess: () => {
          setLocalFollowing(true);
          onSuccess?.();
        },
      });
    }
  };

  const isLoading = follow.isPending || unfollow.isPending;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
        localFollowing
          ? 'bg-gray-700 hover:bg-gray-600 text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading && <Loader className="w-4 h-4 animate-spin" />}
      {localFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
