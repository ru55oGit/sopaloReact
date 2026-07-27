import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

// Los assets de Imaginalo (Funkos/Escudos/Sombras/Logos) son componentes SVG
// con JSX guardados con extensión .js (no .jsx). Vite necesita este plugin
// para tratarlos como JSX, igual que hace imaginaloReact.
const jsxInSvgJs = {
  name: "jsx-in-svg-js",
  enforce: "pre" as const,
  async transform(code: string, id: string) {
    if (!/src\/components\/SVG\/.*\.js$/.test(id)) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
};

export default defineConfig({
  plugins: [jsxInSvgJs, react()],
  optimizeDeps: {
    esbuildOptions: {
      // El escaneo inicial de dependencias de Vite usa su propio esbuild y
      // no pasa por el plugin de arriba, así que necesita este mismo aviso
      // para no romper al toparse con JSX en los .js de SVG/.
      loader: { ".js": "jsx" },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
});
