import { verifyDoctor } from "@/src/controllers/Doctor/Doctor.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();
  const result = await verifyDoctor(id);
  return NextResponse.json({ message: "Doctor verified", doctor: result });
}