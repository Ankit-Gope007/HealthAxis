"use client"
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Star, MapPin } from 'lucide-react'
import Link from 'next/link'

type DoctorsInfoCardProps = {
    doctor: {
        id: string;
        name: string;
        specialty: string;
        image: string;
        rating: number;
        reviews: number;
        location: string;
        availability: string;
    }
}


const DoctorsInfoCard = ({ doctor }: {
    doctor: DoctorsInfoCardProps['doctor'];
}) => {



    return (
        <Card key={doctor.id} className="overflow-hidden py-0  hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <div className="flex h-full  flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-gray-50  p-3 flex justify-center items-center">
                        <Avatar className="h-24 w-24 ">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback className="bg-health-100 text-health-700 text-xl">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-full md:w-3/4  p-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                <p className="text-muted-foreground">{doctor.specialty}</p>
                            </div>
                            {/* <div className="flex  items-center mt-2 md:mt-0 gap-2">
                                <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" /> {doctor.rating}
                                </Badge>
                                <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                            </div> */}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <MapPin className="h-4 w-4 mr-1 text-health-500" /> {doctor.location}
                        </div>

                        <Separator className="my-1" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                            <Button asChild className="bg-[#007BFF] h-5 hover:bg-[#007BFF] text-white">
                                <Link href={`/patient/doctors/${doctor.id}`}>
                                    View Doctor
                                </Link>
                            </Button>
                            
                            <Button asChild className="bg-[#28A745] h-5 hover:bg-[#28A745] text-white">
                                <Link href={`/patient/appointments/book/${doctor.id}`}>
                                    Book Appointment
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DoctorsInfoCard