import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Send, Volume2 } from "lucide-react";
import { T, getBlur, getPct, getLeft } from "../tokens";

export function Chat({ match, onSend, onBack, isPrem }: any) {
  const [inp, setInp] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const bl = getBlur(match.mc, isPrem);
  const pc = getPct(match.mc, isPrem);
  const left = getLeft(match.mc, isPrem);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [match.msgs]);

  const send = () => { if (!inp.trim()) return; onSend(match.id, inp.trim()); setInp(""); };

  return (
    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 4px)" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", background: T.bgCard, borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.txM, display: "flex" }}><ArrowLeft size={22} /></button>
        <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
          <img src={match.prof.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${bl}px)`, transform: "scale(1.1)" }} alt="" />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>{match.prof.firstName}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <div style={{ height: 3, flex: 1, borderRadius: 2, background: T.bgEl, overflow: "hidden", maxWidth: 100 }}>
              <div style={{ height: "100%", borderRadius: 2, width: `${pc}%`, background: `linear-gradient(90deg,${T.ac},${T.rose})` }} />
            </div>
            <span style={{ fontSize: 11, color: T.ac, fontWeight: 600 }}>{pc}%</span>
          </div>
        </div>
      </div>

      {/* Hint */}
      {left > 0 && (
        <div style={{ padding: "8px 16px", textAlign: "center", background: "rgba(139,92,246,0.06)", borderBottom: `1px solid ${T.bd}` }}>
          <p style={{ fontSize: 12, color: T.ac }}>✨ Plus que <strong>{left} messages</strong> pour voir son visage{!isPrem && <span style={{ color: T.gold }}> · Premium = 2× plus rapide</span>}</p>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {match.msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Volume2 size={40} color={T.txD} style={{ marginBottom: 12 }} />
            <p style={{ color: T.txM, fontSize: 14 }}>Envoyez votre premier message !</p>
          </div>
        )}
        {match.msgs.map((m: any) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ alignSelf: m.sid === "me" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div style={{ padding: "12px 16px", borderRadius: 18, background: m.sid === "me" ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: m.sid === "me" ? "#fff" : T.tx, fontSize: 14, lineHeight: 1.5, borderBottomRightRadius: m.sid === "me" ? 4 : 18, borderBottomLeftRadius: m.sid === "me" ? 18 : 4 }}>
              {m.text}
            </div>
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", background: T.bgCard, borderTop: `1px solid ${T.bd}`, display: "flex", gap: 10, alignItems: "center" }}>
        <button style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: T.bgEl, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.ac }}><Mic size={20} /></button>
        <input value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Écris quelque chose..."
          style={{ flex: 1, background: T.bgEl, border: `1px solid ${T.bd}`, borderRadius: 50, padding: "12px 18px", color: T.tx, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={send}
          style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.ac},${T.acD})`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={18} color="#fff" />
        </motion.button>
      </div>
    </motion.div>
  );
}