import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            name: "validator",
            entry: resolve(__dirname, "src", "index.ts"),
            fileName: (format) => `validator.${format}.js`,
            formats: ["es", "cjs", "umd"],
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            copyDtsFiles: true,
        }),
    ],
});
