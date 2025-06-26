import {create} from 'zustand';
import { persist } from 'zustand/middleware';

type DoctorProfile = {
    id: string;
    fullName: string;
    specialization: string;
    licenseNumber: string;
    email: string;
    phone: string;
    imageUrl?: string;
    clinicAddress?: string;
    address?: string;
    dob: string;
    experience?: number; // in years
    consultationFee?: number;
}

type DoctorProfileStore = {
    profile: DoctorProfile | null;
    setProfile: (profile: DoctorProfile | null) => void;
    clearProfile: () => void;
}

export const useDoctorProfileStore = create<DoctorProfileStore>()(
    persist(
        (set) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            clearProfile: () => set({ profile: null }),
        }),
        {
            name: 'doctor-profile-storage', // unique name for the storage
        }
    )
);