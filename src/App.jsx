import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const COLORS = ["#C9A84C", "#E8C97A", "#8B6914", "#F5DFA0", "#6B4F10"];

const KPICard = ({ label, value, sub, trend, icon, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      background: "linear-gradient(135deg, #1A1208 0%, #231A0A 100%)",
      border: "1px solid #3A2A0A",
      borderRadius: 16,
      padding: "24px 28px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: 100, height: 100,
        background: "radial-gradient(circle at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 70%)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            color: trend >= 0 ? "#4ADE80" : "#F87171",
            background: trend >= 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${trend >= 0 ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: 6, padding: "3px 8px",
          }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#C9A84C", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#8B7355", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#5A4A30", marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

const PainCard = ({ title, severity, description, idx }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), idx * 120 + 300); }, [idx]);
  const colors = { Alta: "#F87171", Média: "#FBBF24", Baixa: "#4ADE80" };
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(-20px)",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      background: "#12100A",
      border: "1px solid #2A200A",
      borderLeft: `3px solid ${colors[severity] || "#C9A84C"}`,
      borderRadius: "0 12px 12px 0",
      padding: "16px 20px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#E8C97A" }}>{title}</span>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          color: colors[severity] || "#C9A84C",
          background: `${colors[severity] || "#C9A84C"}18`,
          border: `1px solid ${colors[severity] || "#C9A84C"}40`,
          borderRadius: 4, padding: "2px 7px",
        }}>{severity}</span>
      </div>
      <div style={{ fontSize: 12, color: "#6B5A3A", lineHeight: 1.5 }}>{description}</div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
    <div style={{
      width: 48, height: 48, border: "3px solid #2A200A",
      borderTop: "3px solid #C9A84C", borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }} />
    <span style={{ color: "#8B7355", fontSize: 13, letterSpacing: "0.06em" }}>Analisando dados com IA...</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const formatCurrency = (val) => {
  if (typeof val !== "number") return val;
  if (val >= 1000000) return `R$ ${(val/1000000).toFixed(1)}M`;
  if (val >= 1000) return `R$ ${(val/1000).toFixed(0)}K`;
  return `R$ ${val.toFixed(0)}`;
};

export default function Dashboard() {
  const [rawData, setRawData] = useState("");
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputVisible, setInputVisible] = useState(true);

  const analyzeData = async () => {
    if (!rawData.trim()) { setError("Cole os dados da planilha primeiro."); return; }
    setLoading(true);
    setError("");

    const prompt = `Você é um analista de negócios especialista em KPIs executivos. Analise os dados abaixo e retorne SOMENTE um JSON válido com esta estrutura exata (sem markdown, sem explicações):

{
  "nicho": "nome do nicho/segmento de mercado identificado",
  "nichoDescricao": "descrição curta e impactante do nicho",
  "kpis": [
    { "label": "Nome KPI", "value": "valor formatado", "trend": número_percentual_ou_null, "icon": "emoji", "sub": "contexto adicional" }
  ],
  "faturamento": [
    { "periodo": "Jan", "receita": número, "meta": número, "crescimento": número }
  ],
  "dores": [
    { "title": "Nome da Dor", "severity": "Alta|Média|Baixa", "description": "descrição da dor de negócio" }
  ],
  "nichoMetrics": [
    { "metric": "nome métrica", "value": número_0_a_100 }
  ],
  "topInsight": "insight executivo mais importante em 1 frase",
  "alertas": ["alerta 1", "alerta 2"],
  "oportunidades": ["oportunidade 1", "oportunidade 2"]
}

Regras:
- Extraia o máximo de KPIs relevantes (mín 4, máx 8)
- Faturamento: extraia dados de período (até 12 períodos)
- Dores: identifique problemas reais no negócio (mín 3)
- nichoMetrics: 5 dimensões relevantes ao nicho (0-100)
- Se um campo não tiver dados, use valores estimados coerentes com o contexto
- trend: positivo = crescimento, negativo = queda, null = sem dado

DADOS DA PLANILHA:
${rawData.substring(0, 6000)}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setDashData(parsed);
      setInputVisible(false);
    } catch (e) {
      setError("Erro ao analisar dados. Verifique se os dados estão no formato correto.");
    }
    setLoading(false);
  };

  const GF = (v) => typeof v === "number" ? formatCurrency(v) : v;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0C0A06",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#D4B896",
      padding: dashData ? "0" : "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0C0A06; }
        ::-webkit-scrollbar-thumb { background: #2A1F08; border-radius: 3px; }
        textarea:focus { outline: none !important; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(90deg, #0C0A06 0%, #1A1208 50%, #0C0A06 100%)",
        borderBottom: "1px solid #2A1F08",
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, background: "linear-gradient(135deg, #C9A84C, #8B6914)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 20px rgba(201,168,76,0.3)",
          }}>◆</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#E8C97A", letterSpacing: "-0.02em" }}>
              EXECUTIVE DASHBOARD
            </div>
            <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Análise Estratégica de KPIs
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {dashData && (
            <button onClick={() => setInputVisible(!inputVisible)} style={{
              background: "transparent", border: "1px solid #3A2A0A",
              color: "#8B7355", borderRadius: 8, padding: "8px 16px",
              fontSize: 12, cursor: "pointer", letterSpacing: "0.06em",
            }}>
              {inputVisible ? "▲ Fechar" : "✎ Atualizar Dados"}
            </button>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#5A4A2A" }}>
              {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
            <div style={{ fontSize: 10, color: "#3A2A10", letterSpacing: "0.08em" }}>CONFIDENCIAL</div>
          </div>
        </div>
      </div>

      {/* DATA INPUT */}
      {inputVisible && (
        <div style={{
          background: "linear-gradient(180deg, #100E08 0%, #0C0A06 100%)",
          borderBottom: "1px solid #2A1F08",
          padding: "32px 40px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {!dashData && (
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#C9A84C", marginBottom: 8 }}>
                  Cole os dados da sua planilha
                </div>
                <div style={{ color: "#5A4A2A", fontSize: 14 }}>
                  Copie o conteúdo da planilha (Ctrl+A → Ctrl+C) e cole abaixo. A IA extrai os KPIs automaticamente.
                </div>
              </div>
            )}
            <textarea
              value={rawData}
              onChange={e => setRawData(e.target.value)}
              placeholder="Cole aqui os dados da planilha (valores separados por tabulação, vírgula ou qualquer formato)..."
              style={{
                width: "100%", minHeight: 160, background: "#12100A",
                border: "1px solid #2A1F08", borderRadius: 12,
                color: "#C9A84C", fontSize: 13, padding: 20,
                resize: "vertical", fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            />
            {error && <div style={{ color: "#F87171", fontSize: 12, marginTop: 8 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <button onClick={analyzeData} disabled={loading} style={{
                background: loading ? "#2A1F08" : "linear-gradient(135deg, #C9A84C, #8B6914)",
                color: loading ? "#5A4A2A" : "#0C0A06",
                border: "none", borderRadius: 10, padding: "14px 40px",
                fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
                boxShadow: loading ? "none" : "0 8px 24px rgba(201,168,76,0.3)",
                transition: "all 0.3s",
              }}>
                {loading ? "Analisando..." : "⚡ Gerar Dashboard com IA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {/* DASHBOARD CONTENT */}
      {dashData && !loading && (
        <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto" }}>

          {/* NICHO BANNER */}
          <div style={{
            background: "linear-gradient(135deg, #1A1208 0%, #231A0A 60%, #1A1208 100%)",
            border: "1px solid #3A2A0A",
            borderRadius: 20, padding: "28px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 28, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40, width: 200, height: 200,
              background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: 200, width: 150, height: 150,
              background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
              borderRadius: "50%",
            }} />
            <div>
              <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                SEGMENTO / NICHO DE MERCADO
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: "#C9A84C", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {dashData.nicho}
              </div>
              <div style={{ color: "#8B7355", fontSize: 15, marginTop: 8, maxWidth: 500 }}>
                {dashData.nichoDescricao}
              </div>
            </div>
            <div style={{
              background: "#0C0A0680", border: "1px solid #3A2A0A",
              borderRadius: 14, padding: "20px 28px", textAlign: "center", minWidth: 200,
            }}>
              <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.1em", marginBottom: 8 }}>TOP INSIGHT</div>
              <div style={{ fontSize: 13, color: "#E8C97A", lineHeight: 1.5, fontStyle: "italic" }}>
                "{dashData.topInsight}"
              </div>
            </div>
          </div>

          {/* KPI CARDS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(dashData.kpis?.length || 4, 4)}, 1fr)`,
            gap: 16, marginBottom: 28,
          }}>
            {(dashData.kpis || []).map((k, i) => (
              <KPICard key={i} {...k} delay={i * 100} />
            ))}
          </div>

          {/* CHARTS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>
            {/* FATURAMENTO CHART */}
            <div style={{
              background: "#12100A", border: "1px solid #2A1F08",
              borderRadius: 16, padding: "24px 28px",
            }}>
              <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Evolução de Faturamento</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A84C" }}>Receita vs. Meta</div>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                  <span style={{ color: "#C9A84C" }}>● Receita</span>
                  <span style={{ color: "#3A2A0A", borderColor: "#3A2A0A" }}>◌ Meta</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={dashData.faturamento || []}>
                  <defs>
                    <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3A2A0A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3A2A0A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" />
                  <XAxis dataKey="periodo" tick={{ fill: "#5A4A2A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#5A4A2A", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v)} />
                  <Tooltip
                    contentStyle={{ background: "#1A1208", border: "1px solid #3A2A0A", borderRadius: 8, color: "#C9A84C" }}
                    formatter={(v, n) => [formatCurrency(v), n === "receita" ? "Receita" : "Meta"]}
                  />
                  <Area type="monotone" dataKey="meta" stroke="#3A2A0A" strokeWidth={1} strokeDasharray="5 3" fill="url(#metaGrad)" />
                  <Area type="monotone" dataKey="receita" stroke="#C9A84C" strokeWidth={2.5} fill="url(#recGrad)" dot={{ fill: "#C9A84C", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* NICHO RADAR */}
            <div style={{
              background: "#12100A", border: "1px solid #2A1F08",
              borderRadius: 16, padding: "24px 28px",
            }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Perfil do Nicho</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A84C" }}>Dimensões Estratégicas</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={dashData.nichoMetrics || []}>
                  <PolarGrid stroke="#2A1F08" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#5A4A2A", fontSize: 10 }} />
                  <Radar name="Score" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DORES + ALERTAS + OPORTUNIDADES */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 20 }}>
            {/* DORES */}
            <div style={{
              background: "#12100A", border: "1px solid #2A1F08",
              borderRadius: 16, padding: "24px 28px",
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Principais Dores do Negócio</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#F87171" }}>Pontos de Atenção Críticos</div>
              </div>
              {(dashData.dores || []).map((d, i) => (
                <PainCard key={i} {...d} idx={i} />
              ))}
            </div>

            {/* ALERTAS + OPORTUNIDADES */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                background: "#12100A", border: "1px solid #F8717130",
                borderRadius: 16, padding: "20px 24px", flex: 1,
              }}>
                <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>⚠ Alertas</div>
                {(dashData.alertas || []).map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    marginBottom: 10, fontSize: 12, color: "#B07070", lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#F87171", marginTop: 1, flexShrink: 0 }}>▸</span>
                    {a}
                  </div>
                ))}
              </div>

              <div style={{
                background: "#12100A", border: "1px solid #4ADE8030",
                borderRadius: 16, padding: "20px 24px", flex: 1,
              }}>
                <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>✦ Oportunidades</div>
                {(dashData.oportunidades || []).map((o, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    marginBottom: 10, fontSize: 12, color: "#70B070", lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#4ADE80", marginTop: 1, flexShrink: 0 }}>▸</span>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FATURAMENTO BAR CHART */}
          {dashData.faturamento?.length > 0 && (
            <div style={{
              background: "#12100A", border: "1px solid #2A1F08",
              borderRadius: 16, padding: "24px 28px",
            }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#5A4A2A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Performance por Período</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A84C" }}>Crescimento Acumulado</div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dashData.faturamento} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A150A" vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fill: "#5A4A2A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#5A4A2A", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip
                    contentStyle={{ background: "#1A1208", border: "1px solid #3A2A0A", borderRadius: 8, color: "#C9A84C" }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Bar dataKey="receita" fill="#C9A84C" radius={[4, 4, 0, 0]} opacity={0.9} />
                  <Bar dataKey="crescimento" fill="#3A2A0A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* FOOTER */}
          <div style={{ textAlign: "center", padding: "32px 0 16px", borderTop: "1px solid #1A150A", marginTop: 28 }}>
            <div style={{ fontSize: 11, color: "#3A2A10", letterSpacing: "0.1em" }}>
              DOCUMENTO CONFIDENCIAL — Gerado com IA · {new Date().toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
