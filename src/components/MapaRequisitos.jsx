import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// TopoJSON ESPAÑA por Comunidades Autónomas (geojson / topojson público)
// Si prefieres provincias luego, te dejo abajo otras URLs.
const SPAIN_CCAA_TOPOJSON =
  "https://cdn.jsdelivr.net/npm/@geo-maps/es-autonomous-communities@1/geo/es-autonomous-communities.topo.json";

// Paleta por tipo de requisito
const COLORS = {
  "Cédula de habitabilidad": "#2563eb",        // azul
  "LPO / 1ª ocupación": "#10b981",            // verde
  "2ª ocupación / DR municipal": "#f59e0b",    // amarillo
  "Sin dato / Depende": "#9ca3af",             // gris
};

// Reglas actuales (las iremos afinando y ampliando):
// OJO: nombres tal como suelen venir en el TopoJSON (castellano estándar)
const REGLAS_CCAA = {
  "Cataluña": "Cédula de habitabilidad",
  "Illes Balears": "Cédula de habitabilidad",
  "Comunitat Valenciana": "2ª ocupación / DR municipal",
  "Región de Murcia": "2ª ocupación / DR municipal",
  "Comunidad de Madrid": "LPO / 1ª ocupación",
  "Andalucía": "LPO / 1ª ocupación",
  // Resto inicializamos como “Sin dato / Depende” hasta verificar
};

// Texto explicativo que aparece en el tooltip
const EXPLICA = {
  "Cédula de habitabilidad":
    "Se exige cédula vigente para alquiler/venta. Suele pedirse también para suministros.",
  "LPO / 1ª ocupación":
    "Se exige Licencia de Primera Ocupación (o equivalente) para la edificación. Reglas locales.",
  "2ª ocupación / DR municipal":
    "Municipal. Suele ser una segunda ocupación o declaración responsable en viviendas usadas.",
  "Sin dato / Depende":
    "Pendiente de verificación o depende de ordenanzas municipales. Lo completamos pronto.",
};

export default function MapaRequisitos() {
  const [hoverInfo, setHoverInfo] = useState(null);

  // Leyenda
  const Legend = () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
      {Object.entries(COLORS).map(([label, color]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, background: color, display: "inline-block", borderRadius: 3 }} />
          <small>{label}</small>
        </div>
      ))}
    </div>
  );

  // Mapa
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
      <h3 style={{ marginTop: 0, marginBottom: 6 }}>Requisitos para alquilar por Comunidad Autónoma</h3>
      <p style={{ marginTop: 0, color: "#4b5563", fontSize: 14 }}>
        Colores según documento exigido: <b>Cédula</b>, <b>LPO/1ª ocupación</b>, <b>2ª ocupación/DR municipal</b> o <b>Sin dato</b>.
        <br />
        (Esto es una primera versión. Vamos a verificar y completar comunidad por comunidad y, después, provincia por provincia).
      </p>

      <Legend />

      <div style={{ position: "relative" }}>
        <ComposableMap projection="geoMercator" width={800} height={580}>
          <Geographies geography={SPAIN_CCAA_TOPOJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Según el dataset @geo-maps, el nombre de CCAA está en geo.properties.NAME (inglés/ES depende del set)
                const nombre =
                  geo.properties?.NAME ||
                  geo.properties?.name ||
                  geo.properties?.community ||
                  "Desconocido";

                const tipo = REGLAS_CCAA[nombre] || "Sin dato / Depende";
                const fill = COLORS[tipo] || COLORS["Sin dato / Depende"];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() =>
                      setHoverInfo({
                        nombre,
                        tipo,
                      })
                    }
                    onMouseLeave={() => setHoverInfo(null)}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none", filter: "brightness(0.95)" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {hoverInfo && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: 8,
              maxWidth: 360,
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{hoverInfo.nombre}</div>
            <div style={{ marginBottom: 2 }}>
              <b>Documento:</b> {hoverInfo.tipo}
            </div>
            <div style={{ opacity: 0.9 }}>{EXPLICA[hoverInfo.tipo] || ""}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
        Nota: Insertaremos este mapa en la pestaña <b>Propietarios</b> y lo conectaremos a nuestra tabla maestra
        (CSV/DB) para colorear dinámicamente. Luego haremos la versión por <b>provincias</b>.
      </div>
    </div>
  );
}

/*
-------------------------------------------
Opcional: pasar a PROVINCIAS más adelante
-------------------------------------------
1) Sustituye SPAIN_CCAA_TOPOJSON por una capa de provincias, por ejemplo:
   - https://cdn.jsdelivr.net/npm/@geo-maps/es-provinces@1/geo/es-provinces.topo.json
   (También hay paquetes similares con GeoJSON/TopoJSON por provincias en varios CDNs.)

2) Cambia la clave del nombre (p.ej. geo.properties.NAME / province) y
   construye un diccionario REGLAS_PROVINCIAS con "Provincia" -> "tipo".

3) Conéctalo a tu fuente real (CSV/DB) para pintar colores y mostrar
   "Obligaciones del propietario", "Organismo emisor", "Vigencia", etc.
*/
