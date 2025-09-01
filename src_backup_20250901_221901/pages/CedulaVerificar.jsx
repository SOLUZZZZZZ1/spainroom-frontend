import React, { useMemo, useState } from 'react';

/**
 * Verificador de Cédula de Habitabilidad por Referencia Catastral
 * - Valida formato RC (20 caracteres alfanuméricos)
 * - Explica el requisito según CCAA
 * - Verifica vigencia por fecha (reglas básicas por CCAA)
 * - Deja hook listo para integrar API Catastro y autocompletar dirección
 */

const CCAA = [
  'Cataluña',
  'Comunidad Valenciana',
  'Madrid',
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla y León',
  'Castilla-La Mancha',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Murcia',
  'Navarra',
  'País Vasco',
  'Ceuta',
  'Melilla'
];

// Valida RC: 20 alfanuméricos (sin espacios)
const isValidRC = (rc) => /^[A-Za-z0-9]{20}$/.test(rc);

// Años de vigencia orientativos por CCAA (ajusta cuando conectemos con cada registro autonómico)
function vigenciaAnios(ccaa) {
  switch (ccaa) {
    case 'Cataluña':               return 15; // Cédula d’habitabilitat
    case 'Comunidad Valenciana':   return 10; // Licencia/Certificado de segunda ocupación
    // En Madrid no hay cédula; se usa LPO/Declaración Responsable (no tiene "caducidad" tipo cédula)
    default: return 10; // valor por defecto razonable; ajustar por CCAA si aplica
  }
}

function explainByCCAA(ccaa) {
  switch (ccaa) {
    case 'Cataluña':
      return 'En Cataluña se exige Cédula d’habitabilitat. Validez habitual: 15 años. Introduce número y fecha de expedición.';
    case 'Comunidad Valenciana':
      return 'En la C. Valenciana se usa Licencia/Certificado de Segunda Ocupación (equivalente a cédula). Validez habitual: 10 años.';
    case 'Madrid':
      return 'En Madrid no existe cédula como tal. Se verifica Licencia de Primera Ocupación (LPO) o Declaración Responsable. Adjunta referencia y fecha de LPO.';
    default:
      return 'La exigencia y vigencia pueden variar según la normativa autonómica y municipal. Introduce datos de cédula/licencia y fecha para verificar vigencia.';
  }
}

function addYears(date, years) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export default function CedulaVerificar() {
  const [rc, setRc] = useState('');
  const [ccaa, setCcaa] = useState('');
  const [numCedula, setNumCedula] = useState('');
  const [fechaExp, setFechaExp] = useState(''); // yyyy-mm-dd
  const [direccion, setDireccion] = useState(''); // futuro: autocompletar desde Catastro
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const rcOk = isValidRC(rc);

  // Mensaje contextual según CCAA
  const ccaaHelp = useMemo(() => (ccaa ? explainByCCAA(ccaa) : ''), [ccaa]);

  // Simulación/hook de Catastro (llamarás a tu backend)
  const consultarCatastro = async () => {
    if (!rcOk) return;
    setLoading(true);
    try {
      // TODO: reemplazar por llamada real a tu backend:
      // const res = await fetch(`/api/catastro?rc=${rc}`);
      // const json = await res.json();
      // setDireccion(json.direccionCompleta);

      // Mock de ejemplo para ver la UI funcionando:
      await new Promise(r => setTimeout(r, 700));
      setDireccion('C/ Ejemplo 123, 28000 Madrid'); // ← mock temporal
    } catch (e) {
      console.error('Catastro error:', e);
    } finally {
      setLoading(false);
    }
  };

  const verificar = () => {
    const msgs = [];
    if (!rcOk) msgs.push('Referencia catastral inválida (20 caracteres alfanuméricos).');
    if (!ccaa) msgs.push('Selecciona Comunidad Autónoma.');
    if (ccaa !== 'Madrid') {
      if (!numCedula) msgs.push('Introduce el número de cédula/licencia.');
      if (!fechaExp) msgs.push('Introduce la fecha de expedición.');
    } else {
      // Madrid: no cédula → se verifica LPO/DR: pedimos fecha como referencia documental
      if (!fechaExp) msgs.push('Introduce la fecha de la LPO/Declaración Responsable.');
    }

    if (msgs.length) {
      setResultado({ ok: false, detalles: msgs });
      return;
    }

    // Vigencia por fecha (si aplica)
    if (fechaExp && ccaa !== 'Madrid') {
      const años = vigenciaAnios(ccaa);
      const fExp = new Date(fechaExp);
      const fCad = addYears(fExp, años);
      const hoy = new Date();

      if (!fCad) {
        setResultado({ ok: false, detalles: ['Fecha de expedición no válida.'] });
        return;
      }

      if (hoy > fCad) {
        setResultado({
          ok: false,
          detalles: [
            `Cédula/licencia caducada. Validez en ${ccaa}: ${años} años.`,
            `Fecha expedición: ${fExp.toLocaleDateString()} — Caducidad: ${fCad.toLocaleDateString()}`
          ]
        });
        return;
      }

      setResultado({
        ok: true,
        detalles: [
          `Cédula/licencia vigente en ${ccaa}.`,
          `Expedición: ${fExp.toLocaleDateString()} — Caduca: ${fCad.toLocaleDateString()}`
        ]
      });
      return;
    }

    // Madrid u otros casos sin caducidad tipificada
    setResultado({
      ok: true,
      detalles: [
        ccaa === 'Madrid'
          ? 'Madrid: No existe cédula. Verifica LPO/Declaración Responsable (documentación aportada).'
          : 'Verificación básica completada.'
      ]
    });
  };

  return (
    <div style={{ maxWidth: 820, margin: '40px auto', padding: 20, fontFamily: 'system-ui, Segoe UI, Roboto, Arial' }}>
      <h1>Verificar Cédula por Referencia Catastral</h1>
      <p style={{ color: '#555' }}>Introduce la referencia catastral (20 caracteres) y completa los datos.</p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Referencia catastral</span>
          <input
            value={rc}
            onChange={(e) => setRc(e.target.value.replace(/\s+/g, ''))}
            placeholder="Ej: 1234567AB1234C0001XY"
            maxLength={20}
            style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${rc ? (rcOk ? '#22c55e' : '#ef4444') : '#ccc'}` }}
          />
          <small style={{ color: rc ? (rcOk ? '#16a34a' : '#dc2626') : '#555' }}>
            {rc ? (rcOk ? 'Formato válido' : 'Debe tener 20 caracteres alfanuméricos') : 'Sin espacios. 20 caracteres.'}
          </small>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Comunidad Autónoma</span>
          <select
            value={ccaa}
            onChange={(e) => setCcaa(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          >
            <option value="">Selecciona CCAA</option>
            {CCAA.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {ccaa && <small style={{ color: '#555' }}>{ccaaHelp}</small>}
        </label>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>{ccaa === 'Madrid' ? 'Fecha LPO/Declaración Responsable' : 'Fecha expedición cédula/licencia'}</span>
          <input
            type="date"
            value={fechaExp}
            onChange={(e) => setFechaExp(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>{ccaa === 'Madrid' ? 'Documento (LPO/DR) nº (opcional)' : 'Nº cédula/licencia'}</span>
          <input
            value={numCedula}
            onChange={(e) => setNumCedula(e.target.value)}
            placeholder={ccaa === 'Madrid' ? 'Nº LPO/DR (opcional)' : 'Número cédula/licencia'}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
          />
        </label>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <button
          onClick={consultarCatastro}
          disabled={!rcOk || loading}
          style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid #0a58ca',
            background: '#fff', color: '#0a58ca', cursor: (!rcOk || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Consultando Catastro…' : 'Autocompletar dirección desde Catastro'}
        </button>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección (autocompletada o manual)"
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <button
          onClick={verificar}
          style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid #0a58ca',
            background: '#0a58ca', color: '#fff', cursor: 'pointer'
          }}
        >
          Verificar
        </button>
        <button
          onClick={() => { setResultado(null); setNumCedula(''); setFechaExp(''); setDireccion(''); }}
          style={{
            padding: '10px 14px', borderRadius: 10, border: '1px solid #d0d7de',
            background: '#fff', color: '#0a0a0a', cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </div>

      {resultado && (
        <div
          style={{
            marginTop: 24, padding: 16, borderRadius: 12,
            border: `1px solid ${resultado.ok ? '#22c55e' : '#ef4444'}`,
            background: resultado.ok ? '#ecfdf5' : '#fef2f2', color: '#111'
          }}
        >
          <strong>{resultado.ok ? '✅ Válida' : '❌ No válida / Incompleta'}</strong>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            {resultado.detalles.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 24, color: '#6b7280', fontSize: 12 }}>
        <p><strong>Nota:</strong> La cédula/licencia depende de la normativa autonómica/municipal. Este verificador comprueba formato RC, guía por CCAA y valida vigencia por fecha. La comprobación documental definitiva se realiza con la administración competente (y/o adjuntando el documento).</p>
      </div>
    </div>
  );
}
