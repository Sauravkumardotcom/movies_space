import { useState } from 'react';
import { useComments, useReplyToComment } from '../../hooks/useComment';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { Loader } from 'lucide-react';

interface CommentSectionProps {
  entityId: string;
  entityType: 'MOVIE' | 'MUSIC' | 'SHORT';
  title?: string;
}

export default function CommentSection({
  entityId,
  entityType,
  title = 'Comments',
}: CommentSectionProps) {
  const [page, setPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const { data, isLoading, error } = useComments(entityId, entityType, page);
  const replyMutation = useReplyToComment();

  const handleReplySubmit = async (commentId: string) => {
    if (!replyContent.trim()) return;
    
    replyMutation.mutate(
      { commentId, content: replyContent },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyingTo(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <CommentForm
        entityId={entityId}
        entityType={entityType}
        onSuccess={() => setPage(1)}
      />

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          Failed to load comments
        </div>
      )}

      {data && data.data.length === 0 && (
        <p className="text-gray-400 text-center py-8">No comments yet</p>
      )}

      <div className="space-y-4">
        {data?.data.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              onReplyClick={() => setReplyingTo(comment.id)}
            />

            {replyingTo === comment.id && (
              <div className="ml-8 mt-4 p-4 bg-gray-800 rounded-lg">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={replyMutation.isPending || !replyContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
