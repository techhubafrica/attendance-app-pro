import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const BirthdayAvatar = ({ user, className = "" }) => {
  const [isBirthday, setIsBirthday] = useState(false);
  
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
    
    setIsBirthday(checkBirthday());
  }, [user]);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isBirthday) {
    // Regular avatar when it's not the user's birthday
    return (
      <Avatar className={`${className} cursor-pointer`}>
        <AvatarImage
          src={user?.avatar}
          alt={user?.name}
          className="object-cover"
        />
        <AvatarFallback className="text-indigo-600 bg-indigo-100">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Special birthday avatar with balloon animations
  return (
    <div className="relative">
      {/* Floating balloons */}
      <div className="absolute -top-5 -left-6 pointer-events-none">
        <motion.div
          className="absolute"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <span className="text-2xl">🎈</span>
        </motion.div>
      </div>
      
      <div className="absolute -top-4 left-2 pointer-events-none">
        <motion.div
          className="absolute"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        >
          <span className="text-xl">🎈</span>
        </motion.div>
      </div>
      
      <div className="absolute -top-4 -right-2 pointer-events-none">
        <motion.div
          className="absolute"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.3
          }}
        >
          <span className="text-lg">🎈</span>
        </motion.div>
      </div>
      
      {/* Birthday cake indicator */}
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm z-10">
        <motion.div
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity
          }}
          className="text-sm"
        >
          🎂
        </motion.div>
      </div>
      
      {/* Avatar with pulsing animation */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 0 0px rgba(124, 58, 237, 0.4)",
            "0 0 0 4px rgba(124, 58, 237, 0)",
            "0 0 0 0px rgba(124, 58, 237, 0.4)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      >
        <Avatar className={`${className} ring-2 ring-purple-400 cursor-pointer`}>
          <AvatarImage
            src={user?.avatar}
            alt={user?.name}
            className="object-cover"
          />
          <AvatarFallback className="text-indigo-600 bg-indigo-100">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </motion.div>
    </div>
  );
};

export default BirthdayAvatar;