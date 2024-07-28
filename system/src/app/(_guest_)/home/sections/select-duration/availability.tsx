"use client";

import { useDisclosure } from "@nextui-org/react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { LuCalendarRange } from "react-icons/lu";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Availability() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const [range, setRange] = useState<DateRange>();

    useEffect(() => {
        if (range) {
            console.log(range);
        }
    }, [range]);

    return (
        <>
            <Modal
                size="2xl"
                title="Availability calendar"
                isOpen={isOpen}
                onClose={onClose}
            >
                <DayPicker
                    mode="range"
                    numberOfMonths={isMobile ? 1 : 2}
                    onSelect={setRange}
                    selected={range}
                    disabled={[
                        { before: dayjs().add(1, "day").toDate() },
                        { after: dayjs().add(1, "year").toDate() },
                    ]}
                />
            </Modal>
            <Button isIconOnly={true} color="primary" variant='flat' onClick={onOpen}>
                <LuCalendarRange size={18} />
            </Button>
        </>
    );
}
