export type AvatarPreset = { id: string; src: string; bgClass: string };

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'lion',
    src: '/images/Profile Icon/LION icon‎.png',
    bgClass: 'bg-sky-100',
  },
  {
    id: 'ocelot',
    src: '/images/Profile Icon/OCELOT icon.png',
    bgClass: 'bg-emerald-100',
  },
  {
    id: 'panther',
    src: '/images/Profile Icon/PANTHER icon.png',
    bgClass: 'bg-violet-100',
  },
  {
    id: 'serval',
    src: '/images/Profile Icon/SERVAL icon.png',
    bgClass: 'bg-lime-100',
  },
  {
    id: 'siamese',
    src: '/images/Profile Icon/SIAMESE icon.png',
    bgClass: 'bg-sky-100',
  },
  {
    id: 'tiger',
    src: '/images/Profile Icon/TIGER icon.png',
    bgClass: 'bg-rose-100',
  },
];

export const AVATAR_PRESET_SRCS = AVATAR_PRESETS.map(p => p.src);

