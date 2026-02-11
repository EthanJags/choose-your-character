/**
 * All project titles, subtitles, and content.
 * Edit this file to update character and project details.
 */

export type ProjectEntry = {
  image: string;
  title: string;
  subtitle: string;
  content: string; // placeholder for future detailed content
  slug: string;
  description: string;
  demoUrl?: string;
};

export type CharacterEntry = {
  id: number;
  name: string;
  slug: string;
  projectsFolder: string;
  image: string;
  banner: string;
  color: string;
  secondaryColor: string;
  thirdColor: string;
  titleImage: string;
  projects: ProjectEntry[];
};

export const uiStrings = {
  selectCharacter: "Select your Ethan",
  clickToEnter: "[Click to enter]",
};

export const characters: CharacterEntry[] = [
  {
    id: 1,
    name: "adventurer",
    slug: "adventurer",
    projectsFolder: "adventure",
    image: "/adventurer.png",
    banner: "/adventurer-banner.png",
    color: "#CBBEFF",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FE4A01",
    titleImage: "/adventurer-title.png",
    projects: [
      {
        image: "/projects/adventure/mount-kilimanjaro/thumbnail.JPG",
        title: "Mount Kilimanjaro",
        subtitle: "Summiting the tallest peak in Africa",
        content: "",
        slug: "mount-kilimanjaro",
        description: "A seven-day summit of Uhuru Peak, the highest point in Africa at 5,895 meters. The climb traversed five climate zones from rainforest to arctic summit.",
      },
      {
        image: "/projects/adventure/japan/thumbnail.jpeg",
        title: "Japan",
        subtitle: "Best trip of my life",
        content: "CONTENT HERE",
        slug: "japan",
        description: "A journey across Japan exploring ancient temples, regional ramen, and the open road. From Tokyo to Kyoto and beyond.",
      },
      {
        image: "/projects/adventure/china/thumbnail.jpeg",
        title: "China",
        subtitle: "2 week solo trip",
        content: "",
        slug: "china",
        description: "Exploring the Great Wall and the diverse landscapes and cultures of China.",
      },
      {
        image: "/projects/adventure/free-diving/thumbnail.webp",
        title: "Free Diving",
        subtitle: "Exploring the depths on a single breath",
        content: "",
        slug: "free-diving",
        description: "Exploring underwater worlds on a single breath. Training and diving in various locations.",
      },
    ],
  },
  {
    id: 2,
    name: "artist",
    slug: "artist",
    projectsFolder: "artist",
    image: "/artist.png",
    banner: "/artist-banner.png",
    color: "#EFFFBE",
    secondaryColor: "#800001",
    thirdColor: "#800001",
    titleImage: "/artist-title.png",
    projects: [
      {
        image: "/projects/artist/tiny-dorm/thumbnail.png",
        title: "Tiny Dorm",
        subtitle: "Bringing musicians closer together at Berkeley",
        content: "",
        slug: "tiny-dorm",
        description: "A collaborative music space and community at Berkeley, bringing musicians together for jam sessions and creative exchange.",
        demoUrl: "https://www.instagram.com/c.u.bclub/",
      },
      {
        image: "/projects/artist/seamonkeys/thumbnail.jpeg",
        title: "Seamonkeys",
        subtitle: "The best band of our lifetime",
        content: "",
        slug: "seamonkeys",
        description: "The best band of our lifetime. A musical project with friends.",
        demoUrl: "https://www.instagram.com/the.seamonkeys/",
      },
    ],
  },
  {
    id: 3,
    name: "engineer",
    slug: "engineer",
    projectsFolder: "engineer",
    image: "/engineer.png",
    banner: "/engineer-banner.png",
    color: "#4300DE",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
    titleImage: "/engineer-title.png",
    projects: [
      {
        image: "/projects/engineer/enable/thumbnail.png",
        title: "Enable",
        subtitle: "Prosthetic development in the comfort of your own home",
        content: "",
        slug: "enable",
        description: "Enabling prosthetic development in the comfort of your own home. Making accessible medical device technology for amputees.",
        demoUrl: "https://enable.vercel.app/",
      },
      {
        image: "/projects/engineer/science-of-everything/thumbnail.png",
        title: "Science of Everything",
        subtitle: "Full production site for a paid contract",
        content: "",
        slug: "science-of-everything",
        description: "Full production website for a paid contract. A comprehensive platform.",
        demoUrl: "https://thescienceofeverything.vercel.app/",
      },
      {
        image: "/projects/engineer/scribble-ai/thumbnail.jpg",
        title: "Scribble AI",
        subtitle: "The simplest way to generate text using AI",
        content: "",
        slug: "scribble-ai",
        description: "The simplest way to generate text using AI. A streamlined interface for AI-powered writing.",
        demoUrl: "https://apps.apple.com/us/app/scribble-ai/id1662081018",
      },
      {
        image: "/projects/engineer/show-and-tell/thumbnail.jpg",
        title: "Show and Tell",
        subtitle: "Enabling emotion and expression for the hard of hearing",
        content: "",
        slug: "show-and-tell",
        description: "Enabling emotion and expression for the hard of hearing. A project that bridges communication gaps.",
        demoUrl: "https://devpost.com/software/show-and-tell-capturing-emotion-in-sign-language",
      },
      {
        image: "/projects/engineer/spotter/thumbnail.jpeg",
        title: "Spotter",
        subtitle: "Machine learning powered tool for first responders",
        content: "",
        slug: "spotter",
        description: "Machine learning powered tool for first responders. Helping emergency personnel with AI-assisted situational awareness.",
        demoUrl: "https://devpost.com/software/spotter-revolutionizing-disaster-relief",
      },
    ],
  },
  {
    id: 4,
    name: "misc dude",
    slug: "misc-dude",
    projectsFolder: "misc",
    image: "/misc-dude.png",
    banner: "/misc-dude-banner.png",
    color: "#FF5100",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
    titleImage: "/misc-dude-title.png",
    projects: [
      {
        image: "/projects/misc/freeppekc/thumbnail.jpeg",
        title: "Freeppekc",
        subtitle: "Medical non-profit supplying 3D-printed equipment to healthcare workers",
        content: "",
        slug: "freeppekc",
        description: "Medical non-profit supplying 3D-printed equipment to healthcare workers. Supporting frontline workers with accessible medical equipment.",
        demoUrl: "https://freeppekc.wixsite.com/freeppekc",
      },
    ],
  },
];
