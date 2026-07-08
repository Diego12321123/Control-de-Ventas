function checkSaleAlerts(venta){
  const s = getSettings();
  if(Number(venta.ganancia || 0) < Number(s.lowProfit || 0)){
    alert(`⚠️ Ganancia baja: ${money(venta.ganancia)}. Revisa si el precio de venta es correcto.`);
  }
  const dia = reporteDia(venta.fecha);
  if(dia.total >= Number(s.dailyGoal || 0)){
    toast(`🎉 Meta diaria alcanzada: ${money(dia.total)}`);
  }
}

function alertasInicio(){
  const dia = reporteDia(todayISO());
  if(dia.count === 0){
    setTimeout(() => toast("🔔 Hoy aún no hay ventas registradas."), 600);
  }
}
