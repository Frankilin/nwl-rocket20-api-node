import { z } from "zod/v4";

export const CreateRoomSchema = z.object({
  name: z.string().min(1, "Nome da sala é obrigatório"),
  description: z.string().optional(),
});
