"use client"
import React from 'react'
import { useState } from 'react';
import DoctorsInfoCard from './components/DoctorsInfoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CiSearch } from "react-icons/ci";


const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Mock doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 124,
      location: "Downtown Medical Center",
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.7,
      reviews: 98,
      location: "Westside Health Clinic",
      availability: "Available Tomorrow",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      rating: 4.8,
      reviews: 156,
      location: "Children's Medical Group",
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Neurologist",
      rating: 4.6,
      reviews: 87,
      location: "Central Neurology Center",
      availability: "Next Week",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Dr. Lisa Patel",
      specialty: "Psychiatrist",
      rating: 4.9,
      reviews: 112,
      location: "Mind & Wellness Clinic",
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
    }
  ];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  // Specialties list
  const specialties = ["all", "cardiologist", "dermatologist", "pediatrician", "neurologist", "psychiatrist"];

  return (
    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Find a Doctor</h1>
          <p className="text-muted-foreground">Browse our network of qualified healthcare professionals</p>
        </header>

        {/* Search and filters */}
        
        <div className="bg-white  rounded-lg shadow-sm border  p-4 mb-4">
          <div className="flex flex-col md:flex-row  gap-2 md:items-center mb-2">
            <div className="relative  flex-1">
              {/* <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" /> */}
              <Input
                placeholder="Search by doctor name or specialty..."
                className=" h-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 h-5">
              <CiSearch className=" text-[10px] text-white" />
              Search Doctors
            </Button>
          </div>

          <Tabs defaultValue="all" value={selectedSpecialty} onValueChange={setSelectedSpecialty} className="w-full">
            <TabsList className="w-full  h-6 scroll-smooth overflow-x-scroll  flex justify-center flex-wrap ">
              {specialties.map((specialty) => (
                <TabsTrigger
                  key={specialty}
                  value={specialty}
                  className="capitalize w-auto"
                >
                  {specialty}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Doctors List */}
        <div className="space-y-3">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorsInfoCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-1">No doctors found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default page