import React from "react";
import bg from "@/assets/About us.jpg";
import img from "@/assets/About image.png";
import Image from "next/image";

export default function page() {
    const bgStyles = {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${bg.src}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "top",
    };

    return (
        <div>
            <div
                className="text-4xl font-medium text-white min-h-72 flex justify-center items-center"
                style={{ ...bgStyles }}
            >
                About Us
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:container px-4 sm:px-0 mx-auto">
                <div className="grid place-items-center sm:h-96">
                    <Image
                        src={img.src}
                        alt="About"
                        height={150}
                        width={150}
                        className="object-cover sm:h-[500px] sm:w-[500px] mt-16"
                        unoptimized
                        priority
                    />
                </div>
                <div className="pt-16 flex flex-col gap-2">
                    <h3 className="text-blue-600 font-light text-lg">About us</h3>
                    <h2 className="text-5xl">A Beautiful Way to Relax</h2>

                    <p className="text-lg mt-10 sm:text-justify font-light">
                        Welcome to Happy Homes Recreational Hub Inc, your premier
                        destination for hosting extraordinary events in a serene and
                        picturesque setting. Situated amidst the natural beauty of our
                        surroundings, our event place is designed to provide a versatile and
                        captivating venue for all your special occasions.
                    </p>

                    <div className="mt-5 flex flex-col gap-3">
                        <h2 className="text-lg mb-2">Our Unique Offering:</h2>

                        <p>
                            Versatile Spaces:{" "}
                            <span className="font-light">
                                Our event place offers a range of versatile spaces, including
                                pavilions, a spacious function hall, and stunning outdoor areas.
                                These spaces serve as the perfect backdrop for your events,
                                offering endless possibilities for customization.
                            </span>
                        </p>

                        <p>
                            Exceptional Amenities:{" "}
                            <span className="font-light">
                                We take pride in offering a thoughtfully designed environment
                                equipped with modern comforts. Our facilities ensure your
                                guests' convenience and provide the perfect canvas for you to
                                craft your event experience.
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:container sm:gap-10 gap-5 px-4 sm:px-0 mx-auto sm:mt-16">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl">Our Vision</h2>
                    <p className="font-light">
                        At Happy Homes Recreational Hub Inc, our vision is clear—to offer a
                        beautiful and flexible event space where you can bring your unique
                        event ideas to life. We provide the canvas, and you paint the
                        picture, creating memorable gatherings and cherished moments.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl">Our Mission</h2>
                    <p className="font-light">
                        Our mission is to provide you with a serene and welcoming event
                        place where you can craft unique and unforgettable events. We aim to
                        create an atmosphere where your creativity knows no bounds, and your
                        events become cherished memories for all who attend.
                    </p>
                </div>
            </div>
        </div>
    );
}
