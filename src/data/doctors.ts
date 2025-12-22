export type Doctor = {
  name: string;
  specialty: string;
  experience: string;
  rating: string;
  availability: string;
};

export const doctors: Doctor[] = [
  {
    name: 'Dr. Aditi Rao',
    specialty: 'Cardiologist',
    experience: '12 yrs experience',
    rating: '4.9',
    availability: 'Today · 5 slots left',
  },
  {
    name: 'Dr. Kabir Malhotra',
    specialty: 'Dermatologist',
    experience: '9 yrs experience',
    rating: '4.8',
    availability: 'Tomorrow · 3 slots left',
  },
  {
    name: 'Dr. Sofia Menon',
    specialty: 'Pediatrician',
    experience: '15 yrs experience',
    rating: '5.0',
    availability: 'Today · 2 slots left',
  },
];
