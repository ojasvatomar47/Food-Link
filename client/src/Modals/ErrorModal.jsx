import React from 'react';

const ErrorModal = ({ errorGrade, errorDescription, onClose }) => {
    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
                <div className="relative bg-white rounded-lg p-8">
                    <button
                        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold mb-4">{errorGrade}</h2>
                    <p className="text-gray-700">{errorDescription}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
