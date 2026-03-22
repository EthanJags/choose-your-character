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
  demoLabel?: string;
  /** When true, card links to demoUrl instead of project page */
  externalLinkOnly?: boolean;
  devpostUrl?: string;
  devpostLabel?: string;
  hackathonAwards?: string;
  /** Override aspect ratio for thumbnail, e.g. "1141/720" (default: "1141/652") */
  aspectRatio?: string;
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
        aspectRatio: "1000/1000",
        description: "A seven-day summit of Uhuru Peak, the highest point in Africa at 5,895 meters. The climb traversed five climate zones from rainforest to arctic summit.",
        demoUrl: "https://www.instagram.com/p/DPDJk9MEZPx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        externalLinkOnly: true,
      },
      {
        image: "/projects/adventure/japan/thumbnail.jpg",
        title: "Japan",
        subtitle: "Connecting with nature and culture",
        content: "",
        slug: "japan",
        aspectRatio: "1000/1200",
        description: "Spent 2 weeks in Japan exploring Kyoto and Tokyo. Ate lots of ramen and japanese curry. Spent every night with locals. Was on Japanese Natinal Television.",
        demoUrl: "https://www.instagram.com/p/DFolC-fSof1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        externalLinkOnly: true,
      },
      {
        image: "/projects/adventure/china/thumbnail.jpeg",
        title: "China",
        subtitle: "2 week solo trip",
        content: "",
        slug: "china",
        description: "Exploring the Great Wall and the diverse landscapes and cultures of China.",
        demoUrl: "https://www.instagram.com/p/DGE3m_4Jwzm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
        externalLinkOnly: true,
      },
      {
        image: "/projects/adventure/free-diving/thumbnail.webp",
        title: "Free Diving",
        subtitle: "Dove 70 feet down on a single breath",
        content: "",
        slug: "free-diving",
        description: "Exploring underwater worlds on a single breath. Training and diving in various locations.",
        demoUrl: "https://www.youtube.com/watch?v=re4HLHSIwW8",
        externalLinkOnly: true,
      },
      {
        image: "/projects/adventure/bucket-list/thumbnail.jpg",
        title: "And more...",
        subtitle: "Check out my bucket list",
        content: "",
        slug: "bucket-list",
        description: "My bucket list of adventures and experiences.",
        demoUrl: "https://melodic-mistake-784.notion.site/Bucket-List-6d33ce8d01bd4875be5e7eda05067515?source=copy_link",
        externalLinkOnly: true,
      },
    ],
  },
  {
    id: 2,
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
        image: "/projects/engineer/access-ai/thumbnail.png",
        title: "Access AI",
        subtitle: "Your 24/7 autonomous accessibility auditor",
        content: "",
        slug: "access-ai",
        description:
          "The internet is broken for 1.3 billion people. 96% of the top 1 million homepages fail basic accessibility standards. AccessAI autonomously browses like a visually impaired user, identifies violations, and exports findings to Linear—fixing the problem before a human even notices.",
        demoUrl: "https://accessibility-agent.vercel.app",
        demoLabel: "Try Product",
        devpostUrl: "https://devpost.com/software/accessai-p1stlz",
        devpostLabel: "View Demo",
        hackathonAwards:
          "Best use of the TinyFish Web Agent API, Best Yutori API Project (Agentic Orchestration Hack)",
      },
      {
        image: "/projects/engineer/science-of-everything/thumbnail.png",
        title: "Science of Everything",
        subtitle: "Full production site for a paid contract",
        content: "",
        slug: "science-of-everything",
        description: "Full production website for a paid contract. A comprehensive platform.",
        demoUrl: "https://thescienceofeverything.vercel.app/",
        demoLabel: "View Website",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/interview-ai/thumbnail.png",
        title: "Interview AI",
        subtitle: "AI-powered mock interview practice platform",
        content: "",
        slug: "interview-ai",
        description: "AI-powered mock interview practice platform. Sharpen your interview skills with realistic AI-driven technical and behavioral interviews.",
        demoUrl: "https://dontbombtheinterview.vercel.app",
        demoLabel: "Try It",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/sound-search/thumbnail.png",
        title: "Sound Search",
        subtitle: "AI-powered music similarity search",
        content: "",
        slug: "sound-search",
        description: "Search for sounds using AI-powered similarity matching. Find the perfect sound for your project.",
        demoUrl: "https://sound-search.vercel.app",
        demoLabel: "Try it",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/beat-the-market/thumbnail.png",
        title: "Beat the Market",
        subtitle: "Prediction Market betting game",
        content: "",
        slug: "beat-the-market",
        description:
          "Test your prediction skills against real market data. A game where you predict market outcomes and compete on the leaderboard.",
        demoUrl: "https://beatthemarket.xyz/",
        demoLabel: "Play Now",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/sketchy-business/thumbnail.png",
        title: "Sketchy Business",
        subtitle: "A fast-paced drawing and guessing game",
        content: "",
        slug: "sketchy-business",
        description: "A multiplayer drawing and guessing game where players sketch prompts and race to guess what others are drawing.",
        demoUrl: "https://quip-quest.vercel.app",
        demoLabel: "Play Now",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/scribble-ai/thumbnail.jpg",
        title: "Scribble AI",
        subtitle: "The simplest way to generate text using AI",
        content: "",
        slug: "scribble-ai",
        description: `Awards: Admitted to SkyDeck Pad-13 (Batch 16), 3rd Place in UC Launch Final Demo Day Spring 2023

Bridging the accessibility gap in generative AI
Download now: https://apps.apple.com/us/app/scribble-ai/id1662081018

Scribble AI is live on iOS and Android with over 20,000 downloads and 800,000 pieces of content generated so far.

Scribble AI provides a mobile interface to generate customized text in 20+ pre-built formats, styles, and languages without having to write prompts for the AI. Through our pre-optimized prompt engineering in the app's backend, non-technical consumers can generate and share textual content within seconds with just three clicks. For individuals who write a lot of content each day, whether a Twitter influencer writing DMs or sales rep making a quick pitch, the app's premium version (in development) customizes the pre-built prompts to their needs, allowing the user to access higher quality content than ChatGPT for faster and cheaper.`,
        demoUrl: "https://apps.apple.com/us/app/scribble-ai/id1662081018",
        demoLabel: "Download the app now",
      },
      {
        image: "/projects/engineer/show-and-tell/thumbnail.png",
        title: "Show and Tell",
        subtitle: "Enabling emotion and expression for the hard of hearing",
        aspectRatio: "1132/1608",
        content: "",
        slug: "show-and-tell",
        description: "Enabling emotion and expression for the hard of hearing. A project that bridges communication gaps.",
        demoUrl: "https://devpost.com/software/show-and-tell-capturing-emotion-in-sign-language",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/enable/thumbnail.png",
        title: "Enable",
        subtitle: "Prosthetic development in the comfort of your own home",
        aspectRatio: "16/9",
        content: "",
        slug: "enable",
        description: "Enabling prosthetic development in the comfort of your own home. Making accessible medical device technology for amputees.",
        demoUrl: "https://devpost.com/software/enable-automated-generation-of-prosthetic-devices",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/tic-tac-tobot/thumbnail.png",
        title: "Tic Tac Tobot",
        subtitle: "Made a robot that physically plays tic tac toe with you using motors and magnets",
        content: "",
        slug: "tic-tac-tobot",
        description: "Made a robot that physically plays tic tac toe with you using motors and magnets.",
        demoUrl: "https://www.youtube.com/watch?v=vvE1xocyev0",
        demoLabel: "Watch Video",
        externalLinkOnly: true,
      },
      {
        image: "/projects/engineer/spotter/thumbnail.jpeg",
        title: "Spotter",
        subtitle: "Machine learning powered tool for first responders",
        aspectRatio: "3/4",
        content: "",
        slug: "spotter",
        description: "Machine learning powered tool for first responders. Helping emergency personnel with AI-assisted situational awareness.",
        demoUrl: "https://devpost.com/software/spotter-revolutionizing-disaster-relief",
        externalLinkOnly: true,
      },
    ],
  },
  {
    id: 3,
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
        aspectRatio: "7/4",
        description: "A collaborative music space and community at Berkeley, bringing musicians together for jam sessions and creative exchange.",
        demoUrl: "https://www.instagram.com/c.u.bclub/",
        demoLabel: "View Instagram",
        externalLinkOnly: true,
      },
      {
        image: "/projects/artist/seamonkeys/thumbnail.jpeg",
        title: "Seamonkeys",
        subtitle: "The best high school band",
        content: "",
        slug: "seamonkeys",
        aspectRatio: "1678/1594",
        description: "The best high school band. A musical project with friends.",
        demoUrl: "https://www.instagram.com/the.seamonkeys/",
        demoLabel: "View Instagram",
        externalLinkOnly: true,
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
        aspectRatio: "1141/780",
        description: "Medical non-profit supplying 3D-printed equipment to healthcare workers. Supporting frontline workers with accessible medical equipment.",
        demoUrl: "https://freeppekc.wixsite.com/freeppekc",
        demoLabel: "View Website",
        externalLinkOnly: true,
      },
    ],
  },
];
