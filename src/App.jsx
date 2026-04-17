import { useState, useEffect } from "react";

// ─── CONFIG ────────────────────────────────────────────────
const PRECO_BASE     = 59.90;
const PRECO_BLOQUEIO = 20.00;
const WHATSAPP       = "5511971000304";

const PERIODOS = [
  { id: "mensal",    label: "Mensal",    meses: 1,  desconto: 0,    sub: "por mês" },
  { id: "bimestral", label: "Bimestral", meses: 2,  desconto: 0,    sub: "a cada 2 meses" },
  { id: "anual",     label: "Anual",     meses: 12, desconto: 0.10, sub: "por ano", badge: "10% OFF" },
];

const RECURSOS = [
  { icon: "📍", titulo: "Rastreamento em Tempo Real",  desc: "Veja onde seu carro está a qualquer hora, direto no seu celular." },
  { icon: "🛣️", titulo: "Histórico de Rotas",          desc: "Consulte todos os trajetos feitos pelo veículo quando quiser." },
  { icon: "⭕", titulo: "Cerca Eletrônica",             desc: "Defina uma área no mapa. Se o carro sair, você recebe um aviso." },
  { icon: "🔔", titulo: "Alertas de Movimentação",     desc: "Notificação imediata se o veículo for ligado ou movido." },
  { icon: "🚗", titulo: "Guincho 2× por Ano",          desc: "2 acionamentos de guincho por ano sem custo adicional.", destaque: true },
  { icon: "📱", titulo: "App FGL Brasil",              desc: "Aplicativo gratuito para iOS e Android, fácil de usar." },
];

function calc(pid, bloqueio) {
  const p   = PERIODOS.find(x => x.id === pid);
  const raw = (PRECO_BASE + (bloqueio ? PRECO_BLOQUEIO : 0)) * p.meses;
  return {
    total:    raw * (1 - p.desconto),
    base:     PRECO_BASE  * p.meses * (1 - p.desconto),
    bloq:     bloqueio ? PRECO_BLOQUEIO * p.meses * (1 - p.desconto) : 0,
    desconto: raw * p.desconto,
    ...p,
  };
}

const R = (v) => `R$ ${v.toFixed(2).replace(".", ",")}`;
// ───────────────────────────────────────────────────────────

export default function App() {
  const [periodo,  setPeriodo]  = useState("mensal");
  const [bloqueio, setBloqueio] = useState(false);
  const [aberto,   setAberto]   = useState(false);
  const [pulse,    setPulse]    = useState(true);

  // Para de piscar o card de bloqueio após 6 s ou quando selecionado
  useEffect(() => {
    if (bloqueio) { setPulse(false); return; }
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, [bloqueio]);

  const c   = calc(periodo, bloqueio);
  const por = PERIODOS.find(p => p.id === periodo);

  const enviar = () => {
    const msg =
      `Olá! Montei meu kit FGL Brasil 👇\n\n` +
      `📦 *Plano ${por.label}* (${por.meses} ${por.meses === 1 ? "mês" : "meses"})\n` +
      `• Rastreamento 24h com app\n` +
      `• Guincho 2× por ano ✅\n` +
      `• Bloqueio pelo celular: ${bloqueio ? "✅ Sim" : "❌ Não"}\n\n` +
      `💰 *Valores*\n` +
      `• Rastreamento: ${R(c.base)}\n` +
      (bloqueio ? `• Bloqueio: ${R(c.bloq)}\n` : "") +
      (c.desconto > 0 ? `• Desconto (${por.badge}): -${R(c.desconto)}\n` : "") +
      `• *Total: ${R(c.total)}*\n\n` +
      `Quero contratar! 🚗`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", minHeight: "100vh",
      background: "#060404",
      backgroundImage:
        "radial-gradient(ellipse 80vw 50vh at 15% 0%,   rgba(242,101,34,.10) 0%, transparent 70%)," +
        "radial-gradient(ellipse 60vw 40vh at 90% 100%, rgba(242,101,34,.07) 0%, transparent 70%)",
      color: "#fff", WebkitFontSmoothing: "antialiased" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── GLOW MIXIN ─────────────────────────────── */
        .glow-border {
          border: 2px solid #F26522 !important;
          box-shadow:
            0 0 0 1px rgba(242,101,34,.25),
            0 0 12px rgba(242,101,34,.45),
            0 0 28px rgba(242,101,34,.20),
            inset 0 0 12px rgba(242,101,34,.06);
          background: linear-gradient(135deg, #1c0900 0%, #120500 100%) !important;
        }

        /* ── PLANO CARD ─────────────────────────────── */
        .plano-card {
          flex: 1;
          min-width: 0;
          padding: 20px 14px 18px;
          border-radius: 14px;
          border: 2px solid #222;
          background: #0e0b0a;
          cursor: pointer;
          transition: border-color .2s, box-shadow .3s, background .2s;
          text-align: center;
          position: relative;
          outline: none;
        }
        .plano-card:hover:not(.glow-border) {
          border-color: rgba(242,101,34,.5);
          box-shadow: 0 0 14px rgba(242,101,34,.18);
        }

        /* ── BLOQUEIO CARD ───────────────────────────── */
        .bloq-card {
          width: 100%;
          border: 2px solid #2a2a2a;
          background: #0e0b0a;
          border-radius: 16px;
          padding: 22px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: pointer;
          transition: border-color .25s, box-shadow .35s, background .25s;
          text-align: left;
          outline: none;
        }
        .bloq-card:hover:not(.glow-border) {
          border-color: rgba(242,101,34,.5);
          box-shadow: 0 0 18px rgba(242,101,34,.2);
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 8px rgba(242,101,34,.25), 0 0 20px rgba(242,101,34,.10); border-color: rgba(242,101,34,.4); }
          50%      { box-shadow: 0 0 18px rgba(242,101,34,.55), 0 0 36px rgba(242,101,34,.22); border-color: rgba(242,101,34,.8); }
        }
        .bloq-pulse { animation: pulse-glow 1.8s ease-in-out infinite; }

        /* ── TOGGLE ─────────────────────────────────── */
        .tog-track {
          width: 58px; height: 32px; border-radius: 16px;
          background: #222; position: relative;
          transition: background .25s; flex-shrink: 0;
          box-shadow: inset 0 0 0 1.5px #333;
        }
        .tog-track.on { background: #F26522; box-shadow: 0 0 10px rgba(242,101,34,.5); }
        .tog-knob {
          width: 24px; height: 24px; border-radius: 50%; background: #fff;
          position: absolute; top: 4px; left: 4px;
          transition: left .25s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 1px 5px rgba(0,0,0,.5);
        }
        .tog-track.on .tog-knob { left: 30px; }

        /* ── BADGE ──────────────────────────────────── */
        .badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 900;
          padding: 4px 9px; border-radius: 6px;
          text-transform: uppercase; letter-spacing: .07em;
        }
        .badge-orange { background: #F26522; color: #fff; }
        .badge-green  { background: #1a4a1a; color: #7aff7a; border: 1px solid #3a7a3a; }
        .badge-blue   { background: #0a1a3a; color: #7ab0ff; border: 1px solid #1a3a7a; }

        /* ── FEAT ROW ────────────────────────────────── */
        .feat-row { display:flex; gap:14px; padding:14px 0; border-bottom:1px solid #161616; align-items:flex-start; }
        .feat-row:last-child { border-bottom:none; }

        /* ── BOTÃO WPP ──────────────────────────────── */
        .btn-wpp {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 22px; background: #25D366; border: none; border-radius: 16px;
          color: #fff; font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 900; letter-spacing: .07em; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 0 0 0 rgba(37,211,102,.0);
          transition: transform .15s, box-shadow .2s, opacity .15s;
        }
        .btn-wpp:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(37,211,102,.4), 0 0 0 2px rgba(37,211,102,.3);
        }
        .btn-wpp:active { transform: translateY(0); opacity: .92; }

        /* ── SEÇÃO LABEL ─────────────────────────────── */
        .sec-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: .18em; text-transform: uppercase;
          color: #F26522; margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .sec-label::before {
          content: ''; display: inline-block;
          width: 22px; height: 2.5px;
          background: #F26522; border-radius: 2px;
        }

        /* ── RESUMO LINHA ────────────────────────────── */
        .res-row {
          display:flex; justify-content:space-between; align-items:center;
          padding: 9px 0; border-bottom: 1px solid #1a1a1a; font-size:15px;
        }
        .res-row:last-child { border-bottom:none; }

        /* ── COLLAPSE BTN ───────────────────────────── */
        .col-btn {
          background: none; border: 1.5px solid #2a2a2a; border-radius: 8px;
          color: #F26522; font-size: 14px; font-weight: 700;
          padding: 8px 14px; cursor: pointer; white-space: nowrap;
          transition: border-color .2s, box-shadow .2s;
          font-family: 'Barlow Condensed', sans-serif; letter-spacing: .06em; text-transform: uppercase;
        }
        .col-btn:hover { border-color: #F26522; box-shadow: 0 0 8px rgba(242,101,34,.3); }
      `}</style>

      {/* ═══════════════ HEADER ═══════════════ */}
      <div style={{ background:"rgba(0,0,0,.6)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid #1a1a1a", padding:"18px 22px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:10 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26,
            letterSpacing:".06em", lineHeight:1,
            textShadow:"0 0 20px rgba(242,101,34,.3)" }}>
            FGL <span style={{color:"#F26522"}}>BRASIL</span>
          </div>
          <div style={{fontSize:13, color:"#aaa", marginTop:3}}>Rastreamento & Proteção Veicular</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#F26522" }}>3.000+</div>
          <div style={{fontSize:12, color:"#888"}}>clientes protegidos</div>
        </div>
      </div>

      {/* ═══════════════ BODY ═══════════════ */}
      <div style={{padding:"32px 22px 64px", maxWidth:520, margin:"0 auto"}}>

        {/* HERO */}
        <div style={{marginBottom:40}}>
          <div style={{fontSize:13, color:"#F26522", fontWeight:700, letterSpacing:".15em",
            textTransform:"uppercase", marginBottom:10, display:"flex", alignItems:"center", gap:8}}>
            <span style={{width:18, height:2, background:"#F26522", display:"inline-block", borderRadius:2}}/>
            Monte seu kit de proteção
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:46, fontWeight:900,
            lineHeight:1.05, marginBottom:14 }}>
            Proteja seu veículo<br/>
            <span style={{color:"#F26522", textShadow:"0 0 30px rgba(242,101,34,.4)"}}>do jeito certo.</span>
          </h1>
          <p style={{fontSize:17, color:"#ccc", lineHeight:1.65, maxWidth:400}}>
            Escolha as opções abaixo. O valor é calculado automaticamente e você envia tudo pelo WhatsApp em segundos.
          </p>
        </div>

        {/* ══════ PASSO 1 — VIGÊNCIA ══════ */}
        <div style={{marginBottom:32}}>
          <div className="sec-label">
            <span style={{background:"#F26522",color:"#fff",borderRadius:"50%",
              width:26,height:26,display:"inline-flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,flexShrink:0}}>1</span>
            Por quanto tempo?
          </div>

          <div style={{display:"flex", gap:10}}>
            {PERIODOS.map(p => {
              const base = PRECO_BASE * p.meses * (1 - p.desconto);
              const ativo = periodo === p.id;
              return (
                <button key={p.id}
                  className={`plano-card ${ativo ? "glow-border" : ""}`}
                  onClick={() => setPeriodo(p.id)}
                  aria-pressed={ativo}
                  aria-label={`Plano ${p.label}`}>

                  {p.badge && (
                    <div style={{position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap"}}>
                      <span className="badge badge-orange">{p.badge}</span>
                    </div>
                  )}

                  {ativo && (
                    <div style={{position:"absolute", top:10, right:10}}>
                      <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="#F26522"/><path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}

                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900,
                    textTransform:"uppercase", letterSpacing:".05em",
                    color: ativo ? "#fff" : "#bbb", marginBottom:8 }}>{p.label}</div>

                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900,
                    color: ativo ? "#F26522" : "#555", lineHeight:1,
                    textShadow: ativo ? "0 0 16px rgba(242,101,34,.5)" : "none" }}>
                    R${base.toFixed(2).replace(".",",")}
                  </div>

                  <div style={{fontSize:12, color: ativo ? "#aaa" : "#3a3a3a", marginTop:6}}>{p.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════ INCLUSO ══════ */}
        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid #1e1e1e",
          borderRadius:16, padding:"20px 18px", marginBottom:32 }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center",
            marginBottom: aberto ? 18 : 0}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:19, fontWeight:800,
                color:"#fff", textTransform:"uppercase", letterSpacing:".04em"}}>
                ✅ Tudo incluso no plano
              </div>
              <div style={{fontSize:14, color:"#aaa", marginTop:4}}>
                App + Rastreamento + Guincho + {RECURSOS.length} recursos
              </div>
            </div>
            <button className="col-btn" onClick={() => setAberto(!aberto)}>
              {aberto ? "Fechar ↑" : "Ver tudo ↓"}
            </button>
          </div>

          {aberto && RECURSOS.map((r, i) => (
            <div key={i} className="feat-row"
              style={r.destaque ? {background:"rgba(242,101,34,.06)", borderRadius:10,
                padding:"14px 12px", margin:"8px -8px", border:"1px solid rgba(242,101,34,.15)"} : {}}>
              <div style={{fontSize:26, flexShrink:0}}>{r.icon}</div>
              <div>
                <div style={{fontSize:16, fontWeight:700, color:"#fff", marginBottom:5,
                  display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
                  {r.titulo}
                  {r.destaque && <span className="badge badge-green">Incluso grátis</span>}
                </div>
                <div style={{fontSize:14, color:"#bbb", lineHeight:1.6}}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══════ PASSO 2 — BLOQUEIO ══════ */}
        <div style={{marginBottom:32}}>
          <div className="sec-label">
            <span style={{background:"#F26522",color:"#fff",borderRadius:"50%",
              width:26,height:26,display:"inline-flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,flexShrink:0}}>2</span>
            Adicional recomendado
          </div>

          {/* Destaque acima do card */}
          {!bloqueio && (
            <div style={{background:"rgba(242,101,34,.08)", border:"1px solid rgba(242,101,34,.2)",
              borderRadius:10, padding:"10px 16px", marginBottom:12, display:"flex",
              alignItems:"center", gap:10}}>
              <span style={{fontSize:18}}>💡</span>
              <span style={{fontSize:14, color:"#F26522", fontWeight:600, lineHeight:1.4}}>
                <strong>Mais de 70%</strong> dos nossos clientes adicionam o bloqueio. Só R$20/mês a mais!
              </span>
            </div>
          )}

          <button
            className={`bloq-card ${bloqueio ? "glow-border" : pulse ? "bloq-pulse" : ""}`}
            onClick={() => { setBloqueio(!bloqueio); setPulse(false); }}
            aria-pressed={bloqueio}
            aria-label="Adicionar bloqueio pelo celular">

            <div style={{fontSize:36, flexShrink:0}}>🔒</div>

            <div style={{flex:1}}>
              <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900,
                  textTransform:"uppercase", color:"#fff", letterSpacing:".04em"}}>
                  Bloqueio pelo Celular
                </span>
                <span className="badge badge-blue">Recomendado</span>
              </div>
              <div style={{fontSize:15, color:"#bbb", lineHeight:1.55, marginBottom:10}}>
                Bloqueie o veículo remotamente pelo app com 1 toque — ideal em caso de roubo ou emergência.
              </div>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900,
                  color:"#F26522", textShadow: bloqueio ? "0 0 12px rgba(242,101,34,.5)" : "none"}}>
                  + R$ 20,00<span style={{fontSize:14, color:"#aaa", fontWeight:400}}>/mês</span>
                </span>
              </div>
            </div>

            {/* Toggle */}
            <div className={`tog-track ${bloqueio ? "on" : ""}`} aria-hidden="true">
              <div className="tog-knob"/>
            </div>
          </button>
        </div>

        {/* ══════ RESUMO ══════ */}
        <div style={{
          background:"linear-gradient(135deg, #100500 0%, #0a0300 100%)",
          border:"2px solid #F26522",
          borderRadius:18, padding:"26px 22px", marginBottom:18,
          boxShadow:"0 0 0 1px rgba(242,101,34,.15), 0 0 40px rgba(242,101,34,.12)"}}>

          <div style={{fontSize:13, color:"#aaa", letterSpacing:".12em",
            textTransform:"uppercase", marginBottom:8}}>Resumo do seu kit</div>

          {/* Preço grande */}
          <div style={{display:"flex", alignItems:"flex-end", gap:6, marginBottom:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
              fontSize:26, color:"#fff", paddingBottom:10}}>R$</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
              fontSize:76, color:"#F26522", lineHeight:1,
              textShadow:"0 0 30px rgba(242,101,34,.5)"}}>
              {c.total.toFixed(2).replace(".",",")}
            </span>
          </div>
          <div style={{fontSize:15, color:"#bbb", marginBottom:22}}>
            {por.sub}
            {por.desconto > 0 &&
              <span style={{color:"#F26522", fontWeight:700, marginLeft:10}}>• {por.badge} ✓</span>}
          </div>

          {/* Detalhes */}
          <div style={{borderTop:"1px solid #2a1800", paddingTop:16, display:"flex", flexDirection:"column"}}>
            <div className="res-row">
              <span style={{color:"#ccc"}}>Rastreamento {por.label}</span>
              <span style={{color:"#fff", fontWeight:600}}>{R(c.base)}</span>
            </div>
            <div className="res-row">
              <span style={{color:"#ccc"}}>Guincho 2× por ano</span>
              <span style={{color:"#4aff88", fontWeight:700}}>Incluso ✅</span>
            </div>
            {bloqueio && (
              <div className="res-row">
                <span style={{color:"#ccc"}}>Bloqueio pelo celular</span>
                <span style={{color:"#fff", fontWeight:600}}>{R(c.bloq)}</span>
              </div>
            )}
            {c.desconto > 0 && (
              <div className="res-row">
                <span style={{color:"#4aff88"}}>Desconto ({por.badge})</span>
                <span style={{color:"#4aff88", fontWeight:700}}>− {R(c.desconto)}</span>
              </div>
            )}
            <div className="res-row" style={{borderTop:"1px solid #3a1800", marginTop:8,
              paddingTop:14, fontWeight:700, fontSize:17}}>
              <span style={{color:"#fff"}}>Total</span>
              <span style={{color:"#F26522", fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:24, textShadow:"0 0 12px rgba(242,101,34,.4)"}}>{R(c.total)}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="btn-wpp" onClick={enviar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.117 1.532 5.845L.057 23.41a.5.5 0 00.61.61l5.565-1.475A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.374l-.36-.214-3.3.875.875-3.3-.214-.36A9.818 9.818 0 1112 21.818z"/>
          </svg>
          Contratar pelo WhatsApp
        </button>

        <p style={{textAlign:"center", color:"#555", fontSize:14, marginTop:14, lineHeight:1.5}}>
          Ao clicar, o resumo do kit escolhido é enviado automaticamente para nossa equipe.
        </p>
      </div>
    </div>
  );
}
