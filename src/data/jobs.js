// Ofertas mock cerca de las zonas de las habitaciones (para demo)
export const JOBS = [
  // MADRID
  {
    id: "JOB-MAD-CHUECA-1",
    title: "Recepcionista Boutique Hotel",
    company: "Hotel Azul",
    city: "Madrid",
    area: "Chueca",
    coords: { lat: 40.4217, lng: -3.7002 },
    type: "Jornada completa",
    salary: "18.000–22.000 €",
    postedAt: "2025-08-20",
    tags: ["Recepción", "Inglés", "Turnos"],
  },
  {
    id: "JOB-MAD-CHUECA-2",
    title: "Dependiente/a Tienda Moda",
    company: "Trendy Co.",
    city: "Madrid",
    area: "Chueca",
    coords: { lat: 40.4222, lng: -3.6989 },
    type: "Media jornada",
    salary: "900–1.100 €/mes",
    postedAt: "2025-08-22",
    tags: ["Ventas", "Atención cliente"],
  },
  {
    id: "JOB-MAD-LAVAPIES-1",
    title: "Camarero/a Cafetería",
    company: "Café Lavapiés",
    city: "Madrid",
    area: "Lavapiés",
    coords: { lat: 40.4089, lng: -3.6991 },
    type: "Turnos",
    salary: "1.100–1.300 €/mes",
    postedAt: "2025-08-21",
    tags: ["Hostelería", "Experiencia previa"],
  },

  // BARCELONA
  {
    id: "JOB-BCN-GRACIA-1",
    title: "Ayudante de Cocina",
    company: "Bistró Gràcia",
    city: "Barcelona",
    area: "Gràcia",
    coords: { lat: 41.4041, lng: 2.1533 },
    type: "Jornada completa",
    salary: "1.300–1.500 €/mes",
    postedAt: "2025-08-19",
    tags: ["Cocina", "Higiene", "Turnos"],
  },

  // VALÈNCIA
  {
    id: "JOB-VAL-RUZ-1",
    title: "Mozo/a de Almacén",
    company: "Logis Ruzafa",
    city: "València",
    area: "Ruzafa",
    coords: { lat: 39.4629, lng: -0.3738 },
    type: "Temporal",
    salary: "8–9 €/hora",
    postedAt: "2025-08-18",
    tags: ["Manipulación", "Turnos"],
  },

  // SEVILLA
  {
    id: "JOB-SEV-TRIANA-1",
    title: "Dependiente/a Panadería",
    company: "Triana Pan",
    city: "Sevilla",
    area: "Triana",
    coords: { lat: 37.3825, lng: -6.0065 },
    type: "Mañanas",
    salary: "1.050–1.200 €/mes",
    postedAt: "2025-08-17",
    tags: ["Atención", "Caja"],
  },

  // MÁLAGA
  {
    id: "JOB-MAL-SOHO-1",
    title: "Auxiliar Administrativo",
    company: "Soho Office",
    city: "Málaga",
    area: "Soho",
    coords: { lat: 36.7157, lng: -4.4269 },
    type: "Parcial",
    salary: "900–1.100 €/mes",
    postedAt: "2025-08-16",
    tags: ["Ofimática", "Atención"],
  },
];

// Zonas de referencia con coordenadas (centradas en las habitaciones demo)
export const JOB_ZONES = [
  { key: "MAD-CHUECA", label: "Madrid — Chueca (2 km / 10 km)", coords: { lat: 40.4219, lng: -3.6993 } },
  { key: "MAD-LAVAPIES", label: "Madrid — Lavapiés (2 km / 10 km)", coords: { lat: 40.4087, lng: -3.7004 } },
  { key: "BCN-GRACIA", label: "Barcelona — Gràcia (2 km / 10 km)", coords: { lat: 41.4036, lng: 2.1526 } },
  { key: "VAL-RUZ", label: "València — Ruzafa (2 km / 10 km)", coords: { lat: 39.4622, lng: -0.3729 } },
  { key: "SEV-TRIANA", label: "Sevilla — Triana (2 km / 10 km)", coords: { lat: 37.3823, lng: -6.0072 } },
  { key: "MAL-SOHO", label: "Málaga — Soho (2 km / 10 km)", coords: { lat: 36.7154, lng: -4.4274 } },
];
