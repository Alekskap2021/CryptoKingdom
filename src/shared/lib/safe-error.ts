const SAFE_MESSAGES = new Set([
 "API key not found",
 "id is required",
 "Too many requests. Please try again later.",
 "Unauthorized",
]);

/**
 * Returns a user-safe error message. Known safe messages pass through;
 * Zod validation errors are formatted; everything else gets a generic fallback.
 */
export function toSafeMessage(
 error: unknown,
 fallback = "Something went wrong. Please try again.",
): string {
 if (error instanceof Error) {
  if (SAFE_MESSAGES.has(error.message)) return error.message;

  if (error.name === "ZodError" && "issues" in error) {
   const issues = (error as { issues: Array<{ message: string }> }).issues;
   return issues.map((i) => i.message).join("; ");
  }
 }

 return fallback;
}

/**
 * Wraps an async server handler to sanitize thrown errors.
 * Only safe/known messages are forwarded; unexpected errors get a generic message.
 */
export function withSafeErrors<TArgs extends unknown[], TReturn>(
 fn: (...args: TArgs) => Promise<TReturn>,
 fallback?: string,
): (...args: TArgs) => Promise<TReturn> {
 return async (...args: TArgs) => {
  try {
   return await fn(...args);
  } catch (error) {
   console.log("🚀 ~ withSafeErrors ~ error: ", error);
   throw new Error(toSafeMessage(error, fallback));
  }
 };
}
