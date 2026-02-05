import { useState } from 'react';
import { useDeleteComment, useLikeComment, useUnlikeComment } from '../../hooks/useComment';
import { ThumbsUp, Trash2, MessageCircle } from 'lucide-react';
import { Comment } from '../../services/comment';

interface CommentItemProps {
  comment: Comment;
  onReplyClick?: () => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  onReplyClick,
  depth = 0,
}: CommentItemProps) {
  const [showActions, setShowActions] = useState(false);
  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();
  const deleteComment = useDeleteComment();

  const isLiked = comment.isLiked || false;

  return (
    <div
      className={`space-y-2 ${depth > 0 ? 'ml-8 mt-4' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-white font-semibold">{comment.user?.username}</p>
            <p className="text-gray-400 text-xs">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
          {comment.rating && (
            <div className="text-yellow-400 font-semibold">{comment.rating}★</div>
          )}
        </div>

        <p className="text-gray-200 mb-3">{comment.content}</p>

        <div className="flex gap-4 text-sm">
          <button
            onClick={() =>
              isLiked
                ? unlikeComment.mutate(comment.id)
                : likeComment.mutate(comment.id)
            }
            className={`flex items-center gap-1 ${
              isLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {comment._count?.likes || 0}
          </button>

          {depth === 0 && (
            <button
              onClick={onReplyClick}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
          )}

          {showActions && (
            <button
              onClick={() => deleteComment.mutate(comment.id)}
              className="ml-auto flex items-center gap-1 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
