import { motion } from "framer-motion";
import { MessageCircle, Eye } from "lucide-react";
import { T, getPhotoBlur, getTotalPct } from "../tokens";

export function Matches({ matches, onOpen, isPrem, currentUid }: any) {
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
            const bl = getPhotoBlur(0, m.mc, isPrem);
            const pc = getTotalPct(m.mc, isPrem);
            const last = m.msgs[m.msgs.length - 1];
            const firstPhoto = m.prof.photos?.[0] || m.prof.photoUrl;
            const isUnread = last && last.sid !== currentUid && !last.read;
            return (
              <motion.button key={m.id} whileTap={{ scale: 0.98 }} onClick={() => onOpen(m)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 14, background: isUnread ? "rgba(139,92,246,0.06)" : T.bgCard, borderRadius: 18, border: `1px solid ${isUnread ? T.ac : T.bd}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                  {firstPhoto ? (
                    <>
                      <img src={firstPhoto} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${bl}px)`, transform: "scale(1.1)" }} alt="" />
                      {bl > 0 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}><Eye size={16} color="rgba(255,255,255,0.6)" /></div>}
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${T.ac},${T.rose})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{m.prof.firstName?.[0]}</span>
                    </div>
                  )}
                  {isUnread && <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: T.ac, border: `2px solid ${T.bg}` }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: isUnread ? 800 : 700, color: T.tx }}>{m.prof.firstName}</span>
                    <span style={{ fontSize: 11, color: T.ac, fontWeight: 600 }}>{pc}% révélé</span>
                  </div>
                  <p style={{ fontSize: 13, color: isUnread ? T.tx : T.txM, fontWeight: isUnread ? 600 : 400, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {last ? (last.type === "voice" ? "🎤 Message vocal" : last.text) : "Commencez à discuter ! 💬"}
                  </p>
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