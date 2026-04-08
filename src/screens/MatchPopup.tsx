import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { T } from "../tokens";
import { Btn } from "../components/ui/Btn";

export function MatchPopup({ profile, onChat, onContinue }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15, delay: 0.2 }} style={{ textAlign: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ width: 140, height: 140, borderRadius: "50%", background: `conic-gradient(${T.ac},${T.rose},${T.gold},${T.ac})`, padding: 3, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `linear-gradient(135deg,${profile.grad[0]},${profile.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={48} color="#fff" fill="#fff" />
          </div>
        </motion.div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: T.tx, marginBottom: 8 }}>C'est un Match ! 🎉</h2>
        <p style={{ fontSize: 16, color: T.txM, marginBottom: 32 }}>{profile.firstName} et vous avez matché !<br /><span style={{ fontSize: 13, color: T.txD }}>La photo se dévoilera au fil de vos échanges...</span></p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280, margin: "0 auto" }}>
          <Btn size="lg" style={{ width: "100%" }} onClick={onChat}><MessageCircle size={20} /> Envoyer un message</Btn>
          <Btn variant="ghost" size="md" style={{ width: "100%" }} onClick={onContinue}>Continuer à découvrir</Btn>
        </div>
      </motion.div>
    </motion.div>
  );
}