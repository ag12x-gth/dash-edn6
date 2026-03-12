import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { CONVIDADOS_RAW } from "./data/convidadosData";
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

export default function UnificadoDashboard() {
  const { kpis, chartData } = useMemo(() => {
    // Processar Convidados
    const convidados = CONVIDADOS_RAW.filter(r => r[1] && !["Teste","teste"].includes(r[2]) && r[0]).map(row => ({
      origem: "Convidado",
      ramo: row[1] || "Outros",
      faturamento: row[2] || "Não informado",
      desafio: row[3] || ""
    }));

    // Processar Compradores
    const compradores = COMPRADORES_RAW.map(row => ({
      origem: "Comprador",
      ramo: row[6] || "Outros",
      faturamento: row[8] || "Não informado",
      desafio: row[13] || ""
    }));

    const unificado = [...convidados, ...compradores];

    // KPIs
    const total = unificado.length;
    const totalConvidados = convidados.length;
    const totalCompradores = compradores.length;

    // Top Ramo Geral
    const ramosCount = {};
    unificado.forEach(d => {
      const ramos = d.ramo.split(',').map(r => r.trim());
      ramos.forEach(r => {
        ramosCount[r] = (ramosCount[r] || 0) + 1;
      });
    });
    const topRamo = Object.entries(ramosCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Top Faturamento Geral
    const fatCount = {};
    unificado.forEach(d => {
      fatCount[d.faturamento] = (fatCount[d.faturamento] || 0) + 1;
    });
    const topFaturamento = Object.entries(fatCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Gráficos
    // 1. Distribuição por Origem
    const origemData = [
      { name: "Convidados", value: totalConvidados },
      { name: "Compradores", value: totalCompradores }
    ];

    // 2. Faturamento Comparativo
    const fatOrder = [
      "Até R$ 300 mil",
      "De R$ 300 mil a R$ 500 mil",
      "De R$ 500 mil a R$ 1 milhão",
      "De R$ 1 milhão a R$ 2 milhões",
      "De R$ 2 milhões a R$ 5 milhões",
      "De R$ 5 milhões a R$ 10 milhões",
      "Acima de R$ 10 milhões",
      "Não informado"
    ];
    
    const fatComparativo = fatOrder.map(faixa => {
      const conv = convidados.filter(d => d.faturamento === faixa).length;
      const comp = compradores.filter(d => d.faturamento === faixa).length;
      return {
        faixa: faixa.replace("De R$ ","R$ ").replace("Até R$ ","≤ R$ ").replace("Acima de R$ ","＋R$ "),
        Convidados: conv,
        Compradores: comp,
        Total: conv + comp
      };
    }).filter(d => d.Total > 0);

    // 3. Top Ramos Comparativo
    const topRamosNames = Object.entries(ramosCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(r => r[0]);

    const ramosComparativo = topRamosNames.map(ramo => {
      const conv = convidados.filter(d => d.ramo.includes(ramo)).length;
      const comp = compradores.filter(d => d.ramo.includes(ramo)).length;
      return {
        ramo,
        Convidados: conv,
        Compradores: comp
      };
    });

    return {
      kpis: {
        total,
        totalConvidados,
        totalCompradores,
        topRamo,
        topFaturamento
      },
      chartData: {
        origem: origemData,
        faturamento: fatComparativo,
        ramos: ramosComparativo
      }
    };
  }, []);

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
            <div style={{ fontSize:10, color:"#5A4020", letterSpacing:".12em", textTransform:"uppercase" }}>Dashboard Unificado (Geral)</div>
          </div>
        </div>
        <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          <div style={{ display:"flex", gap:8 }}>
            <a href="/dash-edn6/" style={{ fontSize:11, color:"#8B7050", textDecoration:"none", border:`1px solid ${BORDER}`, padding:"4px 8px", borderRadius:4 }}>Convidados</a>
            <a href="/dash-edn6/compradores.html" style={{ fontSize:11, color:"#8B7050", textDecoration:"none", border:`1px solid ${BORDER}`, padding:"4px 8px", borderRadius:4 }}>Compradores</a>
          </div>
          <div style={{ fontSize:11, color:"#5A4020", marginTop:4 }}>{new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}</div>
          <div style={{ fontSize:9, color:"#3A2A10", letterSpacing:".1em" }}>CONFIDENCIAL</div>
        </div>
      </div>

      <div style={{ padding:"28px 36px", maxWidth:1360, margin:"0 auto" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20, marginBottom:32 }}>
          <KPI icon="📊" label="Total Geral" value={kpis.total} sub="Participantes totais" delay={100} />
          <KPI icon="🎟️" label="Convidados" value={kpis.totalConvidados} sub={`${Math.round((kpis.totalConvidados/kpis.total)*100)}% do total`} delay={200} accent="#A07838" />
          <KPI icon="💳" label="Compradores" value={kpis.totalCompradores} sub={`${Math.round((kpis.totalCompradores/kpis.total)*100)}% do total`} delay={300} accent="#E8C97A" />
          <KPI icon="🏢" label="Principal Ramo" value={kpis.topRamo} sub="Setor mais representativo" delay={400} />
          <KPI icon="💰" label="Faturamento Predominante" value={kpis.topFaturamento} sub="Faixa mais comum" delay={500} />
        </div>

        {/* Gráficos */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(500px, 1fr))", gap:24, marginBottom:32 }}>
          
          {/* Distribuição por Origem */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Distribuição do Público</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.origem}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    <Cell fill="#A07838" />
                    <Cell fill="#E8C97A" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#8B7050" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Faturamento Comparativo */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Faturamento: Convidados vs Compradores</div>
            <div style={{ height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.faturamento} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A1F08" />
                  <XAxis dataKey="faixa" stroke="#5A4020" tick={{fill:"#8B7050", fontSize:10}} />
                  <YAxis stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1A1208'}} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#8B7050" }} />
                  <Bar dataKey="Convidados" fill="#A07838" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Compradores" fill="#E8C97A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ramos Comparativo */}
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:24, gridColumn: "1 / -1" }}>
            <div style={{ fontSize:14, fontWeight:600, color:GOLD2, letterSpacing:".05em", textTransform:"uppercase", marginBottom:20 }}>Top Ramos de Atividade: Convidados vs Compradores</div>
            <div style={{ height:350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.ramos} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2A1F08" />
                  <XAxis type="number" stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <YAxis dataKey="ramo" type="category" width={120} stroke="#5A4020" tick={{fill:"#8B7050", fontSize:11}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1A1208'}} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#8B7050" }} />
                  <Bar dataKey="Convidados" stackId="a" fill="#A07838" />
                  <Bar dataKey="Compradores" stackId="a" fill="#E8C97A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
