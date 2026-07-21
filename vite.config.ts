import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function serveCurrentWordOnly(): Plugin {
  const rejectDocx = (
    request: { url?: string },
    response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void },
    next: () => void,
  ) => {
    const pathname = new URL(request.url ?? "/", "http://local").pathname.toLowerCase();
    if (!pathname.endsWith(".docx") || pathname === "/downloads/huong-dan-qaqc.docx") {
      next();
      return;
    }

    response.statusCode = 404;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Not found");
  };

  return {
    name: "serve-current-word-only",
    configureServer(server) {
      server.middlewares.use(rejectDocx);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rejectDocx);
    },
  };
}

export default defineConfig({
  plugins: [serveCurrentWordOnly(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ["antd", "@ant-design/icons"],
        },
      },
    },
  },
});