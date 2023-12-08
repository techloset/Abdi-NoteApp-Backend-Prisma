import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import prisma from "@/prisma";
import { compare } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await connectDB();

    // Check if email already exists
    const existingUserByEmail: any = await prisma.user.findUnique({
      where: { email: email },
    });

    // return NextResponse.json(
    //   { existingUserByEmail },
    //   { status: 401 } // Use status: 401 for unauthorized access
    // );

    if (!existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Invalid Credentials" },
        { status: 401 } // Use status: 401 for unauthorized access
      );
    }

    const isMatch = compare(password, existingUserByEmail.hashedPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Password doesn't match" },
        { status: 401 } // Use status: 401 for unauthorized access
      );
    }

    const token = jwt.sign({ email: email }, "asdfghjkl", {
      expiresIn: "30d",
    });

    return NextResponse.json(
      {
        existingUserByEmail,
        message: "User Login",
        token: token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error User Not Login" },
      { status: 500 }
    );
  }
}
