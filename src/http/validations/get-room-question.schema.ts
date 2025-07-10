import { z } from "zod/v4";

export const getRoomQuestionSchema = z.object({
  roomId: z.string(),
});
