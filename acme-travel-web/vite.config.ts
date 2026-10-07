import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port 3000 is taken on some machines, so the demo runs on 3001.
// Every /api call is proxied to the bookings API so the browser only talks to one origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: "localhost",
    proxy: {
      "/api": "http://localhost:4001",
    },
  },
});
