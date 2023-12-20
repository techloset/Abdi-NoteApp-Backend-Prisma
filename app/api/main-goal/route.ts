import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { title, isChecked, currentUserId } = await req.json();

    if (!title || !currentUserId) {
      return NextResponse.json(
        { message: "Invalid Data", title, isChecked, currentUserId },
        { status: 422 }
      );
    }

    // return;
    await connectDB();

    const newMainGoal = await prisma.mainGoal.create({
      data: {
        title,
        isChecked,
        currentUserId,
      },
    });

    return NextResponse.json({ newMainGoal }, { status: 201 });
  } catch (error) {
    console.error("Error creating Main Goal:", error);
    return NextResponse.json(
      { message: "Error creating Main Goal" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        mainGoals: true,
      },
    });

    const mainGoals = user?.mainGoals || [];

    return NextResponse.json({ mainGoals }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, isChecked } = body;

    const updatedItem = await prisma.mainGoal.update({
      where: { id: id },
      data: { isChecked: isChecked },
    });

    const serializedItem = {
      ...updatedItem,
      id: updatedItem,
    };

    return NextResponse.json({
      message: "main goal updated",
      item: serializedItem,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "main goal cannot be updated" },
      { status: 409 }
    );
  }
}
