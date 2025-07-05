import React from 'react'
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusStyle } from '@/src/lib/statusStyle';

type Prescription = {
    id: string;
    patient: string;
    age: string;
    medication: string;
    frequency: string;
    date: string;
    status: string;
    image: string;
}



const PrescriptionCard = ({
    id,
    patient,
    age,
    medication,
    frequency,
    date,
    status,
    image
}: Prescription
) => {
    return (
        <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={image} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                        {patient.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{patient}</p>
                    <p className="text-sm text-muted-foreground">Age: {age}</p>
                    <p className="text-sm font-medium text-green-600">{medication}</p>
                    <p className="text-xs text-muted-foreground">{frequency}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Prescribed</p>
                    <p className="text-sm font-medium">{date}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={`${getStatusStyle(status)}  text-xs`}>
                        {status}
                    </Badge>
                    <Button className='h-5 px-2' variant="outline" asChild>
                        <Link href={`/doctor/prescriptions/${id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionCard