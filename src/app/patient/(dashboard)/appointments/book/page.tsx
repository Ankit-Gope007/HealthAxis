import {auth} from "@/auth";
import {prisma} from "@/src/lib/prisma";
import {redirect} from "next/navigation";
import PatientBookClient from "./PatientBookClient";



export default async function BookAppointment() {
    // First get the session on the server to check if user is authenticated
    const session = await auth();
    if(!session?.user?.id) redirect ("/login"); //If not authenticated, redirect to login

    // So i need patient profile info and doctors info ..
    const [profile, doctors] = await Promise.all([
        prisma.patientProfile.findUnique({
            where:{id: session.user.id},
            select: {id:true}
        }),

        prisma.user.findMany({
            where: { role: "DOCTOR", profileSetup: true },
            select:{
                id: true,
                doctorProfile:{
                    select:{
                        fullName: true,
                        specialization: true,
                        imageUrl: true,
                        address: true,
                        consultationFee: true,
                        experience: true
                    }
                }
            }
        })
    ]);



    return(
        <PatientBookClient
        doctors= {doctors}
        patientId = {profile?.id || ""}
        />

    )

}