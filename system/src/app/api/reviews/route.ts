import db, { prismaErrorHandler } from "@/lib/prisma";
import { reviewSchema } from "@/schemas/review";
import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse as response } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const reviews = await db.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    return response.json(reviews);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validation = reviewSchema.safeParse(data);

    const { isUsedAlias, comment, alias, userId } = validation.data;

    let reviewCreate: Prisma.ReviewCreateInput = {
      comment,
    };

    if (isUsedAlias) {
      reviewCreate.alias = alias;
    } else {
      reviewCreate.user = {
        connect: {
          id: userId,
        },
      };
    }

    console.log(validation.data);

    await db.review.create({ data: reviewCreate });

    return response.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
