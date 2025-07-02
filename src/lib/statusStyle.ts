import { CANCELLED } from "dns";
import { string } from "zod";

// Define styles for different appointment statuses
const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-300",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};
export const getStatusStyle = (status: string) => {
    return statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
};