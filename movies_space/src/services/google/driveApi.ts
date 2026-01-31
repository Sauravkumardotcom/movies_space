import client from '../api/client';

/**
 * Google Drive API Service
 * Proxied through backend to avoid CORS issues
 */

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  createdTime?: string;
  modifiedTime?: string;
}

export const driveApi = {
  /**
   * Get file from Google Drive by ID
   */
  getFile: async (fileId: string): Promise<DriveFile> => {
    return await client.get(`/api/google/drive/files/${fileId}`);
  },

  /**
   * List files in a Google Drive folder
   */
  listFiles: async (folderId?: string): Promise<DriveFile[]> => {
    return await client.get('/api/google/drive/files', {
      params: { folderId }
    });
  },

  /**
   * Get file metadata
   */
  getFileMetadata: async (fileId: string): Promise<DriveFile> => {
    return await client.get(`/api/google/drive/files/${fileId}/metadata`);
  },

  /**
   * Get video file from Drive
   * Returns file metadata and access URL
   */
  getVideoFile: async (fileId: string): Promise<{
    id: string;
    name: string;
    webViewLink: string;
    mimeType: string;
    size?: string;
  }> => {
    return await client.get(`/api/google/drive/videos/${fileId}`);
  },

  /**
   * Get all videos from a specific Drive folder
   */
  getVideosFromFolder: async (folderId: string): Promise<DriveFile[]> => {
    return await client.get(`/api/google/drive/folders/${folderId}/videos`);
  },

  /**
   * Get download URL for a file
   */
  getDownloadUrl: async (fileId: string): Promise<{ downloadUrl: string }> => {
    return await client.get(`/api/google/drive/files/${fileId}/download-url`);
  },

  /**
   * Get preview/embed URL for a file
   */
  getEmbedUrl: async (fileId: string): Promise<{ embedUrl: string; webViewLink: string }> => {
    return await client.get(`/api/google/drive/files/${fileId}/embed-url`);
  },
};

export default driveApi;
