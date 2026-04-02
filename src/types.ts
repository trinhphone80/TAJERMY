export interface Photo {
  id: string;
  url: string;
  title: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  product: string;
  volume: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}
