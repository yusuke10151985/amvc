import React, { useState } from 'react';
import { cloudStorageManager, UploadResult } from '../cloud-storage';
import { Button } from './ui';

interface CloudStorageUploadProps {
  files: { file: File; filename: string }[];
  projectName?: string;
  onUploadComplete?: (results: UploadResult[]) => void;
  className?: string;
}

const CloudStorageUpload: React.FC<CloudStorageUploadProps> = ({
  files,
  projectName = 'Music Video Project',
  onUploadComplete,
  className = ''
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const providers = cloudStorageManager.getProviders();

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleUpload = async () => {
    if (!selectedProvider) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResults([]);
    setShowResults(false);

    try {
      const results = await cloudStorageManager.uploadProjectFiles(
        selectedProvider,
        files,
        projectName
      );
      
      setUploadResults(results);
      setShowResults(true);
      onUploadComplete?.(results);
    } catch (error) {
      console.error('アップロードエラー:', error);
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return '📁';
      case 'dropbox':
        return '📦';
      case 'onedrive':
        return '☁️';
      default:
        return '💾';
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google Drive';
      case 'dropbox':
        return 'Dropbox';
      case 'onedrive':
        return 'OneDrive';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          🚀 クラウドストレージに保存
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          プロジェクトファイルを選択したクラウドストレージに保存します
        </p>
      </div>

      {/* プロバイダー選択 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider, index) => {
          const providerId = ['google', 'dropbox', 'onedrive'][index];
          const isSelected = selectedProvider === providerId;
          
          return (
            <button
              key={providerId}
              onClick={() => handleProviderSelect(providerId)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{getProviderIcon(providerId)}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getProviderName(providerId)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {provider.isAuthenticated ? '✅ 認証済み' : '🔐 認証が必要'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* アップロード設定 */}
      {selectedProvider && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            📋 アップロード設定
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                プロジェクト名
              </label>
              <input
                type="text"
                value={projectName}
                readOnly
                className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                アップロードファイル ({files.length}個)
              </label>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>📄</span>
                    <span>{file.filename}</span>
                    <span className="text-gray-400">
                      ({(file.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アップロードボタン */}
      {selectedProvider && (
        <div className="text-center">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full md:w-auto"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                アップロード中...
              </span>
            ) : (
              `${getProviderName(selectedProvider)}にアップロード`
            )}
          </Button>
        </div>
      )}

      {/* アップロード進行状況 */}
      {uploading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              アップロード進行状況
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* アップロード結果 */}
      {showResults && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-3">
            ✅ アップロード完了
          </h4>
          
          <div className="space-y-2">
            {uploadResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-green-800 dark:text-green-200">
                  {files[index]?.filename}
                </span>
                {result.success ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✅ 成功
                    </span>
                    {result.shareLink && (
                      <a
                        href={result.shareLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        共有リンク
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    ❌ エラー: {result.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudStorageUpload; 