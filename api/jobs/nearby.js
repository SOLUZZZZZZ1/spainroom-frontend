export default function handler(req, res) {
  const { lat = '0', lng = '0', radius_km = '2' } = req.query || {}
  const radius = Math.max(0.2, parseFloat(radius_km))
  const list = Array.from({ length: 6 }).map((_, i) => ({
    id: `nearby-${i + 1}`,
    title: ['Camarero/a','Dependiente/a','Recepcionista','Repartidor/a','Auxiliar administrativo/a','Conserje'][i % 6],
    company: ['SuperBar','Mercasuper','Hotel Sol','LogisExpress','OfiPlus','LimpioYa'][i % 6],
    location: 'Cerca de ti',
    distance_km: Number((Math.random() * radius + 0.2).toFixed(1)),
    posted_at: 'hoy',
    url: '#'
  }))
  res.setHeader('Content-Type','application/json')
  res.status(200).json(list)
}
