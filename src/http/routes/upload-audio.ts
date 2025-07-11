import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connections.ts";
import { schema } from "../../db/schema/index.ts";
import { AudioParamsSchema } from "../validations/audio.schema.ts";
import { transcribeAudio } from "../../services/gemini.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: AudioParamsSchema,
      },
    },
    async (request) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error("Audio is required");
      }

      //Transcrever o áudio
      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );

      console.log(transcription)

      return { transcription };

      // Gerar o vetor semântico / embeddings

      // Armazenar os vetores no banco de dados
    }
  );
};
