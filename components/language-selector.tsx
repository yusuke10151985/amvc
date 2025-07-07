import React, { useState, useEffect } from 'react';
import { SupportedLanguage, setLanguage, getCurrentLanguage, getTranslations } from '../i18n';

interface LanguageSelectorProps {
  onLanguageChange?: (language: SupportedLanguage) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  className = "" 
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);

  const languages: Array<{ code: SupportedLanguage; name: string; flag: string }> = [
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    onLanguageChange?.(langCode);
  };

  const currentLanguageInfo = languages.find(lang => lang.code === currentLang);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLanguageInfo?.flag}</span>
        <span className="text-gray-700 dark:text-gray-300">{currentLanguageInfo?.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* ドロップダウンメニュー */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentLang === language.code 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  {currentLang === language.code && (
                    <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector; 