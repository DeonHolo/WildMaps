export type LandmarkId = 'library' | 'statue' | 'cafe';

export interface Landmark {
  id: LandmarkId;
  name: string;
  description: string;
  hint: string;
  shortHint: string;
  funFact: string;
  /** Watercolor / hint art (Map tab quest modal + Profile) */
  imageUrl: string;
  /** Real-photo reveal used on the Map tab after unlock */
  imageUrlRevealed: string;
  /** Profile reveal art (defaults to `imageUrl`) */
  imageUrlProfile: string;
  x: number; // Map coordinates (percentage)
  y: number;
  icon: string;
}

export const LANDMARKS: Record<LandmarkId, Landmark> = {
  cafe: {
    id: 'cafe',
    name: 'Wildcats Café',
    description: 'The main dining area for students to relax and grab a bite.',
    hint: "Follow the delicious aroma of food and the lively chatter of students taking a break!",
    shortHint: "FOOD",
    funFact: "Home of the famous CIT-U meat roll! The café serves as the main dining area for students to relax and grab a bite.",
    imageUrl: '/images/Cafe_Hint.webp',
    imageUrlRevealed: '/images/Cafe_Hint_Revealed.webp',
    imageUrlProfile: '/images/Cafe_Hint.webp',
    x: 59.7,
    y: 33.5,
    icon: 'Coffee',
  },
  library: {
    id: 'library',
    name: 'College Library',
    description: 'The main hub for research, studying, and academic resources.',
    hint: "Look for the building with the vast collection of books and study areas!",
    shortHint: "BOOK",
    funFact: "Also known as the Learning Resource and Activity Center (LRAC), it won the 2023 Outstanding Academic/Research Library Award from PAARL.",
    imageUrl: '/images/Library_Hint.webp',
    imageUrlRevealed: '/images/Library_Hint_Revealed.webp',
    imageUrlProfile: '/images/Library_Hint.webp',
    x: 27.5,
    y: 56.9,
    icon: 'BookOpen',
  },
  statue: {
    id: 'statue',
    name: 'CIT-U Logo Monument',
    description: 'The iconic symbol of the university featuring the school colors and logo.',
    hint: "Find the statue near the front of the campus!",
    shortHint: "LOGO",
    funFact: "The most photographed spot on campus. Every Teknoy is practically guaranteed to have at least one picture with this logo in the background throughout their time at CIT-U.",
    imageUrl: '/images/Monument_Hint2.webp',
    imageUrlRevealed: '/images/Monument_Hint_Revealed3.webp',
    imageUrlProfile: '/images/Monument_Hint2.webp',
    x: 86,
    y: 75.4,
    icon: 'MapPin',
  },
};

