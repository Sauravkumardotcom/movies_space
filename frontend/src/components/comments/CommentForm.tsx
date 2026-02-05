import { useState } from 'react';
import { useCreateComment } from '../../hooks/useComment';
import { Loader } from 'lucide-react';

interface CommentFormProps {
  entityId: string;
  entityType: 'MOVIE' | 'MUSIC' | 'SHORT';
  onSuccess?: () => void;
}

export default function CommentForm({
  entityId,
  entityType,
  onSuccess,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | undefined>();
  const createComment = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment.mutate(
      { entityId, entityType, content, rating },
      {
        onSuccess: () => {
          setContent('');
          setRating(undefined);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Comment
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rating (Optional)
        </label>
        <select
          value={rating ?? ''}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
            <option key={r} value={r}>
              {r} stars
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={createComment.isPending || !content.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        {createComment.isPending && <Loader className="w-4 h-4 animate-spin" />}
        Post Comment
      </button>

      {createComment.isError && (
        <p className="text-red-400 text-sm">Failed to post comment</p>
      )}
    </form>
  );
}
