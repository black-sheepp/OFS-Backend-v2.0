import { Request, Response } from "express";
import { uploadSingleFile, uploadMultipleFile } from "../../middleware/uploadFiles";
import { bucket } from "../../config/firebase";
import { v4 as uuidv4 } from "uuid";

// Upload single file
export const uploadFile = (req: Request, res: Response) => {
  uploadSingleFile(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    const file = req.file;
    const blob = bucket.file(`images/${uuidv4()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      res.status(500).send({ error: error.message });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ fileName: file.originalname, fileLocation: publicUrl });
    });

    blobStream.end(file.buffer);
  });
};

// Upload multiple files
export const uploadFiles = (req: Request, res: Response) => {
  uploadMultipleFile(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ error: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];
    const uploadPromises = files.map(file => {
      const blob = bucket.file(`images/${uuidv4()}_${file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise<string>((resolve, reject) => {
        blobStream.on("error", (error) => reject(error));
        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });
        blobStream.end(file.buffer);
      });
    });

    try {
      const publicUrls = await Promise.all(uploadPromises);
      res.status(200).send({ files: publicUrls });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
};
