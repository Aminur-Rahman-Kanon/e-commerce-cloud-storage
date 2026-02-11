import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function validateImage(img: File){
    
    try {
        const buffer = Buffer.from(await img.arrayBuffer());
        const type = await fileTypeFromBuffer(buffer);
    
        if (!type) {
            throw new Error("Invalid image file");
        }
    
        const cleanBuffer = await sharp(buffer)
            .resize(2048, 2048, { fit: 'inside' })
            .toFormat("png", { quality: 85 })
            .toBuffer()

        return cleanBuffer;
    } catch (error) {
        return;
    }
}

export async function saveImgToDisk(file: File, uploadDir: string, fileName: string) {
    if (!file || !uploadDir || !fileName) throw new Error('invalid request');
    
    try {
        const cleanBuffer = await validateImage(file);

        if (cleanBuffer){
            fs.mkdirSync(uploadDir, { recursive: true });
            fs.writeFileSync(path.join(uploadDir, fileName), cleanBuffer);
            return;
        }
        else {
            throw new Error('forbidden')
        }
    } catch (error) {
        throw new Error(String(error))
    }
}

export function sanitizeDirName(input: string, maxWords = 15): string {
  const cleaned = input
    .normalize("NFKD")
    // Remove emojis & pictographic symbols
    .replace(/\p{Extended_Pictographic}/gu, "")
    // Remove non-word symbols except spaces & hyphens
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned
    .toLowerCase()
    .split(" ")
    .slice(0, maxWords);

  return words.join(" ");
}

export function sanitizeStorageKey(
  input: string,
  maxWords = 10
): string {
  return input
    .normalize("NFKD")
    // Remove diacritics
    .replace(/[\u0300-\u036f]/g, "")
    // Remove everything except ASCII letters, numbers, space, hyphen
    .replace(/[^a-zA-Z0-9\s-&]/g, "")
    // Collapse spaces
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .slice(0, maxWords)
    .join(" ");
}



export function safeUnlink(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn("File does not exist:", filePath);
      return;
    }

    fs.unlinkSync(filePath);
  } catch (err: any) {
    switch (err.code) {
      case "EACCES":
      case "EPERM":
        console.error("Permission error:", filePath);
        break;

      case "EBUSY":
        console.error("File is in use:", filePath);
        break;

      case "EISDIR":
        console.error("Path is a directory, not a file:", filePath);
        break;

      default:
        console.error("Unexpected unlink error:", err);
    }
  }
}
