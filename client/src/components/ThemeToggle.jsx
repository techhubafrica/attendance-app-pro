import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { 
  Sun, 
  Moon, 
  Monitor 
} from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Theme icons and labels
  const themeOptions = {
    light: { 
      icon: Sun, 
      label: 'Light', 
      color: 'text-yellow-500 bg-yellow-100' 
    },
    dark: { 
      icon: Moon, 
      label: 'Dark', 
      color: 'text-indigo-500 bg-indigo-100' 
    },
    system: { 
      icon: Monitor, 
      label: 'System', 
      color: 'text-gray-500 bg-gray-100' 
    }
  };

  // Cycle through themes
  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    toggleTheme(themes[nextIndex]);
  };

  const currentTheme = themeOptions[theme] || themeOptions.light;
  const Icon = currentTheme.icon;

  return (
    <div className="relative items-center justify-center flex">
      <button 
        onClick={cycleTheme} 
        className={`
          flex items-center justify-center 
          p-2 rounded-full cursor-pointer 
          transition-all duration-300 ease-in-out
          hover:scale-110 active:scale-95
          ${currentTheme.color}
          shadow-md hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-blue-500
        `}
        aria-label={`Switch to ${currentTheme.label} mode`}
        title={`Current theme: ${currentTheme.label}. Click to cycle.`}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">Current theme: {currentTheme.label}</span>
      </button>

      {/* Theme name tooltip */}
      <div 
        className="
          absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2
          bg-black text-white text-xs 
          px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300
        "
      >
        {currentTheme.label} Mode
      </div>
    </div>
  );
};

export default ThemeToggle;