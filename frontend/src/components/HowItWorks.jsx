import { Calendar, Video, Pill } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: <Calendar className="w-8 h-8 text-orange-600" />,
    title: "Book a Virtual Vet Visit",
    description: "Schedule an online veterinarian consultation with a licensed professional in just a few clicks."
  },
  {
    number: 2,
    icon: <Video className="w-8 h-8 text-orange-600" />,
    title: "Join Your Appointment",
    description: "Grab your pet and join the secure Zoom link provided by the veterinarian. You can chat with our virtual veterinarians for 48 hours after your appointment for any follow-up questions."
  },
  {
    number: 3,
    icon: <Pill className="w-8 h-8 text-orange-600" />,
    title: "Receive  Medications Recommendations Online",
    description: "Our veterinarians will provide personalized medication recommendations based on your pet's needs."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-100">
      <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">How It Works</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {steps.map(step => (
          <div key={step.number} className="relative border border-orange-200 rounded-xl p-6 bg-white shadow-md">
            {/* Step number */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-md">
              {step.number}
            </div>
            <div className="flex flex-col items-center text-center space-y-4 mt-4">
              {step.icon}
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
