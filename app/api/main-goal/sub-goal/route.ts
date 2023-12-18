import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { title, isChecked, mainGoalId } = await req.json();

    if (!title || !mainGoalId) {
      return NextResponse.json(
        { message: "Invalid Data", title, isChecked, mainGoalId },
        { status: 422 }
      );
    }

    // return;
    await connectDB();

    const newSubGoal = await prisma.subGoal.create({
      data: {
        title,
        isChecked,
        mainGoalId,
      },
    });

    return NextResponse.json({ newSubGoal }, { status: 201 });
  } catch (error) {
    console.error("Error creating Sub Goal:", error);
    return NextResponse.json(
      { message: "Error creating Sub Goal" },
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
    const user = await prisma.mainGoal.findUnique({
      where: {
        id: id,
      },
      include: {
        subGoals: true,
      },
    });

    const subGoals = user?.subGoals || [];

    return NextResponse.json({ subGoals }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, isChecked } = body;

    // return NextResponse.json({ id, isChecked });

    const updatedItem = await prisma.subGoal.update({
      where: { id: id },
      data: { isChecked: isChecked },
    });

    const serializedItem = {
      ...updatedItem,
      id: updatedItem,
    };

    return NextResponse.json({
      message: "sub goal updated",
      item: serializedItem,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "sub goal cannot be updated" },
      { status: 409 }
    );
  }
}
