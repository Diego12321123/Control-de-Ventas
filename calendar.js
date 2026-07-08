function addMonths(mes, delta){
  const [y,m] = mes.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}`;
}

function renderCalendar(mes, onClickName="verDia"){
  const [year, month] = mes.split("-").map(Number);
  const first = new Date(year, month-1, 1);
  const days = new Date(year, month, 0).getDate();
  const start = first.getDay();
  const ventas = getVentas().filter(v => String(v.fecha || "").startsWith(mes));
  const byDay = {};
  ventas.forEach(v => {
    byDay[v.fecha] = byDay[v.fecha] || { count:0, total:0 };
    byDay[v.fecha].count++;
    byDay[v.fecha].total += Number(v.total || 0);
  });
  const names = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  let html = `<div class="calendar-grid">${names.map(n => `<div class="cal-day-name">${n}</div>`).join("")}`;
  for(let i=0;i<start;i++) html += `<button class="cal-day empty" disabled></button>`;
  for(let day=1; day<=days; day++){
    const fecha = `${year}-${pad(month)}-${pad(day)}`;
    const info = byDay[fecha];
    const cls = ["cal-day", fecha === todayISO() ? "today" : "", info ? "has-sales" : ""].join(" ");
    html += `<button class="${cls}" onclick="${onClickName}('${fecha}')"><b>${day}</b>${info ? `<small>${info.count} venta(s)<br>${money(info.total)}</small>` : `<small>&nbsp;</small>`}</button>`;
  }
  html += `</div>`;
  return html;
}
