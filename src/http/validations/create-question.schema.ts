import { z } from "zod/v4";

export const CreateQuestionSchema = z.object({
  question: z.string().min(1),
});

export const CreateQuestionParamsSchema = z.object({
  roomId: z.string(),
});
