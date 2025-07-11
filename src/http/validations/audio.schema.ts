import { z } from "zod/v4";

export const AudioParamsSchema = z.object({
  roomId: z.string(),
});
