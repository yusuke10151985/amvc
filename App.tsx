
import React, { useState, useEffect } from 'react';
import { STEPS, SunIcon, MoonIcon, LogoIcon } from './constants';
import { Language } from './types';
import type { ProjectData } from './types';
import { Step1, Step2, Step3, Step4, Step5, Step6, Step7 } from './components/steps';
import { Button } from './components/ui';
import LanguageSelector from './components/language-selector';
import { initializeI18n, t, getCurrentLanguage, SupportedLanguage } from './i18n';

const initialData: ProjectData = {
  language: Language.EN,
  keywords: 'synthwave, cosmic drift, female vocals',
  duration: 120,
  generatedJson: '',
  audioFile: null,
  lyricsFile: null,
  srtContent: '',
  subtitles: [],
  videoPrompts: [],
  videoProgress: 0,
};

const Header: React.FC<{ theme: string; toggleTheme: () => void; onLanguageChange: () => void }> = ({ theme, toggleTheme, onLanguageChange }) => (
  <header className="py-4 px-4 md:px-8 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <LogoIcon className="w-8 h-8 text-primary-500" />
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('appTitle')}</h1>
    </div>
    <div className="flex items-center gap-3">
      <LanguageSelector onLanguageChange={onLanguageChange} />
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>
    </div>
  </header>
);

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <nav aria-label="Progress">
    <ol role="list" className="flex items-center">
      {STEPS.map((step, stepIdx) => (
        <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
          {step.id < currentStep ? (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-primary-600" />
              </div>
              <span className="relative flex h-8 w-8 items-center justify-center bg-primary-600 rounded-full hover:bg-primary-900">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                </svg>
              </span>
            </>
          ) : step.id === currentStep ? (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <span className="relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-primary-600 rounded-full" aria-current="step">
                <span className="h-2.5 w-2.5 bg-primary-600 rounded-full" aria-hidden="true" />
              </span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <span className="group relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400">
                <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
              </span>
            </>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());

  useEffect(() => {
    // i18n初期化
    initializeI18n();
    setCurrentLanguage(getCurrentLanguage());
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLanguageChange = () => {
    setCurrentLanguage(getCurrentLanguage());
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleRestart = () => {
      setProjectData(initialData);
      setCurrentStep(1);
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 2: return <Step2 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 3: return <Step3 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 4: return <Step4 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 5: return <Step5 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 6: return <Step6 data={projectData} setData={setProjectData} onNext={handleNext} />;
      case 7: return <Step7 onRestart={handleRestart} />;
      default: return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} onLanguageChange={handleLanguageChange} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 overflow-x-auto pb-4">
          <Stepper currentStep={currentStep} />
        </div>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{`${t('steps.step' + currentStep)}: ${t(`steps.step${currentStep}`)}`}</h2>
        </div>

        {renderStep()}

        {currentStep > 1 && currentStep < STEPS.length && (
            <div className="mt-8 flex justify-start">
                <Button variant="secondary" onClick={handleBack}>{t('common.back')}</Button>
            </div>
        )}
      </main>
      <footer className="text-center py-6 text-xs text-gray-500 dark:text-gray-400">
          <p>AI Music Video Generator UI Draft. All content is for demonstration purposes only.</p>
          <p>&copy; 2024. Credits to GPT-4o, Runway, SUNO AI, and other AI toolmakers.</p>
      </footer>
    </div>
  );
}
