import { Prisma } from "@/generated/prisma/client";
import { ConflictError, HttpError, NotFoundError } from "@/shared/errors";

type PrismaOperationMessages = {
  unique?: string;
  notFound?: string;
  foreignKey?: string;
};

export async function executePrismaOperation<T>(
  operation: () => Promise<T>,
  messages: PrismaOperationMessages = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const mappedError = mapPrismaKnownRequestError(error, messages);

    if (mappedError) {
      throw mappedError;
    }

    throw error;
  }
}

export function mapPrismaKnownRequestError(
  error: unknown,
  messages: PrismaOperationMessages = {}
): HttpError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code === "P2002") {
    return new ConflictError(
      messages.unique ?? "Conflito ao processar recurso",
      buildPrismaErrorDetails(error)
    );
  }

  if (error.code === "P2025") {
    return new NotFoundError(
      messages.notFound ?? "Recurso nao encontrado",
      buildPrismaErrorDetails(error)
    );
  }

  if (error.code === "P2003") {
    return new NotFoundError(
      messages.foreignKey ?? "Recurso relacionado nao encontrado",
      buildPrismaErrorDetails(error)
    );
  }

  return null;
}

function buildPrismaErrorDetails(
  error: Prisma.PrismaClientKnownRequestError
): Record<string, unknown> {
  return {
    prisma: {
      code: error.code,
      meta: error.meta ?? {},
    },
  };
}
