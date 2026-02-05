import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { Search, Loader, X } from 'lucide-react';

interface SearchBarProps {
  onSelect?: (result: any) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();

  const { data, isLoading } = useSearch(debouncedQuery, undefined, 1, query.length > 2);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result: any) => {
    onSelect?.(result);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search movies, music, shorts..."
          className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showResults && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          )}

          {data && data.data.length === 0 && (
            <div className="text-center py-6 text-gray-400">No results found</div>
          )}

          {data?.data.map((result) => (
            <button
              key={`${result.id}-${result.entityType}`}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-b-0"
            >
              <p className="text-white font-semibold">{result.title}</p>
              <p className="text-gray-400 text-sm capitalize">{result.entityType}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
