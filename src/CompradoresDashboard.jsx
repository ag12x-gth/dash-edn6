import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { COMPRADORES_RAW } from "./data/compradoresData";

const GOLD = "#C9A84C";
const GOLD2 = "#E8C97A";
const DARK = "#0C0A06";
const CARD = "#131009";
const BORDER = "#271E09";
const SECTOR_COLORS = ["#C9A84C","#A07838","#E8C97A","#8B6518","#F5E4A0","#6B4D14","#D4A850","#9A7030","#B88C3C","#7A5C22"];

function KPI({ icon, label, value, sub, accent = GOLD, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.55s cubic-bezier(.16,1,.3,1)",
      background: "linear-gradient(145deg,#171209,#1F1608)", border: `1px solid ${BORDER}`,
      borderTop: `2px solid ${accent}`, borderRadius: 14, padding: "22px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position:"absolute",top:-20,right:-20,width:90,height:90,background:`radial-gradient(circle,${accent}18 0%,transparent 70%)`,borderRadius:"50%" }}/>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 30, fontWeight: 800, color: accent, lineHeight:1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#8B7050", letterSpacing:"0.09em", textTransform:"uppercase", fontWeight:600 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#5A4020", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1A1208", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px" }}>
      <div style={{ color: GOLD2, fontSize:12, fontWeight:600, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:"#A07030", fontSize:11 }}>{p.name}: <span style={{color:GOLD}}>{p.value}</span></div>
      ))}
    </div>
  );
};

export default function CompradoresDashboard() {
  const { data, kpis } = useMemo(() => {
    // Processar os dados brutos
    const processedData = COMPRADORES_RAW.map(row => ({
      data: row[0],
      nome: row[1],
      cidade: row[5],
      ramo: row[6],
      tempoMercado: row[7],
      faturamento: row[8],
      socio: row[10],
      objetivo: row[11],
      desafios: row[13],
      areaConhecimento: row[14]
    }));

    // Calcular KPIs
    const total = processedData.length;
    const comSocio = processedData.filter(d => d.socio && d.socio.toLowerCase() === 'sim').length;
    const semSocio = processedData.filter(d => d.socio && d.socio.toLowerCase() === 'não').length;

    // Top Ramo
    const ramosCount = {};
    processedData.forEach(d => {
      const ramos = d.ramo ? d.ramo.split(',').map(r => r.trim()) : ['Outros'];
      ramos.forEach(r => {
        ramosCount[r] = (ramosCount[r] || 0) + 1;
      });
    });
    const topRamo = Object.entries(ramosCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Top Faturamento
    const fatCount = {};
    processedData.forEach(d => {
      const fat = d.faturamento || "Não informado";
      fatCount[fat] = (fatCount[fat] || 0) + 1;
    });
    const topFaturamento = Object.entries(fatCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      data: processedData,
      kpis: {
        total,
        comSocio,
        semSocio,
        topRamo,
        topFaturamento
      }
    };
  }, []);

  // Preparar dados para os gráficos
  const chartData = useMemo(() => {
    if (data.length === 0) return { ramos: [], faturamento: [], tempo: [], areas: [] };

    // 1. Ramos de Atividade
    const ramosMap = {};
    data.forEach(d => {
      const ramos = d.ramo ? d.ramo.split(',').map(r => r.trim()) : ['Outros'];
      ramos.forEach(r => {
        ramosMap[r] = (ramosMap[r] || 0) + 1;
      });
    });
    const ramosData = Object.entries(ramosMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8

    // 2. Faturamento
    const fatMap = {};
    data.forEach(d => {
      const fat = d.faturamento || "Não informado";
      fatMap[fat] = (fatMap[fat] || 0) + 1;
    });
    const faturamentoData = Object.entries(fatMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 3. Tempo de Mercado
    const tempoMap = {};
    data.forEach(d => {
      const tempo = d.tempoMercado || "Não informado";
      tempoMap[tempo] = (tempoMap[tempo] || 0) + 1;
    });
    const tempoData = Object.entries(tempoMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 4. Áreas de Conhecimento
    const areasMap = {};
    data.forEach(d => {
      const area = d.areaConhecimento || "Não informado";
      areasMap[area] = (areasMap[area] || 0) + 1;
    });
    const areasData = Object.entries(areasMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6

    return {
      ramos: ramosData,
      faturamento: faturamentoData,
      tempo: tempoData,
      areas: areasData
    };
  }, [data]);

  return (
    <div style={{ minHeight:"100vh", background: DARK, fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#D4B896" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-thumb { background:#2A1F08; border-radius:3px }
      `}</style>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(90deg,#0C0A06,#1A1208,#0C0A06)", borderBottom:`1px solid ${BORDER}`, padding:"18px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:38, height:38, background:`linear-gradient(135deg,${GOLD},#7A5010)`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 18px ${GOLD}40` }}>◆</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:800, color:GOLD2, letterSpacing:"-0.02em" }}>ENCONTRO DE NEGÓCIOS</div>
            <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase" }}>Dashboard de Compradores</div>
          </div>
        </div>
        <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          <div style={{ display:"flex", gap:8 }}>
            <a href="/dash-edn6/" style={{ fontSize:11, color:"#8B7050", textDecoration:"none", border:`1px solid ${BORDER}`, padding:"4px 8px", borderRadius:4 }}>Convidados</a>
            <a href="/dash-edn6/unificado.html" style={{ fontSize:11, color:"#8B7050", textDecoration:"none", border:`1px solid ${BORDER}`, padding:"4px 8px", borderRadius:4 }}>Unificado</a>
          </div>
          <div style={{ fontSize:11, color:"#5A4020", marginTop:4 }}>{new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}</div>
          <div style={{ fontSize:9, color:"#3A2A10", letterSpacing:".1em" }}>CONFIDENCIAL</div>
        </div>
      </div>

      <div style={{ padding:"28px 36px", maxWidth:1360, margin:"0 auto" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:20, marginBottom:32 }}>
          <KPI icon="👥" label="Total de Compradores" value={kpis.total} sub="Inscritos na planilha" delay={100} />
          <KPI icon="🤝" label="Possuem Sócio" value={`${Math.round((kpis.comSocio / kpis.total) * 100 || 0)}%`} sub={`${kpis.comSocio} de ${kpis.total} empresas`} delay={200} />
          <KPI icon="🏢" label="Principal Ramo" value={kpis.topRamo} sub="Setor mais representativo" delay={300} />
          <KPI icon="💰" label="Faturamento Predominante" value={kpis.topFaturamento} sub="Faixa mais comum" delay={400} />
        </div>

        {/* Gráficos */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(500px, 1fr))", gap:24, marginBottom:32 }}>
          
          {/* Ramo de Atividade */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Top Ramos de Atividade</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.ramos} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2A1F08" />
                  <XAxis type="number" stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <YAxis dataKey="name" type="category" width={120} stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1A1208'}} />
                  <Bar dataKey="value" fill={GOLD} radius={[0, 4, 4, 0]} name="Empresas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Faturamento */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Distribuição por Faturamento</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.faturamento}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.faturamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tempo de Mercado */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Tempo de Mercado</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.tempo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1F08" />
                  <XAxis dataKey="name" stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <YAxis stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1A1208'}} />
                  <Bar dataKey="value" fill={GOLD2} radius={[4, 4, 0, 0]} name="Empresas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Áreas de Conhecimento */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Áreas de Conhecimento Buscadas</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.areas}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.areas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[(index + 2) % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
