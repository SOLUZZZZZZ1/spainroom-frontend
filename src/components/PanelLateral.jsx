// PanelLateral.jsx (simple)
export default function PanelLateral({ sel, onClose }) {
  if (!sel) return null;
  const labelCat = sel.cat==='si' ? 'Obligatorio' : sel.cat==='depende' ? 'Depende (municipal)' : sel.cat==='no' ? 'No' : 'Consultar';
  const color = sel.cat==='si' ? '#ef4444' : sel.cat==='depende' ? '#f59e0b' : sel.cat==='no' ? '#16a34a' : '#64748b';

  return (
    <aside style={{
      position:'fixed', right:0, top:0, bottom:0, width:380, background:'#fff',
      borderLeft:'1px solid #e2e8f0', padding:16, boxShadow:'-6px 0 24px rgba(0,0,0,.08)', overflow:'auto', zIndex:50
    }}>
      <button onClick={onClose} style={{float:'right',border:0,background:'transparent',fontSize:18}}>×</button>
      <h3 style={{margin:'8px 0 4px'}}>{sel.prov}</h3>
      <div style={{margin:'6px 0 12px', fontWeight:700, color}}>
        {labelCat}
      </div>
      <dl style={{fontSize:14, color:'#0b1220'}}>
        <dt style={{fontWeight:700}}>Documento</dt><dd style={{margin:'0 0 10px'}}>{sel.doc || '—'}</dd>
        <dt style={{fontWeight:700}}>Organismo</dt><dd style={{margin:'0 0 10px'}}>{sel.org || '—'}</dd>
        <dt style={{fontWeight:700}}>Vigencia / Renovación</dt><dd style={{margin:'0 0 10px'}}>{sel.vig || '—'}</dd>
        <dt style={{fontWeight:700}}>Notas</dt><dd style={{margin:'0 0 10px',whiteSpace:'pre-wrap'}}>{sel.notas || '—'}</dd>
        <dt style={{fontWeight:700}}>Enlace oficial</dt>
        <dd>{sel.link ? <a href={sel.link} target="_blank" rel="noreferrer">{sel.link}</a> : '—'}</dd>
      </dl>
    </aside>
  );
}
