import { useNavigate } from "react-router-dom";
import { TiArrowRight } from "react-icons/ti";

const Banner = () => {
    const router = useNavigate();

    return (
        <div className="max-w-7xl mx-auto mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-tl-[100px] rounded-br-[100px] px-6 md:px-14 lg:px-20 my-20 shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
                {/* left */}
                <div className="flex-1 py-12 md:py-20 lg:py-24">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Book Appointment<br />With <span className="text-orange-200">100+</span> Trusted Doctors
                    </h2>
                    <button 
                        onClick={() => router('/auth/register')}
                        className="inline-flex items-center px-6 py-3 text-orange-700 font-semibold bg-white text-lg rounded-full hover:bg-orange-100 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <span>Create An Account</span>
                        <TiArrowRight className="ml-2 text-2xl" />
                    </button>
                </div>
                {/* right */}
                <div className="hidden md:block md:w-1/2 lg:w-[370px]">
                    <img className="w-full max-w-md" src="/doc1.png" alt="Doctor appointment" />
                </div>
            </div>

        </div>
    );
}

export default Banner;