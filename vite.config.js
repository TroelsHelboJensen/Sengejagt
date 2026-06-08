import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// To dev-problemer løses her (Vercel håndterer begge korrekt i produktion):
//   1) SPA-fallbacken sluger /admin/ og serverer app'ens index.html i stedet
//      for Decap-admin'en → vi serverer public/admin/index.html eksplicit.
//   2) Browseren kan cache config.yml; en gammel/ødelagt cachet config giver
//      "config must have required property ..."-fejl → vi serverer den altid
//      frisk med no-store.
function adminFallback() {
  const read = (file) =>
    readFileSync(fileURLToPath(new URL(`./public/admin/${file}`, import.meta.url)))

  return {
    name: 'admin-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path === '/admin' ||
          path === '/admin/') {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(read('index.html'))
          return
        }
        if (path === '/admin/config.yml') {
          res.setHeader('Content-Type', 'text/yaml; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(read('config.yml'))
          return
        }
        next()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), adminFallback()],
})
