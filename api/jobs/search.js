export default function handler(req, res) {
  const { query = '', lat = '0', lng = '0', radius_km = '20' } = req.query || {}
  const radius = Math.max(0.2, parseFloat(radius_km))
  const base = ['Camarero/a','Dependiente/a','Recepcionista','Repartidor/a','Auxiliar administrativo/a','Conserje']
  const list = Array.from({ length: 6 }).map((_, i) => ({
    id: `search-${i + 1}`,
    title: `${query ? query + ' · ' : ''}${base[(i*3+2)%base.length]}`,
    company: ['SuperBar','Mercasuper','Hotel Sol','LogisExpress','OfiPlus','LimpioYa'][i % 6],
    location: 'Zona ampliada',
    distance_km: Number((Math.random() * radius + 0.2).toFixed(1)),
    posted_at: 'hoy',
    url: '#'
  }))
  res.setHeader('Content-Type','application/json')
  res.status(200).json(list)
}
