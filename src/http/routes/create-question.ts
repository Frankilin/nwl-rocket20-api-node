import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connections.ts";
import { schema } from "../../db/schema/index.ts";
import {
  CreateQuestionSchema,
  CreateQuestionParamsSchema,
} from "../validations/create-question.schema.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        body: CreateQuestionSchema,
        params: CreateQuestionParamsSchema,
      },
    },
    async (request, reply) => {
      const { question } = request.body;
      const { roomId } = request.params;

      const result = await db
        .insert(schema.questions)
        .values({ question, roomId })
        .returning();

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        throw new Error("Failed to create new question.");
      }

      return reply.status(201).send({ roomId: insertedQuestion.id });
    }
  );
};
