import * as esbuild from "esbuild";
import { execSync } from "child_process";

// TypeScript 타입 정의 생성
console.log("Generating TypeScript declarations...");
execSync("tsc --emitDeclarationOnly --declaration --declarationDir dist", {
    stdio: "inherit",
});

// ESM 빌드 (minified)
await esbuild.build({
    entryPoints: ["index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    outfile: "dist/index.esm.js",
    external: ["react", "react-dom"],
    platform: "browser",
    target: "es2020",
});

// CommonJS 빌드 (minified)
await esbuild.build({
    entryPoints: ["index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    outfile: "dist/index.js",
    external: ["react", "react-dom"],
    platform: "browser",
    target: "es2020",
});

console.log("Build complete!");
