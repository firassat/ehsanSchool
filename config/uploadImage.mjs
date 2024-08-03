import stream from "stream";
import { google } from "googleapis";

export const upload = async (file) => {
  const KEYFILEPATH = "./googleEhsanFile.json";
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);
  const { data } = await google.drive({ version: "v3", auth }).files.create({
    media: {
      mimeType: file.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: file.originalname,
      parents: ["1rHfSLJTPxLBAWjNDsau5mRR8RIPgEV4c"],
    },
    fields: "id,name",
  });

  return data;
};
