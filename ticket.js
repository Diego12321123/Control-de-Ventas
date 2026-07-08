function imprimirTicketById(id){
  const venta = getVentas().find(v => v.id === id) || window.ventaTemporal;
  if(venta) imprimirTicket(venta);
}

function imprimirTicket(venta){
  const s = getSettings();
  const w = window.open("", "ticket", "width=360,height=600");
  if(!w){ alert("Permite ventanas emergentes para imprimir ticket."); return; }
  w.document.write(`<!DOCTYPE html>
<html><head><title>Ticket</title><meta charset="UTF-8">
<style>
  body{font-family:monospace;padding:12px;color:#000;background:#fff;}
  h2{text-align:center;margin:0 0 6px;font-size:18px;}
  p{margin:4px 0;}
  hr{border:0;border-top:1px dashed #000;margin:10px 0;}
  pre{white-space:pre-wrap;font-family:monospace;margin:6px 0;}
  .right{text-align:right}.center{text-align:center}
</style></head><body>
<h2>${escapeHTML(s.businessName)}</h2>
<p class="center">Ticket de venta</p><hr>
<p>Fecha: ${escapeHTML(venta.fecha)}</p>
<p>Hora: ${escapeHTML(venta.hora)}</p>
<p>Usuario: ${escapeHTML(venta.usuario)}</p>
<p>Tipo: ${escapeHTML(venta.tipo)}</p>
<p>Concepto: ${escapeHTML(venta.concepto || "")}</p>
<hr>
<pre>${escapeHTML(venta.detalle || "")}</pre>
<hr>
<p class="right"><b>Total: ${money(venta.total)}</b></p>
<p class="right">Ganancia: ${money(venta.ganancia)}</p>
<hr>
<p class="center">${escapeHTML(s.ticketFooter)}</p>
<script>window.print(); setTimeout(()=>window.close(), 500);<\/script>
</body></html>`);
  w.document.close();
}
