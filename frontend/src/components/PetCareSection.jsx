import { useState } from 'react';

const PetCareSection = () => {

  return (

      <section className="py-16 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-16">
        {/* Left Side - Image  */}

        <div className="relative bg-white w-full md:w-2/4 h-auto md:h-[400px] lg:h-[500px] flex items-center justify-center ">
          <img src={'/dog.png'} alt="Pug" className="w-3/4 h-auto md:w-64 lg:w-80" />
        </div>


      {/* Right Side - Text and Features */}
      <div className="text-left md:text-left md:w-2/4 md:mx-[10%]">
        <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mt-2">
          We Love to Take Care of Your Pets
        </h2>
        <p className="text-gray-600 mt-4 text-sm md:text-base lg:text-lg">
       At VetConnect, we are committed to providing pet owners with convenient, reliable, and high-quality veterinary care through telemedicine. Our platform connects you with licensed veterinarians who are passionate about your pet's health and well-being, offering professional consultations from the comfort of your home.  </p>
        
        {/* Feature List */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <Feature title="Skilled Personal" />
          <Feature title="Pets Care 24/7" />
          <Feature title="Best Veterinarians" />
          <Feature title="Pet care tips & advice" />
        </div>
      </div>
    </section>
  
  );
};

const Feature = ({ title }) => (
  <div className="flex items-center space-x-2">
    <div className="bg-orange-500 text-white rounded-md p-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-gray-700 font-semibold">{title}</span>
  </div>
);

export default PetCareSection;
