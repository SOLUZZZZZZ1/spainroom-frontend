import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Servido como estático desde public/assets
const PROVINCES_URL = "/assets/spain-provinces.geojson";

export default function MapaTest() {
  return (
    <div style={{ padding: 0 }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2200, center: [-4, 40.5] }}
        style={{ width: "100%", height: "70vh" }}
      >
        <Geographies geography={PROVINCES_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e2e8f0"
                stroke="#ffffff"
                strokeWidth={0.6}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
