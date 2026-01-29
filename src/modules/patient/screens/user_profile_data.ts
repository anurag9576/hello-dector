export type ProfileListItem = {
  label: string;
  value: string;
  helper?: string;
  chip?: string;
};

export type ProfileSection = {
  key: string;
  title: string;
  icon: string;
  accent: string;
  items: ProfileListItem[];
  allowsSectionEdit?: boolean;
  sectionIcon?: string;
};

export type PatientMeta = {
  fullName: string;
  initials: string;
  patientId: string;
  memberSince: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  dob: string;
  age: number;
  gender: string;
};

export const patientMeta: PatientMeta = {
  fullName: 'Anurag Kumar',
  initials: 'AK',
  patientId: 'HD-8204',
  memberSince: '12 Mar 2023',
  city: 'Pune',
  state: 'Maharashtra',
  contact: '+91 98765 14320',
  email: 'ananya.v@email.com',
  dob: '24 Aug 1992',
  age: 33,
  gender: 'Male',
};

export const profileSections: ProfileSection[] = [
  {
    key: 'basic',
    title: 'Basic Information',
    icon: 'account-badge',
    accent: '#1B998B',
    allowsSectionEdit: true,
    // sectionIcon: 'card-account-details-star',
    items: [
      { label: 'Full Name', value: 'Ananya Verma' },
      { label: 'Gender', value: 'Female' },
      { label: 'Date of Birth', value: '24 Aug 1992', helper: 'Age 33' },
      { label: 'Mobile', value: '+91 98765 14320' },
      { label: 'Email', value: 'ananya.v@email.com' },
      { label: 'Address', value: 'Baner, Pune, Maharashtra' },
    ],
  },
  {
    key: 'emergency',
    title: 'Emergency Contact',
    icon: 'phone-alert',
    accent: '#D97706',
    allowsSectionEdit: true,
    items: [
      { label: 'Name', value: 'Rahul Verma' },
      { label: 'Relationship', value: 'Spouse' },
      { label: 'Contact Number', value: '+91 98221 55540' },
    ],
  },
  {
    key: 'medical',
    title: 'Medical Information',
    icon: 'heart-pulse',
    accent: '#EF476F',
    allowsSectionEdit: true,
    items: [
      { label: 'Blood Group', value: 'O+' },
      { label: 'Height', value: '165 cm' },
      { label: 'Weight', value: '64 kg' },
      {
        label: 'Existing Conditions',
        value: 'Hypertension, Hypothyroidism',
        helper: 'Managed with medication',
      },
      { label: 'Allergies', value: 'Amoxicillin, Dairy products' },
      { label: 'Past Surgeries', value: 'Appendix removal (2014)' },
    ],
  },
  {
    key: 'current',
    title: 'Current Health Details',
    icon: 'clipboard-pulse-outline',
    accent: '#6366F1',
    allowsSectionEdit: true,
    items: [
      { label: 'Symptoms', value: 'Persistent migraines, neck stiffness' },
      {
        label: 'Medications',
        value: 'Propranolol 40mg daily, Vitamin D weekly',
      },
      { label: 'Doctor', value: 'Dr. Raghav Mehta', helper: 'Neurologist' },
    ],
  },
  {
    key: 'lifestyle',
    title: 'Lifestyle',
    icon: 'leaf',
    accent: '#0EA5E9',
    allowsSectionEdit: true,
    items: [
      { label: 'Smoking', value: 'No', chip: 'Never' },
      { label: 'Alcohol', value: 'Occasionally', chip: 'Weekends' },
      { label: 'Exercise', value: 'Yes', helper: 'Pilates 3x / week' },
      { label: 'Diet', value: 'Vegetarian', helper: 'High protein' },
    ],
  },
  {
    key: 'insurance',
    title: 'Insurance & Hospital',
    icon: 'shield-check',
    accent: '#16A34A',
    allowsSectionEdit: true,
    items: [
      { label: 'Health Insurance', value: 'Yes', chip: 'Active' },
      { label: 'Provider', value: 'CarePlus Health' },
      { label: 'Policy Number', value: 'CPH-992348' },
      { label: 'Preferred Hospital', value: 'Lotus Multispeciality, Pune' },
    ],
  },
];
