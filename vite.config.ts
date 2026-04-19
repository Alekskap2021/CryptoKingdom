import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const config = defineConfig({
 plugins: [
  devtools(),
  tailwindcss(),
  tanstackStart({
   router: {
    entry: "./app/router.tsx",
    generatedRouteTree: "./routeTree.gen.ts",
    routesDirectory: "./pages",
   },
  }),
  viteReact(),
  svgr({
   include: "**/*.svg?react",
   svgrOptions: { icon: true, exportType: "default", dimensions: false },
  }),
 ],
 resolve: { tsconfigPaths: true },
});

export default config;
