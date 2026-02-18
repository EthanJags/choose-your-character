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
      },
      {
        image: "/projects/adventure/japan/thumbnail.jpg",
        title: "Japan",
        subtitle: "Connecting with nature and culture",
        content: "",
        slug: "japan",
        aspectRatio: "1000/1200",
        description: "Spent 2 weeks in Japan exploring Kyoto and Tokyo. Ate lots of ramen and japanese curry. Spent every night with locals. Was on Japanese Natinal Television.",
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
        image: "/projects/engineer/scribble-ai/thumbnail.jpg",
        title: "Scribble AI",
        subtitle: "The simplest way to generate text using AI",
        content: "",
        slug: "scribble-ai",
        description: `Awards: Admitted to SkyDeck Pad-13 (Batch 16), 3rd Place in UC Launch Final Demo Day Spring 2023

Bridging the accessibility gap in generative AI
Download now: https://apps.apple.com/us/app/scribble-ai/id1662081018

Scribble AI is live on iOS and Android with over 20,000 downloads and 800,000 pieces of content generated so far.

Scribble AI provides a mobile interface to generate customized text in 20+ pre-built formats, styles, and languages without having to write prompts for the AI. Through our pre-optimized prompt engineering in the app's backend, non-technical consumers can generate and share textual content within seconds with just three clicks. For individuals who write a lot of content each day, whether a Twitter influencer writing DMs or sales rep making a quick pitch, the app's premium version (in development) customizes the pre-built prompts to their needs, allowing the user to access higher quality content than ChatGPT for faster and cheaper.

Executive Summary

Problem: For non-technical consumers, the use cases of generative AI have high barriers to entry. Consumers who lack experience in prompt engineering lose tens of hours of time since they cannot leverage tools like ChatGPT to the fullest extent, particularly without paying the $20 per month premium. For international consumers outside the Silicon Valley "bubble," this gap in AI adoption is most exacerbated, as we have seen through personal experience with friends, family, and interviewees.

Solution: Scribble AI provides a mobile interface to generate customized text in 20+ pre-built formats, styles, and languages without having to write prompts for the AI (unlike ChatGPT). With this app, non-technical consumers can generate and share textual content within seconds with just three clicks. For individuals who need to write a lot of content each day, whether a Twitter influencer writing DMs or sales rep making a quick pitch, the app's premium version (in development) automatically customize its interface to their needs (priced at $9 per month), allowing the user to access higher quality content than ChatGPT for faster and cheaper.

Traction: We launched Scribble AI's initial MVP with the free version to the iOS and Android app stores two months ago. Currently, Scribble AI has 20,000+ downloads across more than 50 countries. Since our launch, more than 800,000+ "Scribbles" (pieces of written content) have been generated on the app, growing each day without any marketing spend. Our team is currently developing and iterating the premium and enterprise versions.

Market Research & Validation: We conducted more than 40 user interviews and analyzed data from our app's current usage. Upon analyzing the content generated by our users, we found that 20% are emails, 12% are Tweets, 10% are LinkedIn posts, and 20% are non-English. From this, we conclude there is an opportunity for Scribble AI to target creators short-form mobile social media content (i.e. Twitter, LinkedIn, Instagram) as a beachhead from which to expand.

Defensibility & Differentiation: We stand out by targeting international consumers, particularly in India (where we have many personal contacts with influencers), and leveraging data to automatically customize the app's interface to specific customers' needs. For example, for a Twitter content creator, the app's premium version will be customized to their content needs (i.e. tweets, DMs, replies, etc.), making our solution far stickier than those of competitors. Through this approach, we strive to become the leader of mobile text generation.

Team: Our team not only has past experience launching AI products and starting companies, but we are close friends who worked together on multiple projects over the past three years. In the rapidly changing landscape of AI, we can build and adapt faster than any competitor, having developed and launched the app within two weeks of conceiving the idea.

Pitch Deck: https://tinyurl.com/scribble-ai`,
        demoUrl: "https://apps.apple.com/us/app/scribble-ai/id1662081018",
        demoLabel: "Download the app now",
      },
      {
        image: "/projects/engineer/show-and-tell/thumbnail.jpg",
        title: "Show and Tell",
        subtitle: "Enabling emotion and expression for the hard of hearing",
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
        description: "A collaborative music space and community at Berkeley, bringing musicians together for jam sessions and creative exchange.",
        demoUrl: "https://www.instagram.com/c.u.bclub/",
        demoLabel: "View Instagram",
      },
      {
        image: "/projects/artist/seamonkeys/thumbnail.jpeg",
        title: "Seamonkeys",
        subtitle: "The best band of our lifetime",
        content: "",
        slug: "seamonkeys",
        description: "The best band of our lifetime. A musical project with friends.",
        demoUrl: "https://www.instagram.com/the.seamonkeys/",
        demoLabel: "View Instagram",
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
