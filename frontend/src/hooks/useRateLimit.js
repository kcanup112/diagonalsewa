import { useState, useCallback, useRef } from 'react';

// Frontend rate limiting hook
export const useRateLimit = (maxAttempts = 3, timeWindow = 60000) => {
  const [attempts, setAttempts] = useState(0);
  const [isLimited, setIsLimited] = useState(false);
  const [nextAllowedTime, setNextAllowedTime] = useState(null);
  const timeoutRef = useRef(null);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const storageKey = 'booking_attempts';
    const phoneStorageKey = 'booking_phone_attempts';
    
    try {
      // Check IP-based attempts (using localStorage as proxy)
      const storedAttempts = localStorage.getItem(storageKey);
      const attemptsData = storedAttempts ? JSON.parse(storedAttempts) : { count: 0, firstAttempt: now };
      
      // Reset if time window has passed
      if (now - attemptsData.firstAttempt > timeWindow) {
        attemptsData.count = 0;
        attemptsData.firstAttempt = now;
      }
      
      if (attemptsData.count >= maxAttempts) {
        const remainingTime = timeWindow - (now - attemptsData.firstAttempt);
        if (remainingTime > 0) {
          setIsLimited(true);
          setNextAllowedTime(new Date(now + remainingTime));
          
          // Clear the limitation after the remaining time
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsLimited(false);
            setNextAllowedTime(null);
            setAttempts(0);
          }, remainingTime);
          
          return false; // Rate limited
        }
      }
      
      return true; // Not rate limited
    } catch (error) {
      console.warn('Rate limiting check failed:', error);
      return true; // Allow request if check fails
    }
  }, [maxAttempts, timeWindow]);

  const recordAttempt = useCallback((phone = null) => {
    const now = Date.now();
    const storageKey = 'booking_attempts';
    
    try {
      // Record IP-based attempt
      const storedAttempts = localStorage.getItem(storageKey);
      const attemptsData = storedAttempts ? JSON.parse(storedAttempts) : { count: 0, firstAttempt: now };
      
      // Reset if time window has passed
      if (now - attemptsData.firstAttempt > timeWindow) {
        attemptsData.count = 1;
        attemptsData.firstAttempt = now;
      } else {
        attemptsData.count++;
      }
      
      localStorage.setItem(storageKey, JSON.stringify(attemptsData));
      setAttempts(attemptsData.count);
      
      // Record phone-based attempt if phone provided
      if (phone) {
        const phoneStorageKey = `booking_phone_${phone}`;
        const phoneAttemptsData = { count: 1, firstAttempt: now };
        const storedPhoneAttempts = localStorage.getItem(phoneStorageKey);
        
        if (storedPhoneAttempts) {
          const phoneData = JSON.parse(storedPhoneAttempts);
          // 24 hour window for phone attempts
          if (now - phoneData.firstAttempt < 24 * 60 * 60 * 1000) {
            phoneData.count++;
          } else {
            phoneData.count = 1;
            phoneData.firstAttempt = now;
          }
          localStorage.setItem(phoneStorageKey, JSON.stringify(phoneData));
        } else {
          localStorage.setItem(phoneStorageKey, JSON.stringify(phoneAttemptsData));
        }
      }
    } catch (error) {
      console.warn('Failed to record attempt:', error);
    }
  }, [timeWindow]);

  const checkPhoneLimit = useCallback((phone) => {
    if (!phone) return true;
    
    try {
      const phoneStorageKey = `booking_phone_${phone}`;
      const storedPhoneAttempts = localStorage.getItem(phoneStorageKey);
      
      if (storedPhoneAttempts) {
        const phoneData = JSON.parse(storedPhoneAttempts);
        const now = Date.now();
        
        // Check if within 24 hour window and exceeded limit
        if (now - phoneData.firstAttempt < 24 * 60 * 60 * 1000 && phoneData.count >= 2) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Phone limit check failed:', error);
      return true;
    }
  }, []);

  const getRemainingTime = useCallback(() => {
    if (!nextAllowedTime) return 0;
    return Math.max(0, nextAllowedTime.getTime() - Date.now());
  }, [nextAllowedTime]);

  const reset = useCallback(() => {
    setAttempts(0);
    setIsLimited(false);
    setNextAllowedTime(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    localStorage.removeItem('booking_attempts');
  }, []);

  return {
    attempts,
    isLimited,
    nextAllowedTime,
    checkRateLimit,
    recordAttempt,
    checkPhoneLimit,
    getRemainingTime,
    reset
  };
};
