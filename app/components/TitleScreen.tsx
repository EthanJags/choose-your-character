"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import type { Ethan } from "@/app/page";
import { uiStrings } from "@/app/data/content";
import Arrow from "./Arrow";
import { isInteractiveTarget } from "@/app/lib/keyboard";

type TitleScreenProps = {
    ethan: Ethan;
    onBack: () => void;
    onEnter: () => void;
};

export default function TitleScreen({ ethan, onBack, onEnter }: TitleScreenProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    const handleEnter = useCallback(() => {
        posthog.capture("character_title_entered", {
            character_name: ethan.name,
            character_slug: ethan.slug,
        });
        onEnter();
    }, [onEnter, ethan]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ArrowUp only exits when the title screen is in view; in the gallery it scrolls
            const isAtTop = (rootRef.current?.getBoundingClientRect().top ?? 0) >= -1;
            if (e.key === "Escape" || (e.key === "ArrowUp" && isAtTop)) {
                e.preventDefault();
                onBack();
            } else if (e.key === "Enter" && !isInteractiveTarget(e.target)) {
                e.preventDefault();
                handleEnter();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onBack, handleEnter]);

    return (
        <div
            ref={rootRef}
            className="relative min-h-screen w-full h-screen"
            style={{ backgroundColor: ethan.color }}
        >
            <div className={ethan.slug === "artist" ? "artist-arrow-below-lg" : ""}>
                <Arrow direction="up" color={ethan.thirdColor} onClick={onBack} />
            </div>
            <Image src={'/cloud-long-header.png'} alt={'Clouds'} width={1939} height={592} className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 w-full" priority/>
            {/* Text sizes are capped by viewport height too, so "[Click to enter]"
                stays above the gallery wave on short screens (e.g. 1280x720 laptops) */}
            <div className={`absolute w-full left-0 top-[15%] md:top-[50%] md:-translate-y-1/2 landscape-phone:top-[45%] landscape-phone:-translate-y-1/2 z-10 ${ethan.slug === "artist" ? "artist-text-below-lg" : ""}`}>
                <h1 className="uppercase text-center md:text-left md:mx-20 landscape-phone:text-left landscape-phone:mx-10 leading-none md:leading-[1.1]" style={{ color: ethan.secondaryColor, fontSize: 'clamp(3rem, min(15vw, 24vh), 15rem)' }}>The <br className="block  md:block" />{ethan.name}</h1>
                <p
                    className="mt-0 uppercase text-center md:text-left md:mx-20 landscape-phone:text-left landscape-phone:mx-10 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleEnter}
                    style={{
                        color: ethan.secondaryColor,
                        fontFamily: 'var(--font-londrina-solid), sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(1.5rem, min(4vw, 6vh), 4rem)',
                    }}
                >
                    {uiStrings.clickToEnter}
                </p>
            </div>
            <Image src={ethan.titleImage} alt={ethan.name} width={431} height={721} className="absolute -bottom-[5%] lg:bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[10%] landscape-phone:left-auto landscape-phone:translate-x-0 landscape-phone:right-[5%] landscape-phone:bottom-0 landscape-phone:h-[85vh] h-[70vh] sm:h-[70vh] md:h-[90vh] w-auto z-1" priority />

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer"
                onClick={handleEnter}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9l6 6 6-6"
                        stroke={ethan.secondaryColor}
                        strokeWidth="3"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                </svg>
            </div>

            <style jsx>{`
                @media (max-width: 1023px) {
                    .artist-text-below-lg h1,
                    .artist-text-below-lg p {
                        color: #5d4e6d !important;
                    }
                    .artist-arrow-below-lg :global(svg path) {
                        stroke: #5d4e6d !important;
                    }
                }
            `}</style>
        </div>
    );
}
