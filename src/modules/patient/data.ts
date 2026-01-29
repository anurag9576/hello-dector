export const quickActions = [
  {
    title: 'Book Appointment',
    description: 'Schedule an in-clinic or online visit.',
    icon: 'calendar-plus',
    iconColor: '#2D7FF9',
  },
  {
    title: 'Talk to a Doctor',
    description: 'Connect instantly via chat or call.',
    icon: 'message-text-outline',
    iconColor: '#6C5CE7',
  },
  {
    title: 'Health Records',
    description: 'Track prescriptions & lab results.',
    icon: 'clipboard-pulse-outline',
    iconColor: '#FF6B6B',
  },
  {
    title: 'Order Medicines',
    description: 'Get curated meds with reminders.',
    icon: 'pill',
    iconColor: '#df4040ff',
  },
];

export const sessions = [
  { date: 'Jan 15', time: '09:00 AM', title: 'General Checkup', doctor: 'Dr. Kabir' },
  { date: 'Jan 18', time: '11:15 AM', title: 'Dermatology Consultation', doctor: 'Dr. Sofia' },
  { date: 'Jan 20', time: '02:00 PM', title: 'Orthopedic Visit', doctor: 'Dr. Sameer' },
  { date: 'Jan 22', time: '10:30 AM', title: 'Dental Cleaning', doctor: 'Dr. Ananya' },
  { date: 'Jan 25', time: '04:00 PM', title: 'Eye Examination', doctor: 'Dr. Rajesh' },
  { date: 'Jan 28', time: '12:00 PM', title: 'Pediatric Visit', doctor: 'Dr. Meera' },
  { date: 'Jan 30', time: '03:45 PM', title: 'Neurology Follow-up', doctor: 'Dr. Vikram' },
  { date: 'Feb 02', time: '08:30 AM', title: 'Cardiology Review', doctor: 'Dr. Aditi' },
  { date: 'Feb 05', time: '01:15 PM', title: 'Physiotherapy Session', doctor: 'Dr. Rohan' },
  { date: 'Feb 10', time: '05:30 PM', title: 'Mental Health Session', doctor: 'Dr. Ishaan' },
];

export const addSession = (newSession: any) => {
  sessions.push(newSession);
};

export const removeSession = (index: number) => {
  sessions.splice(index, 1);
};

export const labs = [
  { title: 'Complete Blood Count', status: 'Delivered', date: 'Dec 12' },
  { title: 'Liver Function Test', status: 'In progress', date: 'Dec 16' },
  { title: 'Vitamin D Test', status: 'Pending sample', date: 'Dec 19' },
];
