"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Ethan } from "@/app/page";
import Arrow from "./Arrow";
import Polaroid from "./Polaroid";

const FAKE_PROJECTS = [
    {
        image: "/openGraph.png",
        title: "Tiny Dorm",
        description: "Bringing musicians together at Berkeley",
    },
    {
        image: "/mountain.png",
        title: "Seamonkeys",
        description: "The best band of our lifetime",
    },
    {
        image: "/background.png",
        title: "Moonlight Sessions",
        description: "Late-night recordings and early ideas",
    },
    {
        image: "/adventurer-banner.png",
        title: "Sound Atlas",
        description: "A map of influences and inspirations",
    },
    {
        image: "/artist-banner.png",
        title: "Poster Wall",
        description: "A collection of gig posters and prints",
    },
    {
        image: "/engineer-banner.png",
        title: "Loop Lab",
        description: "Tools for making loops feel alive",
    },
] satisfies Array<{ image: string; title: string; description: string }>;

type TitleScreenProps = {
    ethan: Ethan;
    onBack: () => void;
};

export default function TitleScreen({ ethan, onBack }: TitleScreenProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(() => {
        if (typeof window === "undefined") return true;
        const savedPreference = window.localStorage.getItem("soundEnabled");
        return savedPreference === null ? true : savedPreference === "true";
    });

    // Listen to sound toggle events
    useEffect(() => {
        const handleSoundToggle = (e: CustomEvent<{ enabled: boolean }>) => {
            setIsSoundOn(e.detail.enabled);
        };

        window.addEventListener("soundToggle", handleSoundToggle as EventListener);

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                e.preventDefault();
                handleBack();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleBack]);

    return (
        <div
            className="relative w-full h-screen overflow-y-auto"
            style={{
                transform: isExiting ? "translateY(100vh)" : "translateY(0)",
                transition: "transform 800ms ease-out",
                animation: "slideUpFromBottom 800ms ease-out"
            }}
        >
            {/* Top Section */}
            <div
                className="sticky top-0 z-0 h-screen w-full"
                style={{
                    backgroundColor: ethan.color,
                }}
            >
                <Arrow direction="up" color={ethan.thirdColor} onClick={handleBack} />
                <Image src={'/cloud-long-header.png'} alt={'Clouds'} width={1939} height={592} className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 w-full"/>
                <h1 className="absolute uppercase text-center sm:text-left left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 md:mx-20 top-[15%] sm:top-[60%] sm:-translate-y-1/2 z-10" style={{ color: ethan.secondaryColor, fontSize: 'clamp(3rem, 15vw, 20rem)' }}>The <br/>{ethan.name}</h1>
                <Image src={ethan.titleImage} alt={ethan.name} width={431} height={721} className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 md:right-[5%] lg:right-[10%] h-[70vh] sm:h-[80vh] md:h-[90vh] w-auto z-1" />
            </div>

            {/* Wavy Divider - positioned to overlap with Ethan image */}
            <div className="relative w-full -mt-24 sm:-mt-32 md:-mt-20">
                <svg
                    className="w-full h-24 block relative z-20"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    style={{ display: 'block' }}
                >
                    <path
                        d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
                        fill={ethan.secondaryColor}
                    />
                </svg>
            </div>

            {/* Curtain Section */}
            <div
                className="relative w-full min-h-screen z-20"
                style={{
                    backgroundColor: ethan.secondaryColor,
                }}
            >
                <div className="mx-auto w-full max-w-225 px-6 pb-24 pt-28">
                    <div className="flex flex-col items-center gap-6 md:gap-0">
                        {FAKE_PROJECTS.map((project, i) => {
                            const isLeft = i % 2 === 0;
                            const rotations = [-3, 6, -7, 5, -4, 6];
                            const rotation = rotations[i % rotations.length];
                            return (
                                <Polaroid
                                    key={project.title}
                                    image={project.image}
                                    title={project.title}
                                    description={project.description}
                                    className={isLeft ? "md:self-start" : "md:self-end"}
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        marginTop: i === 0 ? 0 : undefined,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

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