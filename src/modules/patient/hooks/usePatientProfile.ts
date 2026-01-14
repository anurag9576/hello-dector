import { useState, useEffect } from 'react';
import { apiCall } from '../../../utils/api';
import { getUserSession } from '../../../utils/storage';

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

const initialPatientMeta: PatientMeta = {
  fullName: '',
  initials: '',
  patientId: '',
  memberSince: '',
  city: '',
  state: '',
  contact: '',
  email: '',
  dob: '',
  age: 0,
  gender: '',
};

export const usePatientProfile = () => {
  const [patientMeta, setPatientMeta] = useState<PatientMeta>(initialPatientMeta);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const session = await getUserSession();
        const userId = session?.user?.id || session?.id || session?.userId;
        
        if (!userId) {
          console.warn('No userId found in session, skipping profile fetch');
          setLoading(false);
          return;
        }

        const response = await apiCall(`/get-profile?userId=${userId}`, 'GET');
        if (response && response.data) {
          const profileData = response.data;
          setFullProfile(profileData);
          const updatedMeta: PatientMeta = {
            fullName: profileData.basicInfo?.fullName || profileData.fullName || profileData.name || 'User',
            initials: (profileData.basicInfo?.fullName || profileData.fullName || profileData.name || 'U').split(' ').map((n: string) => n[0]).filter(Boolean).join('').toUpperCase() || '??',
            patientId: profileData.patientId || 'N/A',
            memberSince: profileData.metaData?.memberSince || profileData.memberSince || 'N/A',
            city: profileData.basicInfo?.city || profileData.city || '',
            state: profileData.basicInfo?.state || profileData.state || '',
            contact: profileData.basicInfo?.phone || profileData.contact || profileData.phone || '',
            email: profileData.basicInfo?.email || profileData.email || '',
            dob: profileData.basicInfo?.dob || profileData.dob || '',
            age: profileData.age || 0,
            gender: profileData.basicInfo?.gender || profileData.gender || '',
          };
          setPatientMeta(updatedMeta);
        }
      } catch (err: any) {
        console.error('Failed to fetch profile in hook:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { patientMeta, fullProfile, loading, error };
};
