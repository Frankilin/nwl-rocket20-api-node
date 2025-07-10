import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connections.ts";
import { CreateRoomSchema } from "../validations/create-room.schema.ts";
import { schema } from "../../db/schema/index.ts";

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms",
    {
      schema: { body: CreateRoomSchema },
    },
    async (request, reply) => {
      const { name, description } = request.body;

      const result = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning();

      const insertedRoom = result[0];

      if (!insertedRoom) {
        throw new Error("Failed to create new room.");
      }

      return reply.status(201).send({ roomId: insertedRoom.id });
    }
  );
};
