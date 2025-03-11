import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="absolute w-96 h-96 bg-purple-200/30 dark:bg-purple-700/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-200/30 dark:bg-blue-700/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 bg-[size:20px_20px] opacity-30" />

      {/* Content */}
      <div className="relative z-10 px-6 py-32 w-full max-w-2xl mx-auto">
        <motion.div
          className="text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error code with animated effect */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
          >
            <h1 className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              404
            </h1>
          </motion.div>

          <div className="space-y-4 mt-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Page Not Found
            </h2>

            <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Oops! The page you're looking for seems to have wandered off into
              the digital wilderness.
            </p>

            <motion.div
              className="relative mt-8 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r  bg-green-700 hover:bg-green-800  rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-all duration-300" />
              <Button
                size="lg"
                asChild
                className="relative bg-gradient-to-r text-sm font-medium text-white bg-green-700 hover:bg-green-800 border-0 px-6"
              >
                <Link to="/" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              Lost? Check our{" "}
              <Link
                to="/sitemap"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                sitemap
              </Link>{" "}
              or{" "}
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                contact support
              </Link>
              .
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
