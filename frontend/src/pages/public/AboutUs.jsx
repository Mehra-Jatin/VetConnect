import React from "react";
import {
  AlarmClock,
  Pill,
  Stethoscope,
  FolderHeart,
  FileHeart,
} from "lucide-react"; // ✅ all of these exist

import { motion } from "framer-motion";

const features = [
  {
    icon: <AlarmClock size={36} className="text-orange-500" />,
    title: "Book vet appointments 24/7",
  },
  {
    icon: <Pill size={36} className="text-orange-500" />,
    title: "Online prescriptions and refills",
  },
  {
    icon: <Stethoscope size={36} className="text-orange-500" />,
    title: "Diagnostic testing",
  },
  {
    icon: <FolderHeart size={36} className="text-orange-500" />,
    title: "Digital health history",
  },
  {
    icon: <FileHeart size={36} className="text-orange-500" />,
    title: "Custom treatment plans",
  },
];

function AboutUs() {
  return (
    <section className="bg-white py-12 px-4 md:px-10">
      {/* About Us Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Animated Image */}
        <motion.img
          src="/vet.jpg"
          alt="VetConnect illustration"
          className="w-full h-auto rounded-lg shadow-lg"
           initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 , delay: 0.2}}
        />

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-orange-700 mb-4">
            About VetConnect
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            VetConnect is dedicated to providing modern healthcare solutions for
            pet parents. From 24/7 online appointments to custom treatment plans
            and digital records, we make pet care simple, smart, and accessible.
            With our platform, you can book consultations, manage prescriptions,
            and track your pet’s health from anywhere.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600">
            Modern solutions for modern pet parents
          </h2>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center mb-20">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2">
              {feature.icon}
              <p className="text-lg font-medium text-gray-700">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
