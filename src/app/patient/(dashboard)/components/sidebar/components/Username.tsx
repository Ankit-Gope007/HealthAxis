"use client";
import React from 'react'

import { usePatientProfileStore } from '@/src/store/usePatientProfileStore'

const Username = () => {
  const {profile} = usePatientProfileStore();
  return (
    <span>{profile?.fullName}</span>
  )
}

export default Username