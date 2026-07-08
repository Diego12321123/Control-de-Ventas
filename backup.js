function exportarRespaldo(){
  const data = {
    app:"Control de Ventas",
    version:2,
    exportedAt:new Date().toISOString(),
    users:getUsers(),
    ventas:getVentas(),
    settings:getSettings()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `respaldo-control-ventas-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importarRespaldoFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const data = JSON.parse(reader.result);
      if(!Array.isArray(data.ventas) || !Array.isArray(data.users)) throw new Error("Archivo inválido.");
      if(!confirm("Esto reemplazará usuarios, ventas y configuración. ¿Continuar?")) return;
      setVentas(data.ventas);
      setUsers(data.users);
      setSettings(data.settings || {});
      toast("Respaldo importado correctamente");
      menu();
    }catch(e){
      alert("No se pudo importar el respaldo: " + e.message);
    }
  };
  reader.readAsText(file);
}

function sincronizarTelefonos(){
  exportarRespaldo();
  alert("Se descargó un respaldo. Envíalo al otro teléfono por WhatsApp, Bluetooth o correo. En el otro teléfono entra a Herramientas > Importar respaldo.");
}
