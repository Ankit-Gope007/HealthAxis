"use client";
import React from 'react'

import { useDoctorProfileStore } from '@/src/store/useDoctorProfileStore';

const Username = () => {
  const { profile } = useDoctorProfileStore();
  return (
    <span>{profile?.fullName}</span>
  )
}

export default Username