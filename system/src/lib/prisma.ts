import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;

export function prismaErrorHandler(error: PrismaClientKnownRequestError) {
  const { code, meta } = error;

  const field = meta?.target as string;

  console.error(
    "field: " + field[0],
    "model: " + (meta?.modelName as string).toLowerCase()
  );

  switch (code) {
    case "P2002":
      return {
        error: {
          [field[0] || (meta?.modelName as string).toLowerCase()]: [
            "Already in used",
          ],
        },
      };
    case "P2003":
      console.log(error);
      return {
        error: {
          [(meta?.modelName as string).toLowerCase()]: ["Already in used"],
        },
      };
    case "P2025":
      return {
        success: false,
        message: "Data not found",
        error: {
          [field[0] || (meta?.modelName as string).toLowerCase()]: [
            "Not found",
          ],
        },
      };

    default:
      return {
        error: {
          [(meta?.modelName as string).toLowerCase()]: [
            `An unexpected error occurred.Please try again later.`,
          ],
        },
      };
  }
}
