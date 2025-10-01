import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { dts } from "rollup-plugin-dts";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

const isWatchMode = process.env.ROLLUP_WATCH === "true";

const config = [
    {
        input: "index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve({
                browser: true,
            }),
            typescript({
                tsconfig: "./tsconfig.json",
                exclude: ["**/*.test.*", "**/*.stories.*"],
            }),
        ],
        external: ["react", "react-dom"],
    },
];

// watch 모드가 아닐 때만 타입 정의 번들링 추가
if (!isWatchMode) {
    config.push({
        input: "dist/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    });
}

export default config;
