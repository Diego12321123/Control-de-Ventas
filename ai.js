function analisisIA(){
  const ventas = getVentas();
  if(!ventas.length) return "Aún no hay ventas. Registra ventas para poder analizar el negocio.";

  const total = ventas.reduce((s,v)=>s+Number(v.total||0),0);
  const ganancia = ventas.reduce((s,v)=>s+Number(v.ganancia||0),0);
  const margen = total ? (ganancia/total)*100 : 0;
  const tipos = resumenPorTipo(ventas);
  const mejorTipo = Object.entries(tipos).sort((a,b)=>b[1].ganancia-a[1].ganancia)[0];
  const peorTipo = Object.entries(tipos).sort((a,b)=>a[1].ganancia-b[1].ganancia)[0];

  const porDia = {};
  ventas.forEach(v=>{
    porDia[v.fecha] = porDia[v.fecha] || { total:0, ganancia:0, count:0 };
    porDia[v.fecha].total += Number(v.total||0);
    porDia[v.fecha].ganancia += Number(v.ganancia||0);
    porDia[v.fecha].count++;
  });
  const mejorDia = Object.entries(porDia).sort((a,b)=>b[1].ganancia-a[1].ganancia)[0];

  let consejo = "Sigue registrando todas tus ventas para tener mejores decisiones.";
  if(margen < 15) consejo = "Tu margen parece bajo. Revisa costos, comisiones y precios de venta.";
  else if(mejorTipo) consejo = `Potencia más el servicio de ${mejorTipo[0]}, porque es el que más ganancia genera.`;

  return `🧠 ANÁLISIS DEL NEGOCIO\n\n` +
    `Ventas registradas: ${ventas.length}\n` +
    `Total vendido: ${money(total)}\n` +
    `Ganancia total: ${money(ganancia)}\n` +
    `Margen aproximado: ${margen.toFixed(1)}%\n\n` +
    `Servicio más rentable: ${mejorTipo ? mejorTipo[0] + " (" + money(mejorTipo[1].ganancia) + ")" : "Sin datos"}\n` +
    `Servicio con menor ganancia: ${peorTipo ? peorTipo[0] + " (" + money(peorTipo[1].ganancia) + ")" : "Sin datos"}\n` +
    `Mejor día: ${mejorDia ? mejorDia[0] + " (" + money(mejorDia[1].ganancia) + ")" : "Sin datos"}\n\n` +
    `Recomendación: ${consejo}`;
}
