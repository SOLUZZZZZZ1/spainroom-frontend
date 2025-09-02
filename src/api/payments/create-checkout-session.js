// api/payments/create-checkout-session.js
export default async function handler(req, res) {
  res.setHeader('Content-Type','application/json; charset=utf-8')
  if (req.method !== 'POST') {
    return res.status(405).end(JSON.stringify({ error: 'Method Not Allowed' }))
  }
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).end(JSON.stringify({ error: 'Falta STRIPE_SECRET_KEY' }))
  }
  try {
    const chunks = []
    for await (const c of req) chunks.push(c)
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')

    const amount = Math.round(Number(body.amount || 0) * 100)
    if (!amount) return res.status(400).end(JSON.stringify({ error:'Importe inválido' }))

    const host  = req.headers['x-forwarded-host'] || req.headers.host
    const proto = req.headers['x-forwarded-proto'] || 'https'
    const SITE_URL = process.env.SITE_URL || `${proto}://${host}`

    const params = new URLSearchParams()
    params.append('mode','payment')
    params.append('payment_method_types[]','card')
    params.append('success_url', `${SITE_URL}${body.success_path || '/reservas/ok'}?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url',  `${SITE_URL}${body.cancel_path  || '/reservas/error'}`)
    if (body.customer_email) params.append('customer_email', body.customer_email)
    params.append('line_items[0][price_data][currency]', 'eur')
    params.append('line_items[0][price_data][product_data][name]', 'Depósito de reserva SpainRoom')
    params.append('line_items[0][price_data][unit_amount]', String(amount))
    params.append('line_items[0][quantity]','1')

    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:'POST',
      headers:{ Authorization:`Bearer ${STRIPE_SECRET_KEY}`, 'Content-Type':'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const data = await r.json()
    if (!r.ok) return res.status(r.status).end(JSON.stringify({ error: data.error?.message || 'Error Stripe' }))
    return res.status(200).end(JSON.stringify({ url: data.url }))

  } catch (e) {
    return res.status(500).end(JSON.stringify({ error: String(e) }))
  }
}
