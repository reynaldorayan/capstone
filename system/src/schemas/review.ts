import z from "zod";

export const reviewSchema = z
  .object({
    isUsedAlias: z.boolean(),
    userId: z.string().optional(),
    alias: z.string().optional(),
    comment: z
      .string()
      .min(1, {
        message: "Please write a review",
      })
      .min(15, {
        message: "Your review is too short",
      })
      .max(500, {
        message: "Your review is too long",
      }),
  })
  .superRefine((data, ctx) => {
    if (!Boolean(data.isUsedAlias) && !data.userId) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only logged in users can post reviews without alias",
        path: ["userId"],
      });
    }

    if (Boolean(data.isUsedAlias) && !data.alias) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Alias is required",
        path: ["alias"],
      });
    }
  });

export type ReviewInput = z.infer<typeof reviewSchema>;
