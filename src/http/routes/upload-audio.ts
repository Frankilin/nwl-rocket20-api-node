import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connections.ts";
import { schema } from "../../db/schema/index.ts";
import { AudioParamsSchema } from "../validations/audio.schema.ts";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: AudioParamsSchema,
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error("Audio is required");
      }

      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");

      //Transcrever o áudio
      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );

      // Gerar o vetor semântico / embeddings
      const embeddings = await generateEmbeddings(transcription);

      // Armazenar os vetores no banco de dados
      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error("Erro ao salvar chunk de áudio");
      }

      return reply.status(201).send({ chunkId: chunk.id });

      //return { transcription, embedding };
    }
  );
};
