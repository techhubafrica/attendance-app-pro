import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

const Layout = () => {
  useEffect(() => {
    // Smooth scroll to top when the route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="animate-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;