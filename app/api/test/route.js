import prisma from "../../lib/prismadb";
import { NextResponse } from "next/server";

export async function POST() {
  //   await prisma.$connect();

  //   try {

  //   } catch (error) {

  //   }

  await prisma.tasks.create({
    data: {
      title: "Testing Node.js",
      description: "Create a Node.js tasks application",
    },
  });
  NextResponse.json({ message: "Item updated", item: serializedItem });
}
