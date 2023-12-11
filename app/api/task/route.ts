import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { title, description, category, active, currentUserId } =
      await req.json();

    if (!title || !description || !category || !currentUserId || !active) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 422 });
    }

    await connectDB();

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        category,
        active,
        completed: false,
        currentUserId,
      },
    });

    return NextResponse.json({ newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating Task" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        tasks: true,
      },
    });

    const tasks = user?.tasks || [];

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};
