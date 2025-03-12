import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  // State for theme preferences
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [reduceAnimations, setReduceAnimations] = useState(false);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemThemeEnabled = localStorage.getItem('systemTheme') === 'true';
    const savedFontSize = localStorage.getItem('fontSize');
    const savedAnimationPref = localStorage.getItem('reduceAnimations') === 'true';
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedAnimationPref !== null) setReduceAnimations(savedAnimationPref);
    
    if (systemThemeEnabled) {
      setUseSystemTheme(true);
      checkSystemTheme();
    } else if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      setUseSystemTheme(false);
    }
  }, []);

  // Function to check system theme preference
  const checkSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!useSystemTheme) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [useSystemTheme]);

  // Apply theme when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle dark mode toggle
  const handleThemeToggle = () => {
    if (useSystemTheme) {
      setUseSystemTheme(false);
      localStorage.setItem('systemTheme', 'false');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Handle system theme toggle
  const handleSystemThemeToggle = () => {
    const newValue = !useSystemTheme;
    setUseSystemTheme(newValue);
    localStorage.setItem('systemTheme', newValue.toString());
    
    if (newValue) {
      checkSystemTheme();
    }
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
  };

  // Handle animation toggle
  const handleAnimationsToggle = () => {
    const newValue = !reduceAnimations;
    setReduceAnimations(newValue);
    localStorage.setItem('reduceAnimations', newValue.toString());
  };

  return (
    <div className={`settings-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="settings-header">
        <button className="back-button">← Back</button>
        <h1>Settings</h1>
      </header>

      <div className="settings-card">
        <h2 className="settings-title">Display</h2>
        
        <div className="setting-item">
          <div>
            <div className="setting-label">Dark mode</div>
            <div className="setting-description">Switch between light and dark themes</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div>
            <div className="setting-label">Use system settings</div>
            <div className="setting-description">Automatically match your device theme</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={useSystemTheme}
              onChange={handleSystemThemeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="theme-preview">
          <div className="preview-box light-preview">Light</div>
          <div className="preview-box system-preview"></div>
          <div className="preview-box dark-preview">Dark</div>
        </div>
      </div>

      <div className="settings-card">
        <h2 className="settings-title">Other Display Settings</h2>
        
        <div className="setting-item">
          <div>
            <div className="setting-label">Font size</div>
            <div className="setting-description">Adjust text size throughout the app</div>
          </div>
          <select 
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
        
        <div className="setting-item">
          <div>
            <div className="setting-label">Reduce animations</div>
            <div className="setting-description">Minimize motion for accessibility</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={reduceAnimations}
              onChange={handleAnimationsToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <style jsx>{`
        /* CSS variables for theme colors */
        :root {
          --background-color: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
          --text-color: ${isDarkMode ? '#f0f0f0' : '#333333'};
          --card-background: ${isDarkMode ? '#2d2d2d' : '#f5f5f5'};
          --border-color: ${isDarkMode ? '#444444' : '#e0e0e0'};
          --highlight-color: ${isDarkMode ? '#4d8cff' : '#3366cc'};
          --switch-off-color: ${isDarkMode ? '#555555' : '#cccccc'};
          --switch-on-color: #4CAF50;
        }

        /* Base styles */
        .settings-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: var(--background-color);
          color: var(--text-color);
          transition: all 0.3s ease;
        }

        .settings-header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .back-button {
          background: none;
          border: none;
          color: var(--highlight-color);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-right: 20px;
        }

        h1 {
          margin: 0;
        }

        .settings-card {
          background-color: var(--card-background);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .settings-title {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-label {
          font-size: 16px;
        }

        .setting-description {
          font-size: 14px;
          color: var(--text-color);
          opacity: 0.7;
          margin-top: 4px;
        }

        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--switch-off-color);
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--switch-on-color);
        }

        input:checked + .slider:before {
          transform: translateX(30px);
        }

        select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background-color: var(--background-color);
          color: var(--text-color);
        }

        /* Theme Previews */
        .theme-preview {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .preview-box {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          margin: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .light-preview {
          background-color: #ffffff;
          color: #333333;
          border: 1px solid #e0e0e0;
        }

        .dark-preview {
          background-color: #1a1a1a;
          color: #f0f0f0;
          border: 1px solid #444444;
        }

        .system-preview {
          background: linear-gradient(to right, #ffffff 50%, #1a1a1a 50%);
          color: transparent;
          position: relative;
        }

        .system-preview::after {
          content: "System";
          position: absolute;
          background: linear-gradient(to right, #333333 50%, #f0f0f0 50%);
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;