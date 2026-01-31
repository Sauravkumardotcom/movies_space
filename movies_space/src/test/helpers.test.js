import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatNumber,
  formatDate,
  debounce,
  getAspectRatio,
  getVideoUrl,
  getVideoErrorMessage,
} from '../utils/helpers';

describe('formatDuration', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('should format seconds to HH:MM:SS', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('should handle 0 seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('should handle null/undefined', () => {
    expect(formatDuration(null)).toBe('0:00');
    expect(formatDuration(undefined)).toBe('0:00');
  });

  it('should format large duration', () => {
    expect(formatDuration(36000)).toBe('10:00:00');
  });
});

describe('formatNumber', () => {
  it('should format thousands with K', () => {
    expect(formatNumber(1200)).toBe('1.2K');
  });

  it('should format millions with M', () => {
    expect(formatNumber(1200000)).toBe('1.2M');
  });

  it('should return as string for small numbers', () => {
    expect(formatNumber(500)).toBe('500');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDate', () => {
  it('should show "Just now" for recent times', () => {
    const now = new Date();
    const recent = now.getTime();
    expect(formatDate(recent)).toBe('Just now');
  });

  it('should show minutes ago', () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    expect(formatDate(fiveMinutesAgo)).toBe('5m ago');
  });

  it('should show hours ago', () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    expect(formatDate(twoHoursAgo)).toBe('2h ago');
  });

  it('should show days ago', () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    expect(formatDate(threeDaysAgo)).toBe('3d ago');
  });
});

describe('debounce', () => {
  it('should debounce function calls', (done) => {
    let callCount = 0;
    const fn = () => callCount++;
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 150);
  });

  it('should call with latest arguments', (done) => {
    let result = 0;
    const fn = (val) => (result = val);
    const debouncedFn = debounce(fn, 100);

    debouncedFn(1);
    debouncedFn(2);
    debouncedFn(3);

    setTimeout(() => {
      expect(result).toBe(3);
      done();
    }, 150);
  });
});

describe('getAspectRatio', () => {
  it('should calculate 16:9 aspect ratio', () => {
    expect(getAspectRatio(1920, 1080)).toBe('16:9');
  });

  it('should calculate 4:3 aspect ratio', () => {
    expect(getAspectRatio(800, 600)).toBe('4:3');
  });

  it('should calculate 1:1 aspect ratio', () => {
    expect(getAspectRatio(500, 500)).toBe('1:1');
  });
});

describe('getVideoUrl', () => {
  it('should return URL as-is for direct URL source', () => {
    const url = 'https://example.com/video.mp4';
    expect(getVideoUrl(url, 'url')).toBe(url);
  });

  it('should convert Google Drive ID to preview URL', () => {
    const fileId = '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV';
    const result = getVideoUrl(fileId, 'gdrive');
    expect(result).toBe(`https://drive.google.com/file/d/${fileId}/preview`);
  });

  it('should extract Google Drive ID from full URL and convert to preview', () => {
    const url = '/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV/view';
    const result = getVideoUrl(url, 'gdrive');
    expect(result).toBe('https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV/preview');
  });

  it('should return null for empty URL', () => {
    expect(getVideoUrl(null, 'url')).toBe(null);
    expect(getVideoUrl('', 'url')).toBe(null);
  });
});

describe('getVideoErrorMessage', () => {
  it('should return correct error message for code 1', () => {
    expect(getVideoErrorMessage(1)).toBe('Video loading aborted by user');
  });

  it('should return correct error message for code 2', () => {
    expect(getVideoErrorMessage(2)).toBe('Network error - could not load video');
  });

  it('should return correct error message for code 3', () => {
    expect(getVideoErrorMessage(3)).toBe('Video decoding failed - unsupported format');
  });

  it('should return correct error message for code 4', () => {
    expect(getVideoErrorMessage(4)).toBe('Video format not supported by browser');
  });

  it('should return generic message for unknown code', () => {
    expect(getVideoErrorMessage(999)).toBe('Unknown video error');
  });
});
