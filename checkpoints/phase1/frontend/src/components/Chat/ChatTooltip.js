import React, { useState, useEffect } from 'react';

const ChatTooltip = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Set up Tawk.to event listeners when component mounts
    const setupTawkEvents = () => {
      if (window.Tawk_API) {
        // Hide tooltip when chat is maximized
        window.Tawk_API.onChatMaximized = function() {
          setIsHidden(true);
        };
        
        // Show tooltip when chat is minimized
        window.Tawk_API.onChatMinimized = function() {
          setIsHidden(false);
        };
        
        // Hide tooltip permanently after user starts chatting
        window.Tawk_API.onChatStarted = function() {
          setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        };
      }
    };

    // Wait for Tawk.to to load before setting up events
    const checkTawkLoaded = setInterval(() => {
      if (window.Tawk_API && window.Tawk_API.onLoad) {
        setupTawkEvents();
        clearInterval(checkTawkLoaded);
      }
    }, 500);

    // Auto-fade tooltip after 10 seconds
    const fadeTimer = setTimeout(() => {
      setIsHidden(true);
    }, 10000);

    // Auto-hide tooltip after 30 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 30000);

    // Cleanup
    return () => {
      clearInterval(checkTawkLoaded);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleTooltipClick = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`chat-tooltip ${isHidden ? 'hidden' : ''}`}
      onClick={handleTooltipClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '25px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '25px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 9998,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div className="chat-icon" style={{
        width: '24px',
        height: '24px',
        background: 'linear-gradient(135deg, #ff0080 0%, #ff4040 25%, #ff8000 50%, #ffff00 75%, #00ff80 100%)',
        borderRadius: '12px',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '4px',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '6px solid #00ff80',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '2px',
          boxShadow: '-3px 0 rgba(255, 255, 255, 0.9), 0 0 rgba(255, 255, 255, 0.9), 3px 0 rgba(255, 255, 255, 0.9)',
        }} />
      </div>
      Let's Talk!
      <div 
        style={{
          position: 'absolute',
          bottom: '-8px',
          right: '20px',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #764ba2',
        }}
      />
    </div>
  );
};

export default ChatTooltip;
