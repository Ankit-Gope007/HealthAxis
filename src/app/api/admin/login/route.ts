import { NextResponse } from "next/server";
import { loginAdmin } from "@/src/controllers/Admin/Admin.controller";



export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await loginAdmin(body);
        
        if (!result) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        
        return NextResponse.json({ message: "Admin logged in successfully", data: result }, { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/admin/login:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}