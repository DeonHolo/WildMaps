export type LandmarkId = 'library' | 'statue' | 'cafe';

export interface Landmark {
  id: LandmarkId;
  name: string;
  description: string;
  hint: string;
  shortHint: string;
  funFact: string;
  imageUrl: string;
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
    x: 65,
    y: 20,
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
    x: 20,
    y: 50,
    icon: 'BookOpen',
  },
  statue: {
    id: 'statue',
    name: 'CIT-U Logo Monument',
    description: 'The iconic symbol of the university featuring the school colors and logo.',
    hint: "Find the statue near the front of the campus!",
    shortHint: "LOGO",
    funFact: "The most photographed spot on campus. Every Teknoy is practically guaranteed to have at least one picture with this logo in the background throughout their time at CIT-U.",
    imageUrl: '/images/Monument_Hint.webp',
    x: 80,
    y: 80,
    icon: 'MapPin',
  },
};

