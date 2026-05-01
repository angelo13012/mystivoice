import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Send, Volume2, Lock, Eye } from "lucide-react";
import { T, getPhotoBlur, isPhotoUnlocked, getMessagesLeft, getNextUnlockAt } from "../tokens";

export function Chat({ match, onSend, onBack, isPrem }: any) {
  const [inp, setInp] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const mc = match.mc;
  const photos: string[] = match.prof.photos || (match.prof.photoUrl ? [match.prof.photoUrl] : []);
  const left = getMessagesLeft(mc, isPrem);
  const nextAt = getNextUnlockAt(mc, isPrem);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [match.msgs]);

  const send = () => { if (!inp.trim()) return; onSend(match.id, inp.trim()); setInp(""); };

  const unlockedJustNow = (prevMc: number) => {
    const thresholds = isPrem ? [10, 20, 30] : [20, 40, 60];
    return thresholds.some(t => prevMc < t && mc >= t);
  };

  return (
    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 4px)", background: T.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", background: T.bgCard, borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.txM, display: "flex" }}><ArrowLeft size={22} /></button>

        {/* Photos row */}
        <div style={{ display: "flex", gap: 6 }}>
          {photos.slice(0, 3).map((url, i) => {
            const blur = getPhotoBlur(i, mc, isPrem);
            const unlocked = isPhotoUnlocked(i, mc, isPrem);
            return (
              <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => unlocked && setSelectedPhoto(url)}
                style={{ width: i === 0 ? 44 : 32, height: i === 0 ? 44 : 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative", cursor: unlocked ? "pointer" : "default", border: unlocked ? `2px solid ${T.ac}` : `2px solid ${T.bd}` }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px)`, transform: "scale(1.15)" }} alt="" />
                {!unlocked && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                    <Lock size={i === 0 ? 14 : 10} color="rgba(255,255,255,0.7)" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>{match.prof.firstName}</span>
          {left > 0 && nextAt && (
            <div style={{ fontSize: 11, color: T.ac, marginTop: 1 }}>
              📸 +{left} msg pour débloquer une photo
            </div>
          )}
          {left === 0 && (
            <div style={{ fontSize: 11, color: T.emerald, marginTop: 1 }}>✨ Toutes les photos débloquées !</div>
          )}
        </div>
      </div>

      {/* Photos gallery */}
      {photos.length > 0 && (
        <div style={{ padding: "12px 16px 8px", borderBottom: `1px solid ${T.bd}`, display: "flex", gap: 8 }}>
          {photos.slice(0, 3).map((url, i) => {
            const blur = getPhotoBlur(i, mc, isPrem);
            const unlocked = isPhotoUnlocked(i, mc, isPrem);
            const thresholds = isPrem ? [0, 10, 20] : [0, 20, 40];
            return (
              <motion.div key={i} whileTap={unlocked ? { scale: 0.97 } : {}} onClick={() => unlocked && setSelectedPhoto(url)}
                style={{ flex: 1, aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", position: "relative", cursor: unlocked ? "pointer" : "default", border: `1px solid ${unlocked ? T.acL : T.bd}` }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px)`, transform: "scale(1.1)" }} alt="" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center" }}>
                  {unlocked ? (
                    <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                      <Eye size={10} /> Voir
                    </span>
                  ) : (
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                      🔒 {thresholds[i] === 0 ? "Match" : `${thresholds[i]} msg`}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {match.msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Volume2 size={40} color={T.txD} style={{ marginBottom: 12 }} />
            <p style={{ color: T.txM, fontSize: 14 }}>Envoyez votre premier message !</p>
            {photos.length > 0 && <p style={{ color: T.txD, fontSize: 12, marginTop: 6 }}>📸 Les photos se dévoilent au fil des échanges</p>}
          </div>
        )}
        {match.msgs.map((m: any) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ alignSelf: m.sid === "me" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div style={{ padding: "12px 16px", borderRadius: 18, background: m.sid === "me" ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: m.sid === "me" ? "#fff" : T.tx, fontSize: 14, lineHeight: 1.5, borderBottomRightRadius: m.sid === "me" ? 4 : 18, borderBottomLeftRadius: m.sid === "me" ? 18 : 4 }}>
              {m.text}
            </div>
            {m.unlockedPhoto && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                style={{ marginTop: 8, padding: "10px 14px", borderRadius: 14, background: "rgba(139,92,246,0.1)", border: `1px solid ${T.ac}`, fontSize: 12, color: T.acL, textAlign: "center" }}>
                ✨ Photo débloquée ! Regarde en haut 👆
              </motion.div>
            )}
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

      {/* Photo fullscreen */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={selectedPhoto} style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: 16, objectFit: "contain" }} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}