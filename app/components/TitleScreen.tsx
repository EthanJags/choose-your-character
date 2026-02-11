"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Ethan } from "@/app/page";
import { uiStrings } from "@/app/data/content";
import Arrow from "./Arrow";

type TitleScreenProps = {
    ethan: Ethan;
    onBack: () => void;
    onEnter: () => void;
};

export default function TitleScreen({ ethan, onBack, onEnter }: TitleScreenProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);

    // Listen to sound toggle events
    useEffect(() => {
        const handleSoundToggle = (e: CustomEvent<{ enabled: boolean }>) => {
            setIsSoundOn(e.detail.enabled);
        };

        window.addEventListener("soundToggle", handleSoundToggle as EventListener);
        
        // Initialize sound state from localStorage
        const savedPreference = localStorage.getItem("soundEnabled");
        if (savedPreference !== null) {
            const enabled = savedPreference === "true";
            setIsSoundOn(enabled);
        }

        return () => {
            window.removeEventListener("soundToggle", handleSoundToggle as EventListener);
        };
    }, []);

    const handleBack = useCallback(() => {
        if (isSoundOn) {
            const audio = new Audio("/sound-effects/drawer-closing.mov");
            audio.play().catch(() => {
                // Ignore autoplay errors
            });
        }
        setIsExiting(true);
        setTimeout(() => {
            onBack();
        }, 800);
    }, [onBack, isSoundOn]);

    const handleEnter = useCallback(() => {
        if (isExiting) return;
        onEnter();
    }, [onEnter, isExiting]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                handleBack();
            } else if (e.key === "Enter") {
                e.preventDefault();
                handleEnter();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleBack, handleEnter]);

    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            if (isExiting) return;
            if (e.deltaY < -50) handleBack();
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (isExiting) return;
            const deltaY = e.changedTouches[0].clientY - touchStartY.current;
            if (deltaY < -50) handleBack();
        };

        el.addEventListener("wheel", handleWheel, { passive: true });
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("wheel", handleWheel);
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleBack, isExiting]);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen w-full h-screen overflow-hidden"
            style={{
                backgroundColor: ethan.color,
                transform: isExiting ? "translateY(100vh)" : "translateY(0)",
                transition: "transform 800ms ease-out",
                animation: "slideUpFromBottom 800ms ease-out",
            }}
        >
            <Arrow direction="up" color={ethan.thirdColor} onClick={handleBack} />
            <Image src={'/cloud-long-header.png'} alt={'Clouds'} width={1939} height={592} className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 w-full"/>
            <div className="absolute w-full left-0 top-[15%] md:top-[60%] md:-translate-y-1/2 z-10">
                <h1 className="uppercase text-center md:text-left md:mx-20" style={{ color: ethan.secondaryColor, fontSize: 'clamp(3rem, 15vw, 20rem)' }}>The <br/>{ethan.name}</h1>
                <p
                    className="uppercase text-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleEnter}
                    style={{
                        color: ethan.secondaryColor,
                        fontFamily: 'var(--font-londrina-solid), sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                        marginTop: '20px',
                    }}
                >
                    {uiStrings.clickToEnter}
                </p>
            </div>
            <Image src={ethan.titleImage} alt={ethan.name} width={431} height={721} className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[10%] h-[70vh] sm:h-[80vh] md:h-[90vh] w-auto z-1" />

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