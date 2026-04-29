"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("GLOBAL ERROR BOUNDARY:", error);
  }, [error]);

  return (
    <html>
      <body className="font-sans">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v8.25m0-12a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Critical Error</h1>
            <p className="text-center text-gray-600 text-base mb-6">
              The application encountered a critical error and could not recover.
            </p>
            <details className="mb-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 max-h-32 overflow-auto">
              <summary className="font-semibold cursor-pointer mb-2">Error details</summary>
              <p className="font-mono break-all whitespace-pre-wrap">{error.message || "Unknown error"}</p>
              {error.digest && <p className="mt-2 text-gray-500">ID: {error.digest}</p>}
            </details>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
