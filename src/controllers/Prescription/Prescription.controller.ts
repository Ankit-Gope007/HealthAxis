import { prisma } from "@/src/lib/prisma";

type medicineType = {
    name: string;
    dosage: string;
    instructions: string;
};

// Create a new prescription
export async function createPrescription(data:
    {
        appointmentId: string;
        publicNotes?: string;
        privateNotes?: string;
        medicines: medicineType[];
    }
) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: data.appointmentId },
    });

    if (!appointment || appointment.status !== "CONFIRMED") {
        throw new Error("You cannot create a prescription for this appointment.");
    }

    // Create the prescription
    const prescription = await prisma.prescription.create({
        data: {
            appointmentId: data.appointmentId,
            publicNotes: data.publicNotes,
            privateNotes: data.privateNotes,
            medicines: {
                create: data.medicines.map((medicine) => ({
                    name: medicine.name,
                    dosage: medicine.dosage,
                    instructions: medicine.instructions,
                })),
            },
        },
        include: {
            medicines: true,
        },
    });

    return prescription;
}

// Fetching a prescription for the patient
export async function getPrescriptionForPatient(appointmentId: string) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment || appointment.status !== "CONFIRMED" ) {
        throw new Error("You cannot fetch prescription for this appointment.");
    }

    // Fetch the prescription but not the private notes
    const prescription = await prisma.prescription.findFirst({
        where: { appointmentId },
        select: {
            id: true,
            publicNotes: true,
            privateNotes: false, // Exclude private notes
            medicines: {
                select: {
                    name: true,
                    dosage: true,
                    instructions: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return prescription;
}

// Fetch all prescriptions for a patient
export async function getAllPrescriptionsForPatient(patientId: string) {
    // Validate patients
    const patient = await prisma.user.findUnique({
        where:{id:patientId},
    })
    if (!patient) {
        throw new Error("Patient not found.");
    }
    // Fetch all prescriptions for the patient
    const prescriptions = await prisma.prescription.findMany({
        where: {
            appointment: {
                patientId,
                status: { in: ["CONFIRMED", "COMPLETED"] }, // Include both confirmed and completed appointments
        },
        },
        select: {
            appointment: {
                select: {
                    id: true,
                    patientId: true,
                    doctorId: true,
                    createdAt: true,
                    status: true,
                    reason: true,
                    doctor: {
                        select: {
                            id: true,
                            doctorProfile: {
                                select: {
                                    fullName: true,
                                    imageUrl: true,
                                    specialization: true,
                                },
                            },
                        },
                    },
                },
            },
            medicines:true,
            publicNotes: true,
            privateNotes: false, // Exclude private notes
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return prescriptions;
}


// Fetching a prescription for the doctor
export async function getPrescriptionForDoctor(appointmentId: string) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment || appointment.status === "PENDING") {
        throw new Error("You cannot fetch prescription for this appointment.");
    }

    // Fetch the prescription including private notes
    const prescription = await prisma.prescription.findFirst({
        where: { appointmentId },
        include: {
            medicines: true,
            appointment: {
                select: {
                    id: true,
                    patientId: true,
                    doctorId: true,
                    createdAt: true,
                    status: true,
                    reason: true,
                    patient: {
                        select: {
                            email: true,
                            patientProfile: {
                                select: {
                                    fullName: true,
                                    imageUrl: true,
                                    phone: true,
                                    address: true,
                                    dob: true,
                                    bloodGroup: true,
                                    gender: true,
                                    medicalHistory: true,
                                },
                            },
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            doctorProfile: {
                                select: {
                                    fullName: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return prescription;
}

// Fetch recent prescriptions for a doctor
export async function getRecentPrescriptionsForDoctor(doctorId: string) {
    // Validate doctor
    const doctor = await prisma.user.findUnique({
        where: { id: doctorId },
    });

    if (!doctor) {
        throw new Error("Doctor not found.");
    }

    // Fetch recent prescriptions for the doctor
    const prescriptions = await prisma.prescription.findMany({
        where: {
            appointment: {
                doctorId,
                status: "CONFIRMED",
            },
        },
        include: {
            appointment: {
                select: {
                    id: true,
                    patientId: true,
                    doctorId: true,
                    createdAt: true,
                    status: true,
                    patient: {
                        select: {
                            email: true,
                            patientProfile: {
                                select: {
                                    fullName: true,
                                    imageUrl: true,
                                    phone: true,
                                    address: true,
                                    dob: true,
                                },
                            },
                        },
                    },
                    doctor: {
                        select: {
                            id: true,
                            doctorProfile: {
                                select: {
                                    fullName: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },

                },
            },
            medicines: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10, // Limit to 10 recent prescriptions
    });

    return prescriptions;
}

// writing / updating public and private notes
export async function updatePatientNotes(appointmentId: string, publicNotes?: string, privateNotes?: string) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment || appointment.status !== "CONFIRMED") {
        throw new Error("You cannot update notes for this appointment.");
    }

    // Update the prescription notes
    const updatedPrescription = await prisma.prescription.update({
        where: { appointmentId },
        data: {
            publicNotes,
            privateNotes,
        },
        include: {
            medicines: true,
        },
    });

    return updatedPrescription;
}

// Updating only the medicines in a prescription
export async function updateMedicines(appointmentId: string, medicines: medicineType[]) {
    // Validate appointment
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment || appointment.status !== "CONFIRMED") {
        throw new Error("You cannot update medicines for this appointment.");
    }

    // Update the prescription medicines
    const updatedPrescription = await prisma.prescription.update({
        where: { appointmentId },
        data: {
            medicines: {
                deleteMany: {}, // Clear existing medicines
                create: medicines.map((medicine) => ({
                    name: medicine.name,
                    dosage: medicine.dosage,
                    instructions: medicine.instructions,
                })),
            },
        },
        include: {
            medicines: true,
        },
    });

    return updatedPrescription;
}