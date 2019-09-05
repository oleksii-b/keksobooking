export interface IAd {
  author: {
    avatar: string;
  };
  location: {
    x: string;
    y: string;
  };
  offer: {
    address: string;
    checkin: string;
    checkout: string;
    description: string;
    features: string[];
    guests: number;
    photos: string[];
    price: number;
    rooms: number;
    title: string;
    type: string;
  };
}

export interface IFeature {
  name: string;
  title: string;
}

export interface IImage {
  file: File;
  fileName: string;
  src: string | ArrayBuffer;
}
