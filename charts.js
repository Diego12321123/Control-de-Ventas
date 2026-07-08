function chartBarsFromDaily(mes){
  const ventas = getVentas().filter(v => String(v.fecha || "").startsWith(mes));
  const data = {};
  ventas.forEach(v => {
    data[v.fecha] = data[v.fecha] || { total:0, ganancia:0 };
    data[v.fecha].total += Number(v.total || 0);
    data[v.fecha].ganancia += Number(v.ganancia || 0);
  });
  const entries = Object.entries(data).sort((a,b) => a[0].localeCompare(b[0]));
  if(!entries.length) return `<p class="muted">No hay datos para graficar este mes.</p>`;
  const max = Math.max(...entries.map(([,v]) => v.total), 1);
  return `<div class="chart">${entries.map(([fecha,v]) => `
    <div class="bar-row">
      <span>${fecha.slice(5)}</span>
      <div class="bar-bg"><div class="bar-fill" style="width:${Math.max(4, (v.total/max)*100)}%"></div></div>
      <b>${money(v.total)}</b>
    </div>`).join("")}</div>`;
}

function chartByType(){
  const tipos = resumenPorTipo();
  const entries = Object.entries(tipos).sort((a,b) => b[1].ganancia - a[1].ganancia);
  if(!entries.length) return `<p class="muted">Aún no hay ventas para analizar.</p>`;
  const max = Math.max(...entries.map(([,v]) => v.ganancia), 1);
  return `<div class="chart">${entries.map(([tipo,v]) => `
    <div class="bar-row">
      <span>${escapeHTML(tipo)}</span>
      <div class="bar-bg"><div class="bar-fill" style="width:${Math.max(4, (v.ganancia/max)*100)}%"></div></div>
      <b>${money(v.ganancia)}</b>
    </div>`).join("")}</div>`;
}
