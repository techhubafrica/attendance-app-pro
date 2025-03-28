import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { X } from "lucide-react";
import confetti from "canvas-confetti";

const BirthdayPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Check if today is user's birthday
    const checkBirthday = () => {
      if (!user?.dateOfBirth) return false;
      
      const today = new Date();
      const dob = new Date(user.dateOfBirth);
      
      return (
        today.getDate() === dob.getDate() &&
        today.getMonth() === dob.getMonth()
      );
    };
    
    const isBirthday = checkBirthday();
    
    if (isBirthday) {
      setIsVisible(true);
      
      // Trigger confetti animation
      const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          
          const particleCount = 50 * (timeLeft / duration);
          
          // Since particles fall down, start a bit higher than random
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
      };
      
      triggerConfetti();
    }
  }, [user]);
  
  const closePopup = () => {
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md p-8 overflow-hidden text-center bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={closePopup} 
          className="absolute p-2 text-gray-500 hover:text-gray-700 top-2 right-2"
        >
          <X size={20} />
        </button>
        
        <div className="py-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎂</span>
              </div>
            </div>
          </div>
          
          <h2 className="mb-2 text-3xl font-bold text-blue-800">
            Happy Birthday, {user?.name?.split(' ')[0] || "Friend"}!
          </h2>
          
          <p className="mb-6 text-lg text-gray-600">
            Wishing you a fantastic day filled with joy and celebration!
          </p>
          
          <div className="px-6 py-3 mx-auto font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer w-fit" onClick={closePopup}>
            Thank You!
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayPopup;