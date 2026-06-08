// Vercel serverless-funktion: GET /api/auth
// Start på GitHub OAuth-flowet for Decap CMS. Sender brugeren videre til
// GitHub's login/godkendelse og sætter en kortlivet state-cookie (CSRF).
//
// Kræver env-vars i Vercel:
//   OAUTH_GITHUB_CLIENT_ID      (fra GitHub OAuth App)
//   OAUTH_GITHUB_CLIENT_SECRET  (bruges i api/callback.js)

import crypto from 'node:crypto'

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize'

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  if (!clientId) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID mangler i miljøet')
    return
  }

  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  const redirectUri = `${proto}://${host}/api/callback`
  const state = crypto.randomBytes(16).toString('hex')

  res.setHeader(
    'Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  )

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo',
    state,
  })

  res.writeHead(302, { Location: `${GITHUB_AUTHORIZE}?${params}` })
  res.end()
}
