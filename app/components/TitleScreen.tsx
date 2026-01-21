"use client";

import { useState } from "react";
import Image from "next/image";
import type { Ethan } from "@/app/page";
import Arrow from "./Arrow";

type TitleScreenProps = {
    ethan: Ethan;
    onBack: () => void;
};

export default function TitleScreen({ ethan, onBack }: TitleScreenProps) {
    const [isExiting, setIsExiting] = useState(false);

    const handleBack = () => {
        setIsExiting(true);
        setTimeout(() => {
            onBack();
        }, 800);
    };

    return (
        <div
            className="relative min-h-screen w-full h-screen overflow-hidden"
            style={{
                backgroundColor: ethan.color,
                transform: isExiting ? "translateY(100vh)" : "translateY(0)",
                transition: "transform 800ms ease-out",
                animation: "slideUpFromBottom 800ms ease-out"
            }}
        >
            <Arrow direction="up" color={ethan.thirdColor} onClick={handleBack} />
            <Image src={'/cloud-long-header.png'} alt={'Clouds'} width={1939} height={592} className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 w-full"/>
            <h1 className="absolute uppercase text-center sm:text-left left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 md:mx-20 top-[15%] sm:top-[60%] sm:-translate-y-1/2 z-10" style={{ color: ethan.secondaryColor, fontSize: 'clamp(3rem, 15vw, 20rem)' }}>The <br/>{ethan.name}</h1>
            <Image src={ethan.image} alt={ethan.name} width={431} height={721} className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 md:right-[5%] lg:right-[10%] h-[70vh] sm:h-[80vh] md:h-[90vh] w-auto z-1" />

            <style jsx>{`
                @keyframes slideUpFromBottom {
                    from {
                        transform: translateY(100vh);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}