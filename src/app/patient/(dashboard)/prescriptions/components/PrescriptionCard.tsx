import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";


interface PrescriptionCardProps {
    prescription: {
        id: string;
        doctor: string;
        specialty: string;
        date: string;
        appointmentDate: string;
        medications: {
            name: string;
            dosage: string;
            instructions: string;
        }[];
        notes: string;
        image?: string;
        status:string;
    };
  
    
}

const PrescriptionCard = ({ prescription }: PrescriptionCardProps) => {
    return (
        <Card className="py-0 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0">
                <div className="bg-green-50 p-2 pt-4 border-b border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={prescription.image || "/placeholder.svg"} />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                    {prescription.doctor.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">Dr. {prescription.doctor}</h3>
                                <p className="text-sm text-muted-foreground">{prescription.specialty}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Prescribed: {prescription.date}</span>
                            </div>
                            {prescription.status=="CONFIRMED" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Active</Badge>
                            ) : (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Expired</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Medications</h4>
                        <ScrollArea className="h-[150px]  pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            <div className="space-y-1">
                                {prescription.medications.map((medication, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{medication.name}</span>
                                            <span className="text-sm">{medication.dosage}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {medication.instructions || "No specific instructions"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {prescription.notes && (
                        <div className="mb-4">
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Doctor's Notes</h4>
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <p className="text-sm">{prescription.notes}</p>
                            </div>
                        </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Prescribed On: {prescription.appointmentDate}</span>
                        </div>
                        <Button variant="outline" size="sm" className="text-green-600 h-5">
                            <Download className="h-3 w-3 mr-1" /> Download PDF
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PrescriptionCard;