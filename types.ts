
export interface Service {
  id: string;
  title: string;
  description: string;
  items: string[];
  icon: string;
  image: string;
  category: 'Geosolutions' | 'Integrated';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Integrated' | 'Geosolutions' | 'Civil' | 'Pipeline';
  description: string;
  image: string;
  // Expanded Case Study Details
  results?: string;
  equipment?: string[];
  scope?: string;
  challenge?: string;
  solution?: string;
  location?: string;
  year?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
}

export interface LinkedInPost {
  id: string;
  title?: string;
  date: string;
  content: string;
  image?: string;
  link: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon: string;
}
