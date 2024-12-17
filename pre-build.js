import { randomBytes } from "crypto";
import { promises as fs, mkdirSync, rm, rmSync } from "fs";
import { promisify } from "util";
import { exec } from "child_process";

const execProc = promisify(exec);

try {
  rmSync("./src-tauri/res/", { recursive: true }, (_) => {});
} catch {}

mkdirSync("./src-tauri/res/sidecars", { recursive: true });
mkdirSync("./src-tauri/res/resources", { recursive: true });

async function generateCompressibleBinaryFile(filename, sizeInMB) {
  const fileBuffer = Buffer.alloc(Math.round(sizeInMB * 1024 * 1024));
  const blockSize = 7;
  for (let i = 0; i < fileBuffer.length; i += blockSize) {
    const byte = Math.round(Math.random() * 1000);
    for (let j = 0; j < blockSize; j++) {
      fileBuffer[i + j] = byte;
    }
  }

  await fs.writeFile(filename, fileBuffer, "binary");
}

(async () => {
  await generateCompressibleBinaryFile(
    "./src-tauri/res/resources/first.db",
    25
    // 680
  );
})();

(async () => {
  await generateCompressibleBinaryFile(
    "./src-tauri/res/resources/second.bin",
    0.2
  );
})();

(async () => {
  await generateCompressibleBinaryFile(
    "./src-tauri/res/resources/third.db",
    13
    // 650
  );
})();

(async () => {
  await generateCompressibleBinaryFile(
    "./src-tauri/res/resources/fourth.db",
    0.15
  );
})();

const getTargetTriple = async () => {
  const { stdout } = await execProc("rustc -vV");

  const targetTriple = /host: (\S+)/g.exec(stdout)[1];
  if (!targetTriple) {
    throw new Error("Failed to determine platform target triple");
  }

  return targetTriple;
};

(async () => {
  const buf = randomBytes(61 * 1024 * 1024);
  const targetTriple = await getTargetTriple();
  const name = "app";
  const ext = process.platform === "win32" ? ".exe" : "";
  const appName = `${name}-${targetTriple}${ext}`;
  await fs.writeFile(`./src-tauri/res/sidecars/${appName}`, buf, "binary");
})();
