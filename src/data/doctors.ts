export type Doctor = {
  name: string;
  specialty: string;
  experience: string;
  rating: string;
  availability: string;
  city?: string;
  phone?: string;
  userId?: string;
};

export const doctors: Doctor[] = [];

