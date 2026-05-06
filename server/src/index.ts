import "./Polyfills";

import { join } from "path";
import dotenv from "dotenv";
import path from "path";

// Always prefer repo-root .env (works even when starting from /server)
const cwd = process.cwd();
const repoRoot =
    path.basename(cwd).toLowerCase() === "server" ? path.resolve(cwd, "..") : cwd;

const rootEnvPath = join(repoRoot, ".env");
const cwdEnvPath = join(cwd, ".env");
dotenv.config({ path: rootEnvPath });
dotenv.config({ path: cwdEnvPath, override: false });

import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import fs from "fs";

const app = express();

app.use(compression());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );
    res.setHeader("Access-Control-Max-Age", "86400");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.use((req, res, next) => {
    const connectSrc =
        process.env.NODE_ENV === "development"
            ? "'self' https://wa.me ws: wss: https://*.replit.dev"
            : "'self' https://wa.me";

    const frameAncestors =
        process.env.NODE_ENV === "development"
            ? "'self' https://*.replit.dev https://*.replit.com"
            : "'self'";

    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
            `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; ` +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: blob: https: https://storage.googleapis.com https://ik.imagekit.io; " +
            `connect-src ${connectSrc}; ` +
            `frame-ancestors ${frameAncestors}`,
    );

    if (process.env.NODE_ENV === "production") {
        res.setHeader(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains",
        );
    }

    if (process.env.NODE_ENV !== "development") {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
    }

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
        "Permissions-Policy",
        "geolocation=(), microphone=(), camera=()",
    );

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a test endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        env: process.env.NODE_ENV,
        db: !!process.env.DATABASE_URL,
    });
});

app.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        if (
            req.url.match(
                /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$/,
            )
        ) {
            res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable",
            );
        } else if (req.url.includes("/assets/")) {
            res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable",
            );
        } else {
            res.setHeader(
                "Cache-Control",
                "no-cache, no-store, must-revalidate",
            );
        }
    } else {
        res.setHeader("Cache-Control", "no-store, must-revalidate");
    }
    next();
});

app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            console.log(
                `[API LOG] ${req.method} ${path} ${res.statusCode} ${duration}ms`,
            );
            if (capturedJsonResponse) {
                console.log(
                    `[API RESPONSE]`,
                    JSON.stringify(capturedJsonResponse).slice(0, 500),
                );
            }
        }
    });

    next();
});

(async () => {
    const server = await registerRoutes(app);

    app.use("/api", (_req, res) =>
        res.status(404).json({ message: "Not found" }),
    );

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
        throw err;
    });

    // In production, serve static frontend from built dist/public
    if (process.env.NODE_ENV === "production") {
        const distPath = path.resolve(__dirname, "../../dist/public");
        if (fs.existsSync(distPath)) {
            app.use(express.static(distPath));
            app.use("*", (_req, res) => {
                res.sendFile(path.resolve(distPath, "index.html"));
            });
        }
    }

    const port = parseInt(process.env.PORT || "3000", 10);
    const isWindows = process.platform === "win32";

    const listenOptions = {
        port,
        host: "0.0.0.0",
        ...(isWindows ? {} : { reusePort: true }),
    };

    server.listen(listenOptions, () => {
        console.log(`[api] serving on port ${port}`);
    });
})();
