"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import DoctorsInfoCard from './components/DoctorsInfoCard';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


type DoctorInfo = {
  id: string;
  email: string;
  password: string;
  role: "DOCTOR";
  profileSetup: boolean;
  createdAt: string;
  updatedAt: string;
  doctorProfile: {
    id: string;
    fullName: string;
    phone: string;
    imageUrl: string | null;
    address: string | null;
    specialization: string
    experience: number | null;
    licenseNumber: string;
    licenseDocument: string;
    verified: boolean;
    consultationFee: number | null;
    createdAt: string;
    updatedAt: string;
    doctorId: string;
  };
};



const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [loading, setLoading] = useState(false);
  const [doctorsData, setDoctorsData] = useState<DoctorInfo[]>([]);

  useEffect(() => {
    // Fetch doctor data when the component mounts
    handleDoctorData();

  }, [])

  const handleDoctorData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/doctor/getAllForPatient');
      if (response.status === 200) {
        console.log("Doctors data fetched successfully:", response.data.doctors.data);
        setDoctorsData(response.data.doctors.data);
        console.log("Doctors data:", response.data.doctors.data);
        setLoading(false);

        // You can set the fetched data to state or handle it as needed
      } else {
        console.error("Failed to fetch doctors data:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      setLoading(false);
      toast.error("Failed to fetch doctors data", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#DC3545",
          color: "#fff",
        },
      });

    }
  }


  const specializations = ["General Medicine", "Cardiology", "Dermatology", "Endocrinology",
    "Gastroenterology", "Neurology", "Oncology", "Orthopedics",
    "Pediatrics", "Psychiatry", "Radiology", "Surgery"];

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.doctorProfile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization = filterSpecialization === "all" ||
      doctor.doctorProfile.specialization === filterSpecialization;

    return matchesSearch && matchesSpecialization;
  });




  return (
    <>
    {  loading ? (
      <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] center flex-col gap-2'>
        <div className="loading-animation h-16 w-16 border-b-2 border-green-500"></div>
        <div className="text-gray-500"> Loading Doctors ...</div>
      </div>
      ):(
      <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
        <Toaster position="top-right" />
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Find a Doctor</h1>
            <p className="text-muted-foreground">Browse our network of qualified healthcare professionals</p>
          </header>

          {/* Search and filters */}

          <Card className='gap-0 py-1 mt-5 mb-5'>
            <CardHeader className='pt-2'>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className=''>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-1 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-6 h-5 w-full text-sm"
                  />
                </div>



                <div className="w-full mb-3">
                  <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                    <SelectTrigger className="w-full max-h-5 text-sm">
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Doctors List */}
          <div className="space-y-3">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorsInfoCard key={doctor.id}
                  doctor={
                    {
                      id: doctor.id,
                      name: doctor.doctorProfile.fullName,
                      specialty: doctor.doctorProfile.specialization,
                      image: doctor.doctorProfile.imageUrl || "https://via.placeholder.com/150",
                      rating: 4.5, // Placeholder rating
                      reviews: 100, // Placeholder reviews count
                      location: doctor.doctorProfile.address || "Not provided",
                      availability: "Available Now" // Placeholder availability
                    }
                  } />
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

      )}
    </>



  )
}

export default Page