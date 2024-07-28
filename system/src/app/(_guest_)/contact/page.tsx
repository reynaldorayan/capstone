import React from 'react'
import Map from "./map"
import Form from "./form"
import bg from "@/assets/Contact us.jpg";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { RiFacebookLine } from "react-icons/ri";

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
                Contact Us
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 px-4 sm:px-0 sm:container mx-auto">
                <div className='pt-16'>
                    <h3 className="text-blue-600 font-light text-lg">Contact Us</h3>

                    <Form />
                </div>
                <div className="grid place-items-center overflow-hidden min-h-[70vh]">
                    <Map />

                    <div className='mt-2 flex flex-col gap-4'>
                        <div className='flex gap-1'>
                            <IoLocationOutline size={24} /> <span className='font-light'>Brgy. Masalukot 1, Candelaria Quezon</span>
                        </div>
                        <div className='flex gap-1'>
                            <MdOutlinePhone size={20} /> <span className='font-light'>+639 456 682 232</span>
                        </div>
                        <div className='flex gap-1'>
                            <RiFacebookLine size={20} /> <span className='font-light'>@HappyHomesCandelaria</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}