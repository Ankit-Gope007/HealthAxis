"use client"
import React, { use } from 'react'
import { User2 } from "lucide-react";
import { useDoctorProfileStore } from '@/src/store/useDoctorProfileStore';

const UserImage = () => {
    const { profile } = useDoctorProfileStore();
  return (
    <div className="w-6 h-6 m-1 rounded-full bg-gray-200 flex items-center justify-center">
      {profile?.imageUrl ? (
        <img
          src={profile.imageUrl}
          alt="User Profile"
          className="w-full h-full rounded-full object-cover"
        />
        ) : (
        <User2 className="w-4 h-4 text-gray-500" />
        )}
    </div>
  )
}

export default UserImage