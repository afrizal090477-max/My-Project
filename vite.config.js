import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  // Path aliases untuk import yang lebih clean
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@data": path.resolve(__dirname, "./src/data"),
    },
  },

  // Development server settings
  server: {
  port: 5173,
  open: true,
  host: true,
  strictPort: false,
  hmr: {
    overlay: true,
  },
  proxy: {
    "/api": {
      target: "http://172.16.148.101:8883",
      changeOrigin: true,
      secure: false,
    },
  },
},


  // Preview server settings (untuk test production local)
  preview: {
    port: 4173,
    open: true,
    host: true,
    strictPort: false,
  },

  // Production build settings
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 1500,
    
    rollupOptions: {
      output: {
        // Automatic chunking - lebih aman dan optimal
        manualChunks: undefined,
        
        // Asset naming untuk cache busting
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          
          // Organize assets by type
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },

    // Optimization settings
    cssCodeSplit: true,
    cssMinify: true,
    
    // Asset handling
    assetsInlineLimit: 4096, // 4kb - assets below this will be inlined as base64
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "axios",
    ],
  },

  // CSS settings
  css: {
    devSourcemap: false,
  },

  // Base public path
  base: "/",
});
