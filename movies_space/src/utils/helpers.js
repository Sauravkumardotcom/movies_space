// Format duration in seconds to HH:MM:SS
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

// Format large numbers (e.g., 1200 -> 1.2K)
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Format date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Generate gradient based on ID
export const generateGradient = (id) => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-green-500 to-teal-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-red-500 to-pink-600',
  ];
  return gradients[id % gradients.length];
};

// Clamp number between min and max
export const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

// Get aspect ratio text
export const getAspectRatio = (width, height) => {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};
// Validate and fix video URL
export const getVideoUrl = (url, videoSource = 'url') => {
  if (!url) return null;
  
  if (videoSource === 'gdrive') {
    // Extract file ID if it's a full URL
    let fileId = url;
    if (url.includes('/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) fileId = match[1];
    }
    return `https://lh3.googleusercontent.com/d/${fileId}?alt=media`;
  }
  
  // For direct URLs, return as is (they should be working HTTP(S) URLs)
  return url;
};

// Get video error message
export const getVideoErrorMessage = (errorCode) => {
  const errors = {
    1: 'Video loading aborted by user',
    2: 'Network error - could not load video',
    3: 'Video decoding failed - unsupported format',
    4: 'Video format not supported by browser',
  };
  return errors[errorCode] || 'Unknown video error';
};