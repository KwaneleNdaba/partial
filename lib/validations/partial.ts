import * as z from "zod";

export const PartialValidation = z.object({
  partial: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  partial: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});