import React, { useState } from "react";
import { Globe, Monitor, User, CheckCircle } from "lucide-react";

interface SetupScreenProps {
  onSetupComplete: (config: { language: string; username: string }) => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [username, setUsername] = useState('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const steps = [
    {
      title: "Welcome to ElementaryOS",
      subtitle: "Choose your language",
      icon: Globe
    },
    {
      title: "Setup User Account",
      subtitle: "Create your username",
      icon: User
    },
    {
      title: "Setup Complete",
      subtitle: "Ready to start",
      icon: CheckCircle
    }
  ];

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setTimeout(() => setCurrentStep(1), 500);
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setCurrentStep(2);
      setTimeout(() => {
        onSetupComplete({ language: selectedLanguage, username: username.trim() });
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep === 1) {
      handleUsernameSubmit();
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {React.createElement(steps[currentStep].icon, { 
              className: "w-8 h-8 text-white" 
            })}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-white/80">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {currentStep === 0 && (
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200 flex items-center gap-3 text-white hover:scale-105"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
            </div>
            <button
              onClick={handleUsernameSubmit}
              disabled={!username.trim()}
              className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 rounded-lg text-white font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/80 mb-4">
              Welcome, {username}! Your system is ready.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index <= currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;