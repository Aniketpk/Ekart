import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf9f8] p-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow-ambient p-8 text-center border border-[#f0edec]">
                <h1 className="text-4xl font-display font-bold text-[#ba1a1a] mb-4">Oops!</h1>
                <p className="text-[#454652] font-body mb-6">Sorry, an unexpected error has occurred.</p>
                <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded text-sm font-mono-label mb-8 break-words text-left">
                    <i>{error?.statusText || error?.message || "Unknown Error"}</i>
                </div>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded font-medium border border-[#outline] text-[#454652] hover:bg-[#f6f3f2] transition-colors"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded font-medium bg-[#000666] text-white hover:bg-[#1a237e] transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
