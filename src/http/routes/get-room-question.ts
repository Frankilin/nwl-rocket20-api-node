import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connections.ts";
import { schema } from "../../db/schema/index.ts";
import { getRoomQuestionSchema } from "../validations/get-room-question.schema.ts";
import { desc, eq } from "drizzle-orm";

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId/questions",
    {
      schema: { params: getRoomQuestionSchema },
    },
    async (request) => {
      const { roomId } = request.params;

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createAt));

      return result;
    }
  );
};
