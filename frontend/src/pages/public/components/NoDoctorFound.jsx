import React from 'react'
import { useNavigate } from 'react-router-dom';
function NoDoctorFound() {
    const navigate = useNavigate();
  return (
     <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Doctor Not Found</h1>
                <p className="text-orange-100 text-lg">
                  We couldn't find the doctor profile you're looking for
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-8 py-12">
              <div className="max-w-2xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    This could happen for a few reasons:
                  </h2>
                  <ul className="text-gray-600 space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>The doctor profile may have been removed or is temporarily unavailable</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>The link you followed might be outdated or incorrect</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>There might be a temporary issue with our system</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                  </button>
                  <button
                    onClick={() => navigate('/doctor')}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Show Other Doctors
                  </button>
                </div>

                {/* Help Section */}
                <div className="bg-orange-50 rounded-lg p-6 mt-8 border border-orange-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    If you believe this is an error or need assistance finding the right doctor, 
                    our support team is here to help.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default NoDoctorFound
