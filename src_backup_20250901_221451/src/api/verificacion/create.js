// =====================================
// FILE: api/verificacion/create.js  (opcional, pero útil)
// =====================================
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const chunks = []
    for await (const c of req) chunks.push(c)
    const raw = Buffer.concat(chunks).toString('utf8') || '{}'
    const data = JSON.parse(raw)

    // aquí podrías: guardar en BBDD / enviar email / escribir a un sheet...
    res.status(200).json({ ok: true, received: data, ts: new Date().toISOString() })
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) })
  }
}
