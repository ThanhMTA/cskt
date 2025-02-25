import { createError } from "@directus/errors";

// 400
// 409

interface ForbiddenErrorExtensions {
  message: string;
}

interface ConflictErrorExtensions {
  message: string;
}

interface BadRequestErrorExtensions {
  message: string;
}

interface NotFoundErrorExtensions {
  message: string;
}

interface InternalServerErrorExtensions {
  message: string;
}
const messageConstructor = (
  extensions:
    | ForbiddenErrorExtensions
    | ConflictErrorExtensions
    | BadRequestErrorExtensions
    | NotFoundErrorExtensions
    | InternalServerErrorExtensions
) => `${extensions.message}`;
const BadRequestErrors = createError<BadRequestErrorExtensions>(
  "BAD_REQUEST",
  messageConstructor,
  400
);
const ForbiddenErrors = createError<ForbiddenErrorExtensions>(
  "FORBIDDEN",
  messageConstructor,
  403
);
const NotFoundErrors = createError<NotFoundErrorExtensions>(
  "NOT_FOUND",
  messageConstructor,
  404
);
const ConflictErrors = createError<ConflictErrorExtensions>(
  "CONFLICT",
  messageConstructor,
  409
);
const InternalServerErrorErrors = createError<InternalServerErrorExtensions>(
  "INTERNAL_SERVER_ERROR",
  messageConstructor,
  500
);
export {
  BadRequestErrors,
  ForbiddenErrors,
  NotFoundErrors,
  ConflictErrors,
  InternalServerErrorErrors,
};
