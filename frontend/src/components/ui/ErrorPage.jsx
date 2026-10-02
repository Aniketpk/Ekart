import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-transparent p-6">
            <div className="w-full max-w-md glass-surface-strong rounded-[2rem] p-8 text-center shadow-xl">
                <p className="font-mono-label mb-3 text-[#173b5c]">E-Kart</p>
                <h1 className="mb-3 font-display text-3xl font-bold text-slate-950">This page didn’t load</h1>
                <p className="mb-8 text-sm leading-6 text-slate-600">Something went wrong while opening this page. You can go back or return to the storefront.</p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="rounded-xl bg-[#173b5c] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#102c47]"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </main>
    );
}

export default ErrorPage;
