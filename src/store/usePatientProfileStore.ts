import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PatientProfile = {
    id: string;
    fullName: string;
    bloodGroup: string;
    gender: string;
    phone: string;
    imageUrl?: string;
    address?: string;
    dob: string;
    emergencyContactNumber?: string;
    medicalHistory?: string;
    currentMedications?: string;
}

type PatientProfileStore = {
    profile: PatientProfile | null;
    setProfile: (profile: PatientProfile | null) => void;
    clearProfile: () => void;
}


export const usePatientProfileStore = create<PatientProfileStore>()(
    persist(
        (set)=>({
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearProfile: () => set({ profile: null }),
        }),
        {
            name: 'patient-profile-storage', // unique name for the storage
        }
    )
    )
