import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Your Tawk.to Property and Widget IDs
    const propertyId = "688719215244f2192b55774c";
    const widgetId = "1j17rkbr7";
    
    // Check if Tawk.to is already loaded
    if (document.getElementById('tawk-script')) {
      console.log('Tawk.to script already exists');
      return;
    }

    // Initialize Tawk_API and Tawk_LoadStart
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Configure Tawk to render outside normal flow
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: 'br', // bottom-right
          xOffset: 20,
          yOffset: 20
        },
        mobile: {
          position: 'br',
          xOffset: 10,
          yOffset: 10
        }
      }
    };

    // Create and configure the script
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add event handlers
    script.onload = () => {
      console.log('Tawk.to chat widget loaded successfully');
      
      // Set up Tawk.to event listeners
      if (window.Tawk_API) {
        window.Tawk_API.onLoad = function() {
          console.log('Tawk.to widget is ready');
        };

        window.Tawk_API.onChatStarted = function() {
          console.log('Chat started');
        };
      }
    };

    script.onerror = () => {
      console.error('Failed to load Tawk.to chat widget');
    };

    // Append script to document head
    document.head.appendChild(script);

  }, []);

  return null; // This component doesn't render anything
};

export default TawkToChat;
