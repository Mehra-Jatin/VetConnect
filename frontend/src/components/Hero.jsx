import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative h-screen flex flex-col items-start justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${('/hero.jpg')})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl sm:ml-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white w-2/3 text-orange-500 text-sm sm:text-base font-bold px-4 py-2 rounded-lg mb-4"
          >
            WELCOME TO VetConnect!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6"
          >
            Best Care of Our Little Friends
          </motion.h1>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-orange-400 hover:bg-orange-500 transition-colors duration-300 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-sm text-sm sm:text-base"
          >
            LEARN MORE
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
