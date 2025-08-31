export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const raw = Buffer.concat(chunks).toString('utf8') || '{}'
    let data = {}
    try { data = JSON.parse(raw) } catch {}
    res.status(200).json({ ok: true, received: data, ts: new Date().toISOString() })
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) })
  }
}
