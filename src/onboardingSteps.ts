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
    image: "https://api.dicebear.com/7.x/bottts/svg?seed=Guide&backgroundColor=FFD700",
    buttonText: "Tell me more"
  },
  {
    title: "Find Quest Nodes",
    description: "Look at your map. Locked sectors are hidden. Click on a node to get a hint about where that building is located.",
    image: "https://picsum.photos/seed/map/400/300",
    buttonText: "How do I unlock?"
  },
  {
    title: "Scan the Building",
    description: "Once you find the building in real life, use the 'Scan' feature. Our AI will verify the location and unlock the sector for you!",
    image: "https://picsum.photos/seed/camera/400/300",
    buttonText: "What about badges?"
  },
  {
    title: "Earn Your Badges",
    description: "Every unlocked sector earns you a unique digital badge. Collect all 3 to become a Grandmaster Guide and clear the entire map!",
    image: "https://picsum.photos/seed/trophy/400/300",
    buttonText: "Let's Start!"
  }
];
