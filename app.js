const app = document.getElementById("app");
window.ventaTemporal = null;

function nav(){
  if(!currentUser()) return "";
  return `
    <nav class="navbar no-print">
      <button onclick="menu()"><strong>🏠</strong>Inicio</button>
      <button onclick="nuevaVenta()"><strong>➕</strong>Venta</button>
      <button onclick="reportes()"><strong>📊</strong>Reportes</button>
      <button onclick="herramientas()"><strong>🧰</strong>Herram.</button>
      <button onclick="configuracion()"><strong>⚙️</strong>Config.</button>
    </nav>`;
}

function screen(html){
  app.innerHTML = html + nav();
}

function toast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>el.classList.add("hidden"), 2600);
}

function requireLogin(){
  if(!currentUser()){
    loginPantalla();
    return false;
  }
  return true;
}

function loginPantalla(){
  const s = getSettings();
  document.getElementById("headerTitle").textContent = s.businessName;
  screen(`
    <section class="card">
      <h2>🔐 Entrar</h2>
      <label>Usuario</label>
      <input id="loginUser" autocomplete="username" placeholder="Usuario">
      <label>Contraseña</label>
      <input id="loginPass" type="password" autocomplete="current-password" placeholder="Contraseña">
      <button class="primary" onclick="entrar()">Entrar</button>
    </section>`);
}

function entrar(){
  if(login(val("loginUser"), val("loginPass"))){
    toast("Bienvenido");
    menu();
    alertasInicio();
  }else{
    alert("Usuario o contraseña incorrectos");
  }
}

function salir(){
  logout();
  loginPantalla();
}

function menu(){
  if(!requireLogin()) return;
  const u = currentUser();
  const s = getSettings();
  document.getElementById("headerTitle").textContent = s.businessName;
  const dia = reporteDia(todayISO());
  const mes = reporteMes(monthISO());
  screen(`
    <section class="card">
      <h2>📊 ${escapeHTML(s.businessName)}</h2>
      <div class="stats">
        <div class="stat"><span>Ventas hoy</span><b>${money(dia.total)}</b><p class="small">Ganancia: ${money(dia.ganancia)}</p></div>
        <div class="stat"><span>Ventas del mes</span><b>${money(mes.total)}</b><p class="small">Ganancia: ${money(mes.ganancia)}</p></div>
        <div class="stat"><span>Usuario</span><b>${escapeHTML(u.user)}</b><p class="small">${escapeHTML(u.role)}</p></div>
      </div>
    </section>
    <section class="card">
      <h3>¿Qué quieres hacer?</h3>
      <div class="actions">
        <button class="primary" onclick="nuevaVenta()">➕ Registrar venta</button>
        <button class="success" onclick="reportes()">📆 Historial y reportes</button>
        <button class="warning" onclick="alert(analisisIA())">🧠 Analizar negocio</button>
        <button class="secondary" onclick="herramientas()">📂 Exportar / Respaldo</button>
      </div>
    </section>`);
}

function nuevaVenta(){
  if(!requireLogin()) return;
  screen(`
    <section class="card">
      <h2>➕ Nueva venta</h2>
      <div class="grid two">
        <button class="primary" onclick="formPapeleria()">📄 Papelería e impresiones</button>
        <button class="success" onclick="formRecarga()">📱 Recargas o pagos</button>
        <button class="warning" onclick="formEmicar()">🪪 Emicar</button>
        <button class="secondary" onclick="formEngargolar()">📚 Engargolar</button>
      </div>
    </section>`);
}

function formPapeleria(){
  screen(`
    <section class="card">
      <h2>📄 Papelería e impresiones</h2>
      <label>Tipo de venta</label>
      <select id="papTipo" onchange="togglePapeleria()">
        <option value="hoja">Venta de hoja individual</option>
        <option value="impresion">Impresión</option>
      </select>
    </section>

    <section id="formHoja" class="card">
      <h3>Venta de hoja</h3>
      <label>Tipo de hoja</label>
      <select id="hojaTipo" onchange="calcHoja()">
        <option>Hoja normal</option>
        <option>Hoja de color</option>
        <option>Hoja opalina</option>
        <option>Cartulina</option>
        <option>Hoja fotográfica</option>
        <option>Hoja adhesiva</option>
      </select>
      <label>Costo de compra individual</label>
      <input id="hojaCosto" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 1.00" oninput="calcHoja()">
      <label>Valor de venta</label>
      <input id="hojaVenta" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 3.00" oninput="calcHoja()">
      <div class="result">
        <p><span>Ganancia</span><b id="hojaGanancia">$0.00</b></p>
      </div>
      <button class="primary" onclick="guardarHoja()">💾 Guardar venta</button>
    </section>

    <section id="formImp" class="card hidden">
      <h3>Impresión</h3>
      <label>Tipo de impresión</label>
      <input id="impTipo" placeholder="Ejemplo: tarea, copia, documento, foto">
      <label>Color</label>
      <select id="impColor">
        <option>Blanco y negro</option>
        <option>Color</option>
      </select>
      <label>Tipo de hoja para imprimir</label>
      <select id="impHoja">
        <option>Hoja normal</option>
        <option>Hoja de color</option>
        <option>Hoja opalina</option>
        <option>Hoja fotográfica</option>
        <option>Hoja adhesiva</option>
      </select>
      <p class="small">Cartulina quedó solo para venderse individualmente, no para imprimir.</p>
      <label>Número de impresiones</label>
      <input id="impCantidad" type="number" step="1" inputmode="numeric" value="1" min="1" oninput="calcImp()">
      <div class="grid two">
        <div><label>Costo hoja compra</label><input id="impCostoHoja" type="number" step="0.01" inputmode="decimal" oninput="calcImp()"></div>
        <div><label>Costo tinta usada</label><input id="impCostoTinta" type="number" step="0.01" inputmode="decimal" oninput="calcImp()"></div>
        <div><label>Valor hoja venta</label><input id="impVentaHoja" type="number" step="0.01" inputmode="decimal" oninput="calcImp()"></div>
        <div><label>Valor tinta venta</label><input id="impVentaTinta" type="number" step="0.01" inputmode="decimal" oninput="calcImp()"></div>
      </div>
      <label>Comisión</label>
      <input id="impComision" type="number" step="0.01" inputmode="decimal" oninput="calcImp()">
      <div class="result">
        <p><span>Total</span><b id="impTotal">$0.00</b></p>
        <p><span>Ganancia</span><b id="impGanancia">$0.00</b></p>
      </div>
      <button class="primary" onclick="guardarImpresion()">💾 Guardar venta</button>
    </section>`);
}

function togglePapeleria(){
  const isImp = val("papTipo") === "impresion";
  document.getElementById("formHoja").classList.toggle("hidden", isImp);
  document.getElementById("formImp").classList.toggle("hidden", !isImp);
}

function calcHoja(){
  document.getElementById("hojaGanancia").textContent = money(num("hojaVenta") - num("hojaCosto"));
}

function calcImp(){
  const cantidad = Math.max(1, num("impCantidad") || 1);
  const total = ((num("impVentaHoja") + num("impVentaTinta")) * cantidad) + num("impComision");
  const costo = (num("impCostoHoja") + num("impCostoTinta")) * cantidad;
  document.getElementById("impTotal").textContent = money(total);
  document.getElementById("impGanancia").textContent = money(total - costo);
}

function guardarHoja(){
  const f = nowParts();
  const total = num("hojaVenta");
  const ganancia = total - num("hojaCosto");
  const venta = {
    usuario:currentUser().user,
    tipo:"Papelería",
    concepto:"Venta de hoja",
    detalle:`Tipo de hoja: ${val("hojaTipo")}\nCosto compra: ${money(num("hojaCosto"))}\nValor venta: ${money(total)}`,
    total,
    ganancia,
    ...f
  };
  guardarFinal(venta);
}

function guardarImpresion(){
  const cantidad = Math.max(1, num("impCantidad") || 1);
  const total = ((num("impVentaHoja") + num("impVentaTinta")) * cantidad) + num("impComision");
  const costo = (num("impCostoHoja") + num("impCostoTinta")) * cantidad;
  const f = nowParts();
  const venta = {
    usuario:currentUser().user,
    tipo:"Impresión",
    concepto:val("impTipo") || "Impresión",
    detalle:`Color: ${val("impColor")}\nHoja: ${val("impHoja")}\nCantidad: ${cantidad}\nCosto hoja: ${money(num("impCostoHoja"))}\nCosto tinta: ${money(num("impCostoTinta"))}\nValor hoja: ${money(num("impVentaHoja"))}\nValor tinta: ${money(num("impVentaTinta"))}\nComisión: ${money(num("impComision"))}`,
    total,
    ganancia:total-costo,
    ...f
  };
  guardarFinal(venta);
}

function formRecarga(){
  screen(`
    <section class="card">
      <h2>📱 Recargas o pagos</h2>
      <label>Tipo y nombre del servicio o compañía</label>
      <input id="recServicio" placeholder="Ejemplo: Telcel, CFE, agua, internet" oninput="calcRecarga()">
      <label>Monto</label>
      <input id="recMonto" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 100" oninput="calcRecarga()">
      <label>Comisión</label>
      <input id="recComision" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 5" oninput="calcRecarga()">
      <div class="result">
        <p><span>Total</span><b id="recTotal">$0.00</b></p>
        <p><span>Ganancia</span><b id="recGanancia">$0.00</b></p>
      </div>
      <button class="primary" onclick="guardarRecarga()">💾 Guardar venta</button>
    </section>`);
}

function calcRecarga(){
  document.getElementById("recTotal").textContent = money(num("recMonto") + num("recComision"));
  document.getElementById("recGanancia").textContent = money(num("recComision"));
}

function guardarRecarga(){
  const f = nowParts();
  const venta = {
    usuario:currentUser().user,
    tipo:"Recarga o pago",
    concepto:val("recServicio") || "Servicio",
    detalle:`Monto: ${money(num("recMonto"))}\nComisión: ${money(num("recComision"))}`,
    total:num("recMonto") + num("recComision"),
    ganancia:num("recComision"),
    ...f
  };
  guardarFinal(venta);
}

function formEmicar(){
  screen(`
    <section class="card">
      <h2>🪪 Emicar</h2>
      <label>Costo del material</label>
      <input id="emiCosto" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 10" oninput="calcEmicar()">
      <label>Valor de venta</label>
      <input id="emiVenta" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 25" oninput="calcEmicar()">
      <label>Comisión</label>
      <input id="emiComision" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 5" oninput="calcEmicar()">
      <div class="result">
        <p><span>Total</span><b id="emiTotal">$0.00</b></p>
        <p><span>Ganancia</span><b id="emiGanancia">$0.00</b></p>
      </div>
      <button class="primary" onclick="guardarEmicar()">💾 Guardar venta</button>
    </section>`);
}

function calcEmicar(){
  const total = num("emiVenta") + num("emiComision");
  const ganancia = total - num("emiCosto");
  document.getElementById("emiTotal").textContent = money(total);
  document.getElementById("emiGanancia").textContent = money(ganancia);
}

function guardarEmicar(){
  const total = num("emiVenta") + num("emiComision");
  const ganancia = total - num("emiCosto");
  const f = nowParts();
  const venta = {
    usuario:currentUser().user,
    tipo:"Emicar",
    concepto:"Emicar",
    detalle:`Costo del material: ${money(num("emiCosto"))}\nValor de venta: ${money(num("emiVenta"))}\nComisión: ${money(num("emiComision"))}`,
    total,
    ganancia,
    ...f
  };
  guardarFinal(venta);
}

function formEngargolar(){
  screen(`
    <section class="card">
      <h2>📚 Engargolar</h2>
      <label>Costo de impresión</label>
      <input id="engCostoImpresion" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 15" oninput="calcEngargolar()">
      <label>Costo del material</label>
      <input id="engCostoMaterial" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 10" oninput="calcEngargolar()">
      <label>Valor de la venta</label>
      <input id="engVenta" type="number" step="0.01" inputmode="decimal" placeholder="Ejemplo: 45" oninput="calcEngargolar()">
      <div class="result">
        <p><span>Total</span><b id="engTotal">$0.00</b></p>
        <p><span>Ganancia</span><b id="engGanancia">$0.00</b></p>
      </div>
      <button class="primary" onclick="guardarEngargolar()">💾 Guardar venta</button>
    </section>`);
}

function calcEngargolar(){
  const costoTotal = num("engCostoImpresion") + num("engCostoMaterial");
  const venta = num("engVenta");
  document.getElementById("engTotal").textContent = money(venta);
  document.getElementById("engGanancia").textContent = money(venta - costoTotal);
}

function guardarEngargolar(){
  const costoTotal = num("engCostoImpresion") + num("engCostoMaterial");
  const ventaValor = num("engVenta");
  const f = nowParts();
  const venta = {
    usuario:currentUser().user,
    tipo:"Engargolar",
    concepto:"Engargolado",
    detalle:`Costo de impresión: ${money(num("engCostoImpresion"))}\nCosto del material: ${money(num("engCostoMaterial"))}\nValor de la venta: ${money(ventaValor)}`,
    total:ventaValor,
    ganancia:ventaValor-costoTotal,
    ...f
  };
  guardarFinal(venta);
}

function guardarFinal(venta){
  saveVenta(venta);
  const ventas = getVentas();
  window.ventaTemporal = ventas[ventas.length - 1];
  checkSaleAlerts(window.ventaTemporal);
  screen(`
    <section class="card center">
      <h2>✅ Venta guardada</h2>
      <p>Total: <b>${money(venta.total)}</b></p>
      <p>Ganancia: <b>${money(venta.ganancia)}</b></p>
      <div class="actions">
        <button class="primary" onclick="imprimirTicket(window.ventaTemporal)">🧾 Imprimir ticket</button>
        <button class="success" onclick="nuevaVenta()">➕ Otra venta</button>
        <button class="secondary" onclick="menu()">🏠 Inicio</button>
      </div>
    </section>`);
}

function reportes(fecha=todayISO(), mes=monthISO()){
  if(!requireLogin()) return;
  const rd = reporteDia(fecha);
  const rm = reporteMes(mes);
  screen(`
    <section class="card">
      <h2>📊 Reportes</h2>
      <div class="grid two">
        <div><label>Día</label><input type="date" id="repFecha" value="${fecha}" onchange="verDia(this.value)"></div>
        <div><label>Mes</label><input type="month" id="repMes" value="${mes}" onchange="reportes(this.value + '-01', this.value)"></div>
      </div>
      <div class="stats" style="margin-top:12px">
        <div class="stat"><span>Día vendido</span><b>${money(rd.total)}</b><p class="small">${rd.count} venta(s)</p></div>
        <div class="stat"><span>Ganancia día</span><b>${money(rd.ganancia)}</b></div>
        <div class="stat"><span>Mes vendido</span><b>${money(rm.total)}</b><p class="small">Ganancia: ${money(rm.ganancia)}</p></div>
      </div>
    </section>

    <section class="card">
      <div class="calendar-head">
        <button class="ghost" onclick="reportes('${fecha}', '${addMonths(mes,-1)}')">◀</button>
        <h3>📆 Calendario ${mes}</h3>
        <button class="ghost" onclick="reportes('${fecha}', '${addMonths(mes,1)}')">▶</button>
      </div>
      ${renderCalendar(mes,"verDia")}
    </section>

    <section class="card">
      <h3>🧾 Ventas del día ${fecha}</h3>
      ${renderVentas(rd.ventas)}
    </section>

    <section class="card">
      <h3>📈 Gráfica mensual</h3>
      ${chartBarsFromDaily(mes)}
    </section>`);
}

function verDia(fecha){
  reportes(fecha, fecha.slice(0,7));
}

function renderVentas(ventas){
  if(!ventas.length) return `<p class="muted">No hay ventas este día.</p>`;
  return ventas.map(v => `
    <article class="sale-item">
      <div class="sale-top">
        <div>
          <span class="badge">${escapeHTML(v.hora)} · ${escapeHTML(v.tipo)}</span>
          <h3 style="margin-top:8px">${escapeHTML(v.concepto || "Venta")}</h3>
          <p class="small">Usuario: ${escapeHTML(v.usuario)}</p>
        </div>
        <div style="text-align:right">
          <b>${money(v.total)}</b><br><small>Ganancia: ${money(v.ganancia)}</small>
        </div>
      </div>
      <pre>${escapeHTML(v.detalle || "")}</pre>
      <div class="actions">
        <button class="primary" onclick="imprimirTicketById('${v.id}')">🧾 Ticket</button>
        <button class="danger" onclick="eliminarVenta('${v.id}')">🗑️ Eliminar</button>
      </div>
    </article>`).join("");
}

function eliminarVenta(id){
  if(confirm("¿Eliminar esta venta?")){
    deleteVenta(id);
    toast("Venta eliminada");
    reportes();
  }
}

function herramientas(){
  if(!requireLogin()) return;
  screen(`
    <section class="card">
      <h2>🧰 Herramientas</h2>
      <div class="actions">
        <button class="success" onclick="exportarExcelCSV()">📂 Exportar a Excel CSV</button>
        <button class="primary" onclick="exportarRespaldo()">☁️ Descargar respaldo seguro</button>
        <button class="warning" onclick="sincronizarTelefonos()">📲 Sincronizar teléfonos</button>
        <button class="secondary" onclick="alert(analisisIA())">🧠 Analizar negocio</button>
      </div>
      <label>Importar respaldo / sincronizar otro teléfono</label>
      <input type="file" accept="application/json" onchange="importarRespaldoFile(this.files[0])">
      <p class="small">Para sincronizar: descarga respaldo en un teléfono, envíalo al otro e impórtalo aquí.</p>
    </section>
    <section class="card">
      <h3>📈 Ganancia por tipo</h3>
      ${chartByType()}
    </section>`);
}

function configuracion(){
  if(!requireLogin()) return;
  const s = getSettings();
  screen(`
    <section class="card">
      <h2>⚙️ Configuración</h2>
      <label>Nombre del negocio</label>
      <input id="cfgName" value="${escapeHTML(s.businessName)}">
      <label>Meta diaria</label>
      <input id="cfgGoal" type="number" step="0.01" value="${Number(s.dailyGoal || 0)}">
      <label>Alerta de ganancia baja menor a</label>
      <input id="cfgLow" type="number" step="0.01" value="${Number(s.lowProfit || 0)}">
      <label>Texto al final del ticket</label>
      <input id="cfgFooter" value="${escapeHTML(s.ticketFooter)}">
      <button class="primary" onclick="guardarConfig()">Guardar configuración</button>
    </section>

    <section class="card">
      <h3>🔐 Cambiar contraseña</h3>
      <label>Contraseña actual</label>
      <input id="oldPass" type="password">
      <label>Nueva contraseña</label>
      <input id="newPass" type="password">
      <button class="warning" onclick="cambiarPass()">Cambiar contraseña</button>
    </section>

    <section class="card">
      <h3>👥 Usuarios</h3>
      <div class="grid two">
        <div><label>Nuevo usuario</label><input id="newUser"></div>
        <div><label>Contraseña</label><input id="newUserPass" type="password"></div>
      </div>
      <button class="success" onclick="crearUsuario()">Crear usuario</button>
      <hr style="border-color:var(--line);margin:16px 0">
      ${getUsers().map(u => `<p>👤 <b>${escapeHTML(u.user)}</b> · ${escapeHTML(u.role)}</p>`).join("")}
      <button class="danger" onclick="salir()">Cerrar sesión</button>
    </section>`);
}

function guardarConfig(){
  setSettings({
    businessName:val("cfgName") || "Control de Ventas",
    dailyGoal:num("cfgGoal"),
    lowProfit:num("cfgLow"),
    ticketFooter:val("cfgFooter") || "¡Gracias por su compra!"
  });
  toast("Configuración guardada");
  menu();
}

function cambiarPass(){
  try{
    if(changePassword(currentUser().user, val("oldPass"), val("newPass"))){
      toast("Contraseña cambiada");
      configuracion();
    }else{
      alert("Contraseña actual incorrecta");
    }
  }catch(e){ alert(e.message); }
}

function crearUsuario(){
  try{
    addUser(val("newUser"), val("newUserPass"));
    toast("Usuario creado");
    configuracion();
  }catch(e){
    alert(e.message);
  }
}

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js").catch(()=>{});
}

currentUser() ? menu() : loginPantalla();
