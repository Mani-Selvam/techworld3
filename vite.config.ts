import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    root: path.resolve(__dirname, "client"),
    // Serve/copy static assets from repo-level /public (manifest, sw.js, etc.)
    publicDir: path.resolve(__dirname, "public"),
    base: "./",
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client/src"),
            "@shared": path.resolve(__dirname, "shared"),
            "@assets": path.resolve(__dirname, "attached_assets"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5000,
        allowedHosts: true,
        hmr: {
            clientPort: 443,
        },
        fs: {
            allow: [".", "../attached_assets", "../shared", "../public"],
        },
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true,
        target: "esnext",
        minify: "terser",
        cssCodeSplit: true,
        reportCompressedSize: false,
        sourcemap: false,
        rollupOptions: {
            output: {
                chunkFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    ui: [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                    ],
                    animations: ["framer-motion"],
                },
            },
        },
    },
});
