import { spawn } from "child_process";
import path from "path";

const isWindows = process.platform === "win32";
const bin = isWindows ? "tsx.cmd" : "tsx";
const tsxPath = path.resolve("..", "node_modules", ".bin", bin);

const child = isWindows
    ? spawn("cmd.exe", ["/c", tsxPath, "watch", "src/index.ts"], {
          stdio: "inherit",
      })
    : spawn(tsxPath, ["watch", "src/index.ts"], {
          stdio: "inherit",
      });

child.on("exit", (code) => {
    process.exit(code ?? 0);
});
