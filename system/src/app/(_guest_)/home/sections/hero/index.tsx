"use client";

import React from "react";

export default function Hero() {
    return (
        <section className="px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 sm:min-h-[70vh] pt-5 sm:pt-0">
            <div className="grid place-items-center relative">

                <div className="flex flex-col gap-2 mb-5">
                    <h1 className="text-3xl sm:text-4xl font-medium">
                        Welcome to Happy homes
                    </h1>
                    <p className="text-lg font-[400]">
                        Find the perfect place to stay during your vacation
                    </p>
                </div>
            </div>
            <div className="bg-gray-50 h-[60vh] relative">
                <iframe
                    className="ku-embed h-full w-full z-50 inset-10"
                    allow="xr-spatial-tracking; gyroscope; accelerometer"
                    allowFullScreen
                    src="https://kuula.co/share/collection/7KPsY?logo=1&info=0&logosize=150&fs=1&vr=0&zoom=1&gyro=0&thumbs=3&inst=0&keys=0"
                ></iframe>
            </div>
        </section>
    );
}
