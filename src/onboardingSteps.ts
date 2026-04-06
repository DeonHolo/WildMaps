export interface OnboardingStep {
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to WildMaps!",
    description: "Your mission is to explore the CIT-U campus and clear the 'Fog of War' by finding key landmarks.",
    image: "/images/FIND%20QUEST%20NODES.webp",
    buttonText: "Tell me more"
  },
  {
    title: "Find Quest Nodes",
    description: "Look at your map. Locked sectors are hidden. Click on a node to get a hint about where that building is located.",
    image: "/images/WELCOME%20TO%20WILDMAPS.webp",
    buttonText: "How do I unlock?"
  },
  {
    title: "Scan the Building",
    description: "Once you find the building in real life, use the 'Scan' feature. Our AI will verify the location and unlock the sector for you!",
    image: "/images/Scan%20the%20Building.webp",
    buttonText: "What about badges?"
  },
  {
    title: "Earn Your Badges",
    description: "Every unlocked sector earns you a unique digital badge. Collect all 3 to become a Grandmaster Guide and clear the entire map!",
    image: "/images/Earn%20Your%20Badges.webp",
    buttonText: "Let's Start!"
  }
];
