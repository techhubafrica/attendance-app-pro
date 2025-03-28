import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CalendarCheck,
  CalendarClock,
  Home,
  BookOpen,
  BookMarked,
  MoveRight,
  UsersRound,
  Building2,
  MapPin,
  Bot,
  Clock,
  Library,
  HeartHandshake,
  School,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { logout } from "@/redux/slices/authSlice";
import BirthdayAvatar from "../BirthdayAvatar";

const ALL_NAV_ITEMS = [
  {
    name: "Attendance",
    path: "/admin/attendance",
    icon: CalendarCheck,
    role: "admin",
  },
  {
    name: "Employees",
    path: "/employees",
    icon: UsersRound,
    role: ["admin", "employee"],
  },
  {
    name: "Books",
    path: "/admin/books",
    icon: Library,
    role: "admin",
  },
  {
    name: "Companies",
    path: "/admin/companies",
    icon: Building2,
    role: "admin",
  },
  {
    name: "Departments",
    path: "/admin/departments",
    icon: School,
    role: "admin",
  },
  {
    name: "Regions",
    path: "/admin/regions",
    icon: MapPin,
    role: "admin",
  },
  {
    name: "Book Loans",
    path: "/book-loans",
    icon: BookMarked,
    role: ["admin", "faculty"],
  },
  {
    name: "Faculties",
    path: "/admin/faculties",
    icon: HeartHandshake,
    role: "admin",
  },
  {
    name: "Robotics",
    path: "/admin/robotics-labs",
    icon: Bot,
    role: "admin",
  },
  {
    name: "Appointments",
    path: "/admin/appointments",
    icon: Clock,
    role: ["admin", "faculty"],
  },
  {
    name: "My Attendance",
    path: "/employee-attendance",
    icon: CalendarCheck,
    role: "employee",
  },
  {
    name: "Company",
    path: "/companies",
    icon: CalendarCheck,
    role: "employee",
  },
  {
    name: "Faculty Attendance",
    path: "/faculty/department-attendance",
    icon: CalendarCheck,
    role: "faculty",
  },
  {
    name: "Appointment",
    path: "/appointments",
    icon: CalendarClock,
    role: ["student", "teacher", "faculty"],
  },
  {
    name: "Books",
    path: "/books",
    icon: BookOpen,
    role: ["student", "faculty", "teacher"],
  },
  {
    name: "Borrowed Books",
    path: "/my-books",
    icon: BookMarked,
    role: ["student", "faculty", "teacher"],
  },
];
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Check if it's the user's birthday
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    // Check if today is user's birthday
    const checkBirthday = () => {
      if (!user?.dateOfBirth) return false;

      const today = new Date();
      const dob = new Date(user.dateOfBirth);

      return (
        today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()
      );
    };

    setIsBirthday(checkBirthday());
  }, [user]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => {
    if (item.role) {
      return Array.isArray(item.role)
        ? item.role.includes(user?.role || "")
        : user?.role === item.role;
    }
    return true;
  });

  // Split NAV_ITEMS into two parts based on screen size
  const [visibleNavItems, dropdownNavItems] = (() => {
    const isTablet = window.innerWidth < 1024; // Adjust breakpoint as needed
    const splitIndex = isTablet ? 6 : 7; // 6 for tablet, 7 for desktop
    return [
      NAV_ITEMS.slice(0, splitIndex), // Visible items
      NAV_ITEMS.slice(splitIndex), // Items in dropdown
    ];
  })();

  const handleLogout = async () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/login");
        window.location.reload();
      });
  };

  const isActivePath = (path) => location.pathname === path;

  const handleMobileNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ name, path, icon: Icon, isMobile }) => (
    <Button
      variant="ghost"
      onClick={() => (isMobile ? handleMobileNavigation(path) : navigate(path))}
      className={`flex items-center cursor-pointer ${
        isMobile ? "w-full justify-start" : "px-3 py-2"
      } text-sm font-medium transition-all duration-200 ease-in-out ${
        isActivePath(path)
          ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
      aria-label={`Navigate to ${name}`}
    >
      <Icon className={`${isMobile ? "w-5 h-5 mr-2" : "w-4 h-4 mr-2"}`} />
      {name}
    </Button>
  );

  // For birthday celebration in dropdown
  const BirthdayLabel = () => {
    if (!isBirthday) return null;

    return (
      <div className="flex items-center justify-center mt-2 mb-1">
        <div className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
          🎉 Happy Birthday! 🎂
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-10 w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link to="/">
                <img
                  className="w-auto h-8 transition-transform duration-200 hover:scale-105 cursor-pointer"
                  src="/tech-hub.svg"
                  alt="Logo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/32";
                  }}
                />
              </Link>
            </div>
            {/* {isAuthenticated && user?.isAccountVerified && ( */}
            {user?.isAccountVerified && (
              <div className="hidden py-3 sm:ml-4 sm:flex sm:items-center sm:space-x-1 sm:overflow-x-auto">
                {/* Render visible nav items */}
                {visibleNavItems.map((item) => (
                  <NavItem key={item.path} {...item} isMobile={false} />
                ))}

                {/* Render dropdown for remaining items */}
                {dropdownNavItems.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      >
                        More
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {dropdownNavItems.map((item) => (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className="cursor-pointer"
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>

          <div className="hidden space-x-2 sm:ml-2 sm:flex sm:items-center">
            {/* Conditional rendering for Login/Logout */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="User menu"
                  >
                    <BirthdayAvatar user={user} className="w-8 h-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-gray-700 capitalize">
                        Role: {user?.role}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  {/* Add birthday message in dropdown if it's user's birthday */}
                  <BirthdayLabel />
                  <DropdownMenuSeparator />
                  {/* {!isLoading && user?.isAccountVerified && ( */}
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  {/* )} */}

                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className={"cursor-pointer"}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="rounded-md px-4 py-2 cursor-pointer"
              >
                Login
                <MoveRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-700"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="block w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="block w-6 h-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - remains unchanged */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user?.isAccountVerified &&
              NAV_ITEMS.map((item) => (
                <NavItem key={item.path} {...item} isMobile={true} />
              ))}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    {/* Replace mobile avatar with birthday-aware avatar */}
                    <BirthdayAvatar user={user} />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.name}
                    </div>
                    <p className="text-xs leading-none text-gray-700 capitalize">
                      Role: {user?.role}
                    </p>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                  {/* Add birthday badge on mobile */}
                  {isBirthday && (
                    <div className="ml-auto">
                      <div className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                        🎂 Birthday!
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-2 mt-3 space-y-1">
                  {/* {!isLoading && user?.isAccountVerified && ( */}
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => handleMobileNavigation("/profile")}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                  {/* )} */}

                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => handleMobileNavigation("/settings")}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-2 mt-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="rounded-md px-4 py-2 w-full"
                >
                  Login
                  <MoveRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
