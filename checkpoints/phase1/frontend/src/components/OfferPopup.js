import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPercent, FaGift, FaClock } from 'react-icons/fa';

const OfferPopup = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Fetch active popup offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/offers');
        const data = await response.json();
        
        if (data.success && data.data.offers) {
          const popupOffers = data.data.offers.filter(offer => 
            offer.isActive && 
            offer.showAsPopup &&
            new Date() >= new Date(offer.startDate) &&
            new Date() <= new Date(offer.endDate)
          );
          
          if (popupOffers.length > 0) {
            // Sort by priority (higher number = higher priority)
            const sortedOffers = popupOffers.sort((a, b) => b.priority - a.priority);
            setCurrentOffer(sortedOffers[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  // Check if offer should be displayed based on display rules
  useEffect(() => {
    if (!currentOffer || hasBeenShown) return;

    const offerId = currentOffer.id;
    const storageKey = `offer_${offerId}_shown`;
    const maxDisplays = currentOffer.maxDisplaysPerUser;
    
    // Check local storage for display count
    const displayCount = parseInt(localStorage.getItem(storageKey) || '0');
    
    if (displayCount >= maxDisplays) {
      return; // Already shown max times
    }

    const showPopup = () => {
      setIsVisible(true);
      setHasBeenShown(true);
      
      // Update display count
      localStorage.setItem(storageKey, (displayCount + 1).toString());
    };

    // Handle different display types
    switch (currentOffer.popupDisplayType) {
      case 'immediate':
        setTimeout(showPopup, 1000); // Small delay for better UX
        break;
      
      case 'time_delay':
        setTimeout(showPopup, (currentOffer.popupDelay || 5) * 1000);
        break;
      
      case 'scroll_percentage':
        const handleScroll = () => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent >= (currentOffer.scrollPercentage || 50)) {
            showPopup();
            window.removeEventListener('scroll', handleScroll);
          }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      
      case 'exit_intent':
        const handleMouseLeave = (e) => {
          if (e.clientY <= 0) {
            showPopup();
            document.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
      
      default:
        setTimeout(showPopup, 2000);
    }
  }, [currentOffer, hasBeenShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    // Handle offer claim logic here
    console.log('Offer claimed:', currentOffer);
    
    // Could redirect to booking page or show claim form
    if (currentOffer.promoCode) {
      // Copy promo code to clipboard
      navigator.clipboard.writeText(currentOffer.promoCode);
      alert(`Promo code "${currentOffer.promoCode}" copied to clipboard!`);
    }
    
    setIsVisible(false);
  };

  if (!currentOffer || !isVisible) return null;

  const getDiscountIcon = () => {
    switch (currentOffer.discountType) {
      case 'percentage':
        return <FaPercent className="w-6 h-6" />;
      case 'buy_one_get_one':
        return <FaGift className="w-6 h-6" />;
      case 'free_service':
        return <FaGift className="w-6 h-6" />;
      default:
        return <FaPercent className="w-6 h-6" />;
    }
  };

  const getDiscountText = () => {
    switch (currentOffer.discountType) {
      case 'percentage':
        return `${currentOffer.discountValue}% OFF`;
      case 'fixed_amount':
        return `Rs. ${currentOffer.discountValue} OFF`;
      case 'buy_one_get_one':
        return 'BOGO DEAL';
      case 'free_service':
        return 'FREE SERVICE';
      default:
        return 'SPECIAL OFFER';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="relative w-full max-w-md mx-auto"
            style={{
              backgroundColor: currentOffer.backgroundColor || '#ffffff',
              color: currentOffer.textColor || '#1e293b'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              {/* Header with close button */}
              <div className="relative p-6 text-center">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 flex items-center justify-center"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
                
                {/* Discount Badge */}
                <div className="inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold mb-4">
                  {getDiscountIcon()}
                  <span>{getDiscountText()}</span>
                </div>
                
                {/* Offer Title */}
                <h2 className="text-2xl font-bold mb-2">{currentOffer.title}</h2>
                
                {/* Offer Description */}
                {currentOffer.description && (
                  <p className="text-lg opacity-90 mb-4">{currentOffer.description}</p>
                )}
                
                {/* Images */}
                {currentOffer.images && currentOffer.images.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={currentOffer.images[0]}
                      alt={currentOffer.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Promo Code */}
                {currentOffer.promoCode && (
                  <div className="bg-gray-100 bg-opacity-50 rounded-lg p-3 mb-4">
                    <p className="text-sm opacity-80 mb-1">Use Promo Code:</p>
                    <p className="font-mono font-bold text-lg tracking-wider">
                      {currentOffer.promoCode}
                    </p>
                  </div>
                )}
                
                {/* Terms */}
                {currentOffer.terms && (
                  <p className="text-xs opacity-70 mb-4">{currentOffer.terms}</p>
                )}
                
                {/* CTA Button */}
                <button
                  onClick={handleClaim}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: currentOffer.buttonColor || '#f97316',
                    color: '#ffffff'
                  }}
                >
                  {currentOffer.buttonText || 'Claim Offer'}
                </button>
                
                {/* Urgency indicator */}
                <div className="flex items-center justify-center space-x-2 mt-3 text-sm opacity-80">
                  <FaClock className="w-4 h-4" />
                  <span>Limited time offer!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;
