"use client";

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

type ProjectsScreenProps = {
    backgroundColor: string;
};

export default function ProjectsScreen({ backgroundColor }: ProjectsScreenProps) {
    const rotations = [-3, 6, -7, 5, -4, 6];

    return (
        <div
            className="relative w-full min-h-screen z-20"
            style={{ backgroundColor }}
        >
            <div className="mx-auto w-full max-w-225 px-6 pb-24 pt-28">
                <div className="flex flex-col items-center gap-6 md:gap-0">
                    {FAKE_PROJECTS.map((project, i) => {
                        const isLeft = i % 2 === 0;
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
    );
}
