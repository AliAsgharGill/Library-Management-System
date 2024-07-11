import { z } from "zod";
export const searchSchema = z.object({
  search: z
    .string()
    .min(3, { message: "Search must be at least 3 characters long." })
    .max(10, { message: "Search must be at most 10 characters long." })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Search can only contain letters, numbers, and underscores.",
    }),
});
