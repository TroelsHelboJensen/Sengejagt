// Vercel serverless-funktion: GET /api/callback
// GitHub sender brugeren retur hertil med en ?code. Vi bytter koden til et
// access-token og leverer det til Decap CMS via postMessage-håndtrykket,
// som CMS'et forventer i pop op-vinduet.

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

// Decap forventer denne postMessage-sekvens fra pop op-vinduet:
//   1) vinduet sender "authorizing:github"
//   2) opener svarer (vilkårlig besked)
//   3) vinduet sender "authorization:github:<status>:<json>"
function renderHandshake(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`
  return `<!doctype html><html><body><script>
  (function () {
    function send(msg) {
      if (window.opener) {
        window.opener.postMessage(msg, '*')
      }
    }
    window.addEventListener('message', function () {
      send(${JSON.stringify(message)})
    }, { once: true })
    send('authorizing:github')
  })()
  </script></body></html>`
}

function readCookie(req, name) {
  const cookie = req.headers.cookie ?? ''
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    res.status(500).send('OAuth-miljøvariabler mangler')
    return
  }

  const { code, state } = req.query
  const savedState = readCookie(req, 'oauth_state')
  if (!code ||
    !state ||
    state !== savedState) {
    res.status(400).send('Ugyldig eller manglende OAuth-state')
    return
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })
  const data = await tokenRes.json()

  // Ryd state-cookien uanset udfald.
  res.setHeader('Set-Cookie', 'oauth_state=; Path=/; Max-Age=0')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (data.error || !data.access_token) {
    res
      .status(200)
      .send(
        renderHandshake('error', {
          message: data.error_description ?? 'Kunne ikke hente token',
        }),
      )
    return
  }

  res
    .status(200)
    .send(renderHandshake('success', { token: data.access_token, provider: 'github' }))
}
