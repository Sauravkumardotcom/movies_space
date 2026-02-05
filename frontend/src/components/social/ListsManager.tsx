import { useState } from 'react';
import { useUserLists, useCreateList, useDeleteList } from '../../hooks/useSocial';
import { Loader, Plus, Trash2 } from 'lucide-react';

interface ListsManagerProps {
  userId: string;
}

export default function ListsManager({ userId }: ListsManagerProps) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  const { data, isLoading } = useUserLists(userId, page);
  const createList = useCreateList();
  const deleteList = useDeleteList();

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    createList.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', description: '', isPublic: true });
        setShowForm(false);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">My Lists</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          New List
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="List name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) =>
                setFormData({ ...formData, isPublic: e.target.checked })
              }
            />
            Public List
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={createList.isPending || !formData.name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {data && data.data.length === 0 && (
        <p className="text-gray-400 text-center py-8">No lists yet</p>
      )}

      <div className="space-y-2">
        {data?.data.map((list) => (
          <div
            key={list.id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-start hover:bg-gray-700 transition"
          >
            <div className="flex-1">
              <p className="text-white font-semibold">{list.name}</p>
              <p className="text-gray-400 text-sm">{list.description}</p>
              <p className="text-gray-500 text-xs mt-1">
                {list.isPublic ? 'Public' : 'Private'} • {list._count?.items || 0} items
              </p>
            </div>
            <button
              onClick={() => deleteList.mutate(list.id)}
              disabled={deleteList.isPending}
              className="text-gray-400 hover:text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
