export type LandmarkId = 'library' | 'statue' | 'cafe';

export interface Landmark {
  id: LandmarkId;
  name: string;
  description: string;
  hint: string;
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
    imageUrl: 'https://picsum.photos/seed/cafe/400/200',
    x: 65,
    y: 20,
    icon: 'Coffee',
  },
  library: {
    id: 'library',
    name: 'College Library',
    description: 'The main hub for research, studying, and academic resources.',
    hint: "Look for the building with the vast collection of books and study areas!",
    imageUrl: 'https://picsum.photos/seed/library/400/200',
    x: 20,
    y: 50,
    icon: 'BookOpen',
  },
  statue: {
    id: 'statue',
    name: 'CIT-U Logo Monument',
    description: 'The iconic symbol of the university featuring the school colors and logo.',
    hint: "Find the giant letters and the statue near the front of the campus!",
    imageUrl: 'https://picsum.photos/seed/statue/400/200',
    x: 80,
    y: 80,
    icon: 'MapPin',
  },
};

