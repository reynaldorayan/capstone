import { writeFile, constants, access, unlink } from "fs/promises";
import { UPLOADS_DIR } from "@/constants";
import cuid from "cuid";

export async function fileExists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export async function moveFile(file: File): Promise<string> {
  const bytes = await (file as File).arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${cuid()}-${new Date().getTime()}.${
    file.type.split("/")[1]
  }`;

  await writeFile(`${UPLOADS_DIR}/${fileName}`, buffer);

  return fileName;
}

export async function deleteFile(fileName: string) {
  const path = `${UPLOADS_DIR}/${fileName}`;

  if (!fileExists(path)) return;

  await unlink(`${UPLOADS_DIR}/${fileName}`);
}
