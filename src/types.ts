export type LandmarkId = 'library' | 'clinic' | 'canteen' | 'osa';

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
  library: {
    id: 'library',
    name: 'University Library',
    description: 'The main hub for research and studying.',
    hint: "Look for the tallest building with glass windows! It's where all the books live.",
    imageUrl: 'https://picsum.photos/seed/library/400/200',
    x: 20,
    y: 30,
    icon: 'BookOpen',
  },
  clinic: {
    id: 'clinic',
    name: 'Medical Clinic',
    description: 'Health and wellness center for students.',
    hint: "Feeling under the weather? Find the building with the green cross near the gates.",
    imageUrl: 'https://picsum.photos/seed/clinic/400/200',
    x: 70,
    y: 20,
    icon: 'Cross',
  },
  canteen: {
    id: 'canteen',
    name: 'Main Canteen',
    description: 'Food and dining area.',
    hint: "Follow the smell of food! It's the large open-air hall with lots of tables.",
    imageUrl: 'https://picsum.photos/seed/canteen/400/200',
    x: 80,
    y: 70,
    icon: 'Coffee',
  },
  osa: {
    id: 'osa',
    name: 'Student Affairs Office',
    description: 'Support services for student life.',
    hint: "Need help with orgs or papers? Head to the administrative block.",
    imageUrl: 'https://picsum.photos/seed/osa/400/200',
    x: 30,
    y: 80,
    icon: 'Users',
  },
};

