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

    const newBuyTask = await prisma.buyTask.create({
      data: {
        title,
        isChecked,
        currentUserId,
      },
    });

    return NextResponse.json({ newBuyTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating Task" },
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
        buyTasks: true,
      },
    });

    const buyTasks = user?.buyTasks || [];

    return NextResponse.json({ buyTasks }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, isChecked } = body;

    // return NextResponse.json({ id, isChecked });

    const updatedItem = await prisma.buyTask.update({
      where: { id: id },
      data: { isChecked: isChecked },
    });

    const serializedItem = {
      ...updatedItem,
      id: updatedItem,
    };

    return NextResponse.json({ message: "Item updated", item: serializedItem });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Item cannot be updated" },
      { status: 409 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const deleteitem = await prisma.buyTask.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Item Deleted", deleteitem });
  } catch (error) {
    return NextResponse.json({ message: "Item cannot deleted Deleted" });
  }
}
