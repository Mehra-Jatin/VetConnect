import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function BenefitSection() {
 const benefits = [
  {
    title: '24/7 Virtual Vet Access',
    description: 'Connect with licensed veterinarians anytime, anywhere, from the comfort of your home.',
  },
  {
    title: 'Digital Health Records',
    description: 'Easily access, track, and manage your pet’s medical history and prescriptions online.',
  },
  {
    title: 'Affordable & Transparent Pricing',
    description: 'No hidden fees. Pay per consultation or choose flexible subscription plans.',
  },
  {
    title: 'Specialist Consultations',
    description: 'Get expert advice from veterinary specialists without long wait times or travel.',
  },
];
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:justify-evenly bg-gray-100 p-8 md:p-16 gap-10 font-sans">
      {/* Left Section */}
      <div className="md:w-2/3 lg:w-1/2">
        <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
          BENEFITS
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-snug">
          Why Choose Our Pet Care Company?
        </h2>

        {/* Accordion Section */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-md shadow-sm overflow-hidden transition-all duration-300 border border-gray-100"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-6 py-4 font-medium text-gray-900 flex items-center justify-between hover:bg-orange-50 transition-all"
                >
                  <span>{benefit.title}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 pb-4 text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  {benefit.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="md:w-1/3 hidden md:flex justify-center items-center">
        <img
          src={'/catshocked.png'}
          alt="Pet cat"
          className="w-full max-w-xs lg:max-w-sm object-contain"
        />
      </div>
    </section>
  );
}

export default BenefitSection;
