import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteSingleFile} from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
    build: {
      minify: false
    },
    plugins: [
        react(),
        viteSingleFile(),
    ],
    server: {
        allowedHosts: [
            // add hostnames
        ]
    }
})
