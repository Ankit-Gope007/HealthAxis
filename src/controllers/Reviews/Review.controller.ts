import { prisma } from "@/src/lib/prisma";


// Register a new review
export async function registerReview(reviewData: {
    patientId: string;
    doctorId: string;
    rating: number;
    comment?: string;
}) {
    try {
        const { patientId, doctorId, rating, comment } = reviewData;

        // Validate input data
        if (!patientId || !doctorId || rating < 1 || rating > 5) {
            throw new Error("Invalid input data");
        }

        // check if review by same patient for the same doctor already exists
        const existingReview = await prisma.review.findFirst({
            where: {
                patientId,
                doctorId,
            },
        });

        if (existingReview) {
            throw new Error("Review by this patient for this doctor already exists");
        }

        // Create a new review in the database
        const newReview = await prisma.review.create({
            data: {
                patientId,
                doctorId,
                rating,
                comment,
            },
        });

        return newReview;
    } catch (error) {
        console.error("Error registering review:", error);
        throw error;
    }
}

// check if patient has already reviewed the doctor
export async function hasPatientReviewedDoctor(patientId: string, doctorId: string) {
    try {
        const review = await prisma.review.findFirst({
            where: {
                patientId,
                doctorId,
            },
        });

        return review !== null; // Returns true if a review exists, false otherwise
    } catch (error) {
        console.error("Error checking if patient has reviewed doctor:", error);
        throw error;
    }
}

// fetch all the reviews for a doctor
export async function getReviewsByDoctorId(doctorId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                doctorId,
            },
            include: {
                patient: {
                    select: {
                        patientProfile: {
                            select: {
                                fullName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // If no reviews found, return an empty array
        if (!reviews || reviews.length === 0) {
            return [];
        }

        return reviews;
        
    } catch (error) {
        console.error("Error fetching reviews by doctor ID:", error);
        throw error;
        
    }
}