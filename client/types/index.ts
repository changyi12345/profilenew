export interface Hero {
  _id: string;
  greeting: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  heroImage?: string; // Optional image field
}

export interface Skill {
  _id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface About {
  _id: string;
  title: string;
  name: string;
  role: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
}

export interface Contact {
  _id: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
}
