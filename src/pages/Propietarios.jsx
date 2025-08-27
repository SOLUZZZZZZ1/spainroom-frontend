import { useEffect, useState } from "react";
import MapaProvincias from "../components/MapaProvincias";

export default function Propietarios() {
  const [csvOk, setCsvOk] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/mapa_cedula_provincias.csv", { cache: "no-store" });
        setCsvOk(res.ok);
      } catch {
        setCsvOk(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Propietarios</h2>
        <p style={{ margin: "6px 0 0", color: "#4b5563" }}>
          Mapa político por provincias con los requisitos para poder alquilar una vivienda:
          <b> Cédula de habitabilidad</b>, <b>Licencia de 1ª ocupación (LPO)</b> o
          <b> 2ª ocupación / declaración responsable</b>, según corresponda.
          Haz clic en una provincia para ver el detalle con obligaciones del propietario,
          organismo emisor, vigencia y enlace oficial.
        </p>
      </header>

      {!csvOk && (
        <div style={{
          border: "1px dashed #cbd5e1",
          background: "#f8fafc",
          color: "#64748b",
          padding: 12,
          borderRadius: 12,
          marginBottom: 16
        }}>
          <b>Nota:</b> No se encontró <code>/data/mapa_cedula_provincias.csv</code>.
          Asegúrate de tenerlo en <code>frontend/public/data/</code> con la cabecera indicada.
          El mapa se mostrará igualmente con valores por defecto si existen.
        </div>
      )}

      <MapaProvincias csvUrl="/data/mapa_cedula_provincias.csv" />
    </main>
  );
}
