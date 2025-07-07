/**
 * クラウドストレージ統合システム
 * Google Drive、Dropbox、OneDrive対応
 */

export interface CloudStorageProvider {
  name: string;
  icon: string;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  upload: (file: File, filename: string) => Promise<string>;
  createFolder: (folderName: string) => Promise<string>;
  getShareLink: (fileId: string) => Promise<string>;
}

export interface UploadResult {
  success: boolean;
  fileId?: string;
  shareLink?: string;
  error?: string;
}

// Google Drive API統合
class GoogleDriveProvider implements CloudStorageProvider {
  name = 'Google Drive';
  icon = '📁';
  isAuthenticated = false;
  private accessToken: string | null = null;

  async authenticate(): Promise<void> {
    try {
      // Google Drive API認証
      const response = await fetch('https://accounts.google.com/o/oauth2/v2/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          redirect_uri: window.location.origin + '/auth/google',
          response_type: 'code',
          scope: 'https://www.googleapis.com/auth/drive.file',
        }),
      });

      // 実際の実装では、OAuth2 フローを使用
      this.isAuthenticated = true;
      this.accessToken = 'mock_token';
    } catch (error) {
      console.error('Google Drive認証エラー:', error);
      throw new Error('Google Drive認証に失敗しました');
    }
  }

  async upload(file: File, filename: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      // ファイルメタデータ作成
      const metadata = {
        name: filename,
        parents: ['root'], // ルートフォルダに保存
      };

      // マルチパートリクエスト作成
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error(`アップロードエラー: ${response.status}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Google Driveアップロードエラー:', error);
      throw new Error('ファイルのアップロードに失敗しました');
    }
  }

  async createFolder(folderName: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['root'],
      };

      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`フォルダ作成エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Google Driveフォルダ作成エラー:', error);
      throw new Error('フォルダの作成に失敗しました');
    }
  }

  async getShareLink(fileId: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      // 共有権限設定
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });

      // 共有リンク取得
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`共有リンク取得エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.webViewLink;
    } catch (error) {
      console.error('Google Drive共有リンクエラー:', error);
      throw new Error('共有リンクの取得に失敗しました');
    }
  }
}

// Dropbox API統合
class DropboxProvider implements CloudStorageProvider {
  name = 'Dropbox';
  icon = '📦';
  isAuthenticated = false;
  private accessToken: string | null = null;

  async authenticate(): Promise<void> {
    try {
      // Dropbox API認証
      const clientId = process.env.DROPBOX_CLIENT_ID || '';
      const redirectUri = window.location.origin + '/auth/dropbox';
      
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      
      // 実際の実装では、OAuth2 フローを使用
      this.isAuthenticated = true;
      this.accessToken = 'mock_token';
    } catch (error) {
      console.error('Dropbox認証エラー:', error);
      throw new Error('Dropbox認証に失敗しました');
    }
  }

  async upload(file: File, filename: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: `/${filename}`,
            mode: 'add',
            autorename: true,
          }),
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`アップロードエラー: ${response.status}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Dropboxアップロードエラー:', error);
      throw new Error('ファイルのアップロードに失敗しました');
    }
  }

  async createFolder(folderName: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: `/${folderName}`,
          autorename: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`フォルダ作成エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.metadata.id;
    } catch (error) {
      console.error('Dropboxフォルダ作成エラー:', error);
      throw new Error('フォルダの作成に失敗しました');
    }
  }

  async getShareLink(fileId: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fileId,
          settings: {
            requested_visibility: 'public',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`共有リンク取得エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Dropbox共有リンクエラー:', error);
      throw new Error('共有リンクの取得に失敗しました');
    }
  }
}

// OneDrive API統合 (Microsoft Graph API)
class OneDriveProvider implements CloudStorageProvider {
  name = 'OneDrive';
  icon = '☁️';
  isAuthenticated = false;
  private accessToken: string | null = null;

  async authenticate(): Promise<void> {
    try {
      // Microsoft Graph API認証
      const clientId = process.env.MICROSOFT_CLIENT_ID || '';
      const redirectUri = window.location.origin + '/auth/microsoft';
      
      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://graph.microsoft.com/Files.ReadWrite`;
      
      // 実際の実装では、OAuth2 フローを使用
      this.isAuthenticated = true;
      this.accessToken = 'mock_token';
    } catch (error) {
      console.error('OneDrive認証エラー:', error);
      throw new Error('OneDrive認証に失敗しました');
    }
  }

  async upload(file: File, filename: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${filename}:/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`アップロードエラー: ${response.status}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('OneDriveアップロードエラー:', error);
      throw new Error('ファイルのアップロードに失敗しました');
    }
  }

  async createFolder(folderName: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          folder: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`フォルダ作成エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('OneDriveフォルダ作成エラー:', error);
      throw new Error('フォルダの作成に失敗しました');
    }
  }

  async getShareLink(fileId: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new Error('認証が必要です');
    }

    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'view',
          scope: 'anonymous',
        }),
      });

      if (!response.ok) {
        throw new Error(`共有リンク取得エラー: ${response.status}`);
      }

      const result = await response.json();
      return result.link.webUrl;
    } catch (error) {
      console.error('OneDrive共有リンクエラー:', error);
      throw new Error('共有リンクの取得に失敗しました');
    }
  }
}

// クラウドストレージマネージャー
export class CloudStorageManager {
  private providers: Map<string, CloudStorageProvider> = new Map();

  constructor() {
    this.providers.set('google', new GoogleDriveProvider());
    this.providers.set('dropbox', new DropboxProvider());
    this.providers.set('onedrive', new OneDriveProvider());
  }

  getProviders(): CloudStorageProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(providerId: string): CloudStorageProvider | undefined {
    return this.providers.get(providerId);
  }

  async uploadToProvider(
    providerId: string,
    file: File,
    filename: string,
    options?: { createFolder?: string }
  ): Promise<UploadResult> {
    try {
      const provider = this.getProvider(providerId);
      if (!provider) {
        return { success: false, error: 'プロバイダーが見つかりません' };
      }

      if (!provider.isAuthenticated) {
        await provider.authenticate();
      }

      let folderId: string | null = null;
      if (options?.createFolder) {
        folderId = await provider.createFolder(options.createFolder);
      }

      const fileId = await provider.upload(file, filename);
      const shareLink = await provider.getShareLink(fileId);

      return {
        success: true,
        fileId,
        shareLink,
      };
    } catch (error) {
      console.error('クラウドストレージアップロードエラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  async uploadProjectFiles(
    providerId: string,
    files: { file: File; filename: string }[],
    projectName: string
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const { file, filename } of files) {
      const result = await this.uploadToProvider(providerId, file, filename, {
        createFolder: projectName,
      });
      results.push(result);
    }

    return results;
  }
}

// シングルトンインスタンス
export const cloudStorageManager = new CloudStorageManager();

// React Hook用ユーティリティ
export const useCloudStorage = () => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadResults, setUploadResults] = React.useState<UploadResult[]>([]);

  const uploadFiles = async (
    providerId: string,
    files: { file: File; filename: string }[],
    projectName: string
  ) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadResults([]);

    try {
      const results = await cloudStorageManager.uploadProjectFiles(providerId, files, projectName);
      setUploadResults(results);
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadResults,
    uploadFiles,
  };
};

export default cloudStorageManager; 