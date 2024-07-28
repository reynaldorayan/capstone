"use client";

import React from "react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import pin from "@/assets/pin.png"; // Ensure this path is correct
import pin1 from "@/assets/bpi.png";
import Image from "next/image";

const Mapbox = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiY29kZXdpdGhyYXlhbiIsImEiOiJjbHQ0OWVnZW8wMHBhMmxvYzg3am04dnJlIn0.lj6JSTg4u2sRmeVYn5YGiw",
});

export default function Map() {
    return (
        <>
            <Mapbox
                style="mapbox://styles/mapbox/streets-v9"
                containerStyle={{
                    height: "40vh",
                    width: "30vw",
                }}
                zoom={[13]}
                center={[121.423243279415412549, 13.942215186055723]}
            >
                <Marker
                    coordinates={[121.423243279415412549, 13.942215186055723]}
                    anchor="top"
                >
                    <img
                        alt="Marker"
                        src={pin.src}
                        style={{ height: "50px", width: "50px" }}
                    />
                </Marker>
            </Mapbox>
        </>
    );
}
