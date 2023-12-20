import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { bannerImage, currentUserId } = await req.json();

    if (!bannerImage) {
      return NextResponse.json(
        { message: "Invalid Data", bannerImage },
        { status: 422 }
      );
    }

    await connectDB();

    const image = await prisma.guidanceImageModel.create({
      data: {
        image: bannerImage,
        currentUserId,
      },
    });

    return NextResponse.json(
      { message: "Image updated", image },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json(
      { message: "Error adding image" },
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
        guidanceImageModel: true,
      },
    });

    const guidanceImageModel = user?.guidanceImageModel || [];

    return NextResponse.json({ guidanceImageModel }, { status: 200 });
  } catch (error) {
    console.log("error", error);
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, bannerImage } = body;

    const updatedItem = await prisma.guidanceImageModel.update({
      where: { id: id },
      data: { image: bannerImage },
    });

    return NextResponse.json(
      { message: "Image updated", updatedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Image cannot be updated" },
      { status: 409 }
    );
  }
}
