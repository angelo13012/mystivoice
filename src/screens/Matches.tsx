import { motion } from "framer-motion";
import { MessageCircle, Eye } from "lucide-react";
import { T, getBlur, getPct } from "../tokens";

export function Matches({ matches, onOpen, isPrem }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "16px 20px", paddingBottom: 100 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: T.tx, marginBottom: 20 }}>Conversations</h2>
      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <MessageCircle size={48} color={T.txD} style={{ marginBottom: 16 }} />
          <p style={{ color: T.txM, fontSize: 15 }}>Pas encore de match</p>
          <p style={{ color: T.txD, fontSize: 13, marginTop: 4 }}>Likez des profils pour commencer !</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {matches.map((m: any) => {
            const bl = getBlur(m.mc, isPrem);
            const pc = getPct(m.mc, isPrem);
            const last = m.msgs[m.msgs.length - 1];
            return (
              <motion.button key={m.id} whileTap={{ scale: 0.98 }} onClick={() => onOpen(m)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 14, background: T.bgCard, borderRadius: 18, border: `1px solid ${T.bd}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                  <img src={m.prof.photoUrl} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${bl}px)`, transform: "scale(1.1)" }} alt="" />
                  {bl > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}><Eye size={16} color="rgba(255,255,255,0.6)" /></div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>{m.prof.firstName}</span>
                    <span style={{ fontSize: 11, color: T.ac, fontWeight: 600 }}>{pc}% révélé</span>
                  </div>
                  <p style={{ fontSize: 13, color: T.txM, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last ? last.text : "Commencez à discuter ! 💬"}</p>
                  <div style={{ height: 3, borderRadius: 2, marginTop: 6, background: T.bgEl, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${pc}%`, background: `linear-gradient(90deg,${T.ac},${T.rose})`, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}