import { build } from "esbuild";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

const baseConfig = {
    entryPoints: ["index.ts"],
    bundle: true,
    external: ["react", "react-dom"],
    sourcemap: true,
    minify: true,
    target: ["es2020"],
    jsx: "automatic",
};

// CJS build
await build({
    ...baseConfig,
    format: "cjs",
    outfile: packageJson.main,
    platform: "node",
});

// ESM build
await build({
    ...baseConfig,
    format: "esm",
    outfile: packageJson.module,
    platform: "neutral",
});

// TypeScript 타입 정의는 tsc로 생성
import { execSync } from "child_process";
execSync("tsc --emitDeclarationOnly --declaration --outDir dist", {
    stdio: "inherit",
});

console.log("✅ Build completed successfully!");
