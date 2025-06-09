// "use server"

// import { revalidatePath } from "next/cache"

// import {
//     registerPatientInDB, 
    
//      getPatientIdByEmailInDB
// } from "@/src/controllers/Patient/Patient.controller"
// import { redirect } from "next/navigation"

// // registering th patient
// export async function registerPatient(formdata: FormData) {
//   const email = formdata.get("email") as string
//   const password = formdata.get("password") as string

//   try {
//     const newPatient = await registerPatientInDB(email, password)
//     revalidatePath("/patient/login")
//     return newPatient
//   } catch (error) {
//     console.error("Error registering patient:", error)
//     throw error
//   }
// }


// // logging in the patient

// // export async function loginPatient(formdata: FormData) {
// //   "use server"
// //   const email = formdata.get("email") as string
// //   const password = formdata.get("password") as string

// //   try {
// //     const patient = await loginPatientInDB(email, password)
// //     revalidatePath("/patient/dashboard")
// //     return patient
// //   } catch (error) {
// //     console.error("Error logging in patient:", error)
// //     throw error
// //   }
// // }

// // get patient ID from the email
// export async function getPatientIdByEmail(email: string) {
//   "use server"
//   try {
//     const id = await getPatientIdByEmailInDB(email)
//     return id
//   } catch (error) {
//     console.error("Error getting patient ID by email:", error)
//     throw error
//   }
// }