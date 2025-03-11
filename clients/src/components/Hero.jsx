import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Users,
  Calendar,
  BookOpen,
  UserCircle,
  Clock,
  University,
  BarChart,
} from "lucide-react";
import { useAppSelector } from "@/hooks/reduxHooks";

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <div
      className="p-6 transition-all duration-300 transform bg-white rounded-lg shadow-lg opacity-0 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const UserWelcomeCard = ({ user }) => {
    // Guard clause to prevent accessing properties of null
    if (!user) {
      return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate-pulse">
          <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-8 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-8 bg-gray-200 rounded-md"></div>
        </div>
      );
    }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // const getRoleBasedAction = (role) => {
  //   switch (role.toLowerCase()) {
  //     case "admin":
  //       return {
  //         text: "View Dashboard",
  //         icon: <BarChart className="w-4 h-4 ml-2" />,
  //         path: "/admin/dashboard",
  //       };
  //     case "teacher":
  //       return {
  //         text: "Manage Classes",
  //         icon: <BookOpen className="w-4 h-4 ml-2" />,
  //         path: "/classes",
  //       };
  //     case "student":
  //       return {
  //         text: "Student Dashboard",
  //         icon: <Calendar className="w-4 h-4 ml-2" />,
  //         path: "/student/dashboard ",
  //       };
  //     case "employee":
  //       return {
  //         text: "Employee Dashboard",
  //         icon: <Users className="w-4 h-4 ml-2" />,
  //         path: "/employee/dashboard",
  //       };
  //     case "faculty":
  //       return {
  //         text: "Faculty Dashboard",
  //         icon: <University className="w-4 h-4 ml-2" />,
  //         path: "/faculty/dashboard",
  //       };
  //     default:
  //       return {
  //         text: "Go to Profile",
  //         icon: <UserCircle className="w-4 h-4 ml-2" />,
  //         path: "/profile",
  //       };
  //   }
  // };

  // const roleAction = getRoleBasedAction(user.role);

  const getRandomGreeting = () => {
    const greetings = ["👋", "✨", "🎉", "🚀", "💼", "📊"];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="p-3 mr-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
          <UserCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
          {getTimeBasedGreeting()}, {user.name} {getRandomGreeting()}
          </h2>
          <p className="text-gray-600">
            Welcome back to your  {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </p>
        </div>
      </div>

      <div className="p-4 mb-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          <p className="text-sm text-blue-700">
          Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <Button
          className="p-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 w-[50%]"
          asChild
        >
          <Link to="/profile" className="flex items-center justify-center">
            View Profile <UserCircle className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {/* <Button
          className="p-2 text-sm font-medium bg-green-600 hover:bg-green-700"
          asChild
        >
          <Link
            to={roleAction.path}
            className="flex items-center justify-center"
          >
            {roleAction.text} {roleAction.icon}
          </Link>
        </Button> */}
      </div>

      <div className="text-sm text-center text-gray-500">
        <p>You have access to all {user.role} features</p>
      </div>
    </div>
  );
};

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
    // Add a small delay to simulate auth state loading
    // In a real app, you might want to check when the auth state is actually ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl px-4 py-16 mx-auto">
        <div className="flex flex-col items-center justify-center mb-16 text-center mt-10">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Smart Attendance Management
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Streamline your organization's attendance, appointments, and
            resources with our all-in-one solution.
          </p>
        </div>

        <div
          className={`flex justify-center w-full transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {isLoading ? (
            // Loading state placeholder
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg animate-pulse">
              <div className="h-24 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-8 bg-gray-200 rounded-md"></div>
            </div>
          ) : isAuthenticated && user ? (
            <UserWelcomeCard user={user} />
          ) : (
            <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="relative px-8 py-6 overflow-hidden transition-all duration-300 group text-sm font-medium text-white bg-green-700 hover:bg-green-800 cursor-pointer">
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 transition-transform transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 transition-opacity bg-white opacity-0 group-hover:opacity-20" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-8 py-6 transition-all duration-300 border-2 hover:bg-gray-50 cursor-pointer"
                >
                  Login to Account
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid gap-6 mt-16 md:grid-cols-3">
          <FeatureCard
            icon={Users}
            title="Employee Attendance"
            description="Effortlessly track employee check-ins, breaks, and schedules"
            delay={800}
          />
          <FeatureCard
            icon={Calendar}
            title="Smart Scheduling"
            description="Book lab appointments and manage visitor access seamlessly"
            delay={1000}
          />
          <FeatureCard
            icon={BookOpen}
            title="Library Management"
            description="Manage and track library resources with ease"
            delay={1200}
          />
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .animate-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Hero;
