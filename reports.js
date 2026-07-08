function ventasOrdenadas(){
  return getVentas().sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function reporteDia(fecha){
  const ventas = getVentas().filter(v => v.fecha === fecha).sort((a,b) => String(a.hora).localeCompare(String(b.hora)));
  return resumenVentas(ventas);
}

function reporteMes(mes){
  const ventas = getVentas().filter(v => String(v.fecha || "").startsWith(mes));
  return resumenVentas(ventas);
}

function resumenVentas(ventas){
  const total = ventas.reduce((s,v) => s + Number(v.total || 0), 0);
  const ganancia = ventas.reduce((s,v) => s + Number(v.ganancia || 0), 0);
  return { ventas, total, ganancia, count:ventas.length };
}

function resumenPorTipo(ventas = getVentas()){
  const tipos = {};
  ventas.forEach(v => {
    const tipo = v.tipo || "Sin tipo";
    if(!tipos[tipo]) tipos[tipo] = { total:0, ganancia:0, count:0 };
    tipos[tipo].total += Number(v.total || 0);
    tipos[tipo].ganancia += Number(v.ganancia || 0);
    tipos[tipo].count += 1;
  });
  return tipos;
}

function exportarExcelCSV(){
  const ventas = getVentas();
  const headers = ["Fecha","Hora","Usuario","Tipo","Concepto","Detalle","Total","Ganancia"];
  const rows = ventas.map(v => [
    v.fecha,
    v.hora,
    v.usuario,
    v.tipo,
    v.concepto,
    String(v.detalle || "").replaceAll("\n"," | "),
    Number(v.total || 0),
    Number(v.ganancia || 0)
  ]);
  const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell ?? "").replaceAll('"','""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type:"text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ventas-${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
