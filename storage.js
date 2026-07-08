const DB_KEYS = {
  ventas: "cv_ventas_v2",
  users: "cv_users_v2",
  session: "cv_session_v2",
  settings: "cv_settings_v2"
};

function uid(){
  return "v" + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function pad(n){ return String(n).padStart(2,"0"); }

function localDateParts(date = new Date()){
  const year = date.getFullYear();
  const month = pad(date.getMonth()+1);
  const day = pad(date.getDate());
  return {
    fecha:`${year}-${month}-${day}`,
    mes:`${year}-${month}`,
    hora:`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    timestamp:date.getTime()
  };
}

function nowParts(){ return localDateParts(); }
function todayISO(){ return localDateParts().fecha; }
function monthISO(){ return localDateParts().mes; }

function safeJSON(text, fallback){
  try{ return JSON.parse(text); }catch(e){ return fallback; }
}

function getVentas(){
  return safeJSON(localStorage.getItem(DB_KEYS.ventas) || "[]", []);
}

function setVentas(ventas){
  localStorage.setItem(DB_KEYS.ventas, JSON.stringify(ventas));
}

function saveVenta(venta){
  const ventas = getVentas();
  ventas.push({ id: uid(), createdAt: new Date().toISOString(), ...venta });
  setVentas(ventas);
}

function deleteVenta(id){
  setVentas(getVentas().filter(v => v.id !== id));
}

function num(id){
  const el = document.getElementById(id);
  if(!el) return 0;
  const n = Number(String(el.value).replace(",","."));
  return Number.isFinite(n) ? n : 0;
}

function val(id){
  const el = document.getElementById(id);
  return el ? String(el.value || "").trim() : "";
}

function money(n){
  return Number(n || 0).toLocaleString("es-MX", { style:"currency", currency:"MXN" });
}

function escapeHTML(text=""){
  return String(text).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[c]));
}

function getSettings(){
  const defaults = {
    businessName:"Control de Ventas",
    dailyGoal:500,
    lowProfit:10,
    ticketFooter:"¡Gracias por su compra!"
  };
  return { ...defaults, ...safeJSON(localStorage.getItem(DB_KEYS.settings) || "{}", {}) };
}

function setSettings(settings){
  localStorage.setItem(DB_KEYS.settings, JSON.stringify({ ...getSettings(), ...settings }));
}
