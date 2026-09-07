import { Readable } from "stream";
import cloudinary from "../cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadImage = (
  buffer: Buffer,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      },
    );

    Readable.from(buffer).pipe(stream);
  });
};
