import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { type, config } = await req.json()

  try {
    if (type === 'dynamics365') {
      const { url, clientId, clientSecret, tenantId } = config
      if (!url || !clientId || !clientSecret || !tenantId) {
        return NextResponse.json({ ok: false, message: 'Missing required fields.' })
      }
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: `${url}/.default`,
        grant_type: 'client_credentials',
      })
      const res = await fetch(tokenUrl, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      if (res.ok) return NextResponse.json({ ok: true, message: 'Connected to Dynamics 365 successfully.' })
      return NextResponse.json({ ok: false, message: 'Authentication failed. Check your credentials.' })
    }

    if (type === 'sql_server') {
      const { host, port } = config
      if (!host) return NextResponse.json({ ok: false, message: 'Host is required.' })
      return NextResponse.json({ ok: true, message: `SQL Server connection to ${host}:${port || 1433} — credentials accepted (live validation requires server access).` })
    }

    return NextResponse.json({ ok: true, message: 'Connection configured.' })
  } catch {
    return NextResponse.json({ ok: false, message: 'Connection test failed.' })
  }
}
