"use client";

import React from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function Form() {
    return (
        <div className="mt-10 flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-5">
                <Input placeholder="Your name" label="Your name" />
                <Input placeholder="Your email" label="Your email" />
            </div>
            <Textarea
                className="mt-5"
                placeholder="Your message"
                label="Your message"
            />
            <div className="flex justify-end mt-2">
                <Button className="mt-2">
                    Send message
                </Button>
            </div>
        </div>
    );
}
