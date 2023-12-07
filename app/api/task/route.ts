import prisma from "@/prisma";
import { connectDB } from "@/src/lib/connectDB";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { title, description, category, active, completed, currentUserId } =
      await req.json();

    if (
      !title ||
      !description ||
      !category ||
      !currentUserId ||
      !completed ||
      !active
    )
      return NextResponse.json({ message: "Invalid Data" }, { status: 422 });

    const isActive = active === 1;
    const isCompleted = completed === 1;

    //   return NextResponse.json({ message: 'done' }, { status: 200 })

    await connectDB();

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        category,
        active: isActive,
        completed: isCompleted,
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
  } finally {
    await prisma.$disconnect();
  }
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  //   const search = searchParams.get("id");
  // const items = await prisma.task.findMany();

  return NextResponse.json({ id }, { status: 200 });

  //   try {

  //   } catch (error) {
  //     console.error(error);
  //     return NextResponse.json({ message: 'Error retrieving items' }, { status: 500 });
  //   }
}

// export const GET = async (req: Request) => {
//    try {
//      const body = await req.json();

//     console.log('====================================');
//     console.log(body);
//     console.log('====================================');
//     return NextResponse.json(body);

//    } catch (error) {
//     console.log('error', error)
//    }

//     return NextResponse.json('body');
//     await connectDB();

//     // Add an await before prisma.user.findUnique
//     const user = await prisma.user.findUnique({
//         where: {
//             id: '65719515b1e9e78693a47e60'
//         },
//         include: {
//             tasks: true
//         }
//     });

//     // Assuming 'tasks' is a property of the user object
//     const tasks = user?.tasks || [];

//     return NextResponse.json({ tasks }, { status: 201 });
// };
