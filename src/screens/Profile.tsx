import { motion } from "framer-motion";
import { User, Crown, LogOut, Check, MapPin } from "lucide-react";
import { T, INTENTIONS } from "../tokens";
import { Btn } from "../components/ui/Btn";
import { Glass } from "../components/ui/Glass";

export function Profile({ user, onPrem, onLogout }: any) {
  const intention = INTENTIONS.find(i => i.key === user.intention);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "16px 20px", paddingBottom: 100 }}>
      {/* Avatar + Infos */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg,${T.ac},${T.rose})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 24px ${T.acGlow}`, marginBottom: 14 }}>
          <User size={40} color="#fff" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.tx, display: "flex", alignItems: "center", gap: 8 }}>
          {user.firstName}, {user.age} ans {user.isPremium && <Crown size={20} color={T.gold} fill={T.gold} />}
        </h2>
        {user.city && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <MapPin size={14} color={T.txD} />
            <span style={{ fontSize: 13, color: T.txD }}>{user.city}{user.radius ? ` · ${user.radius} km` : ""}</span>
          </div>
        )}
        {intention && (
          <span style={{ marginTop: 8, padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600, background: "rgba(244,63,94,0.1)", color: T.rose, border: "1px solid rgba(244,63,94,0.15)" }}>
            {intention.emoji} {intention.label}
          </span>
        )}
        <p style={{ fontSize: 13, color: T.txM, marginTop: 8, textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>{user.bio}</p>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {user.passions?.map((p: string) => <span key={p} style={{ padding: "5px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600, background: "rgba(139,92,246,0.1)", color: T.acL, border: "1px solid rgba(139,92,246,0.15)" }}>{p}</span>)}
        </div>
      </div>

      {/* Premium */}
      <Glass style={{ padding: 20, marginBottom: 14, background: user.isPremium ? "rgba(245,158,11,0.05)" : T.bgCard }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: user.isPremium ? "rgba(245,158,11,0.15)" : "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Crown size={22} color={user.isPremium ? T.gold : T.ac} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>MeetPremium</p>
              <p style={{ fontSize: 12, color: T.txM }}>4,99€ / mois</p>
            </div>
          </div>
          <Btn variant={user.isPremium ? "ghost" : "gold"} size="sm" onClick={onPrem}>{user.isPremium ? "Actif ✓" : "S'abonner"}</Btn>
        </div>
        {["Défloutage 2× plus rapide", "Likes illimités", "Voir qui vous a liké", "Filtres avancés"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Check size={14} color={T.emerald} />
            <span style={{ fontSize: 13, color: T.txM }}>{f}</span>
          </div>
        ))}
      </Glass>

      {/* Logout */}
      <Btn variant="danger" size="md" style={{ width: "100%", marginTop: 8 }} onClick={onLogout}><LogOut size={18} /> Se déconnecter</Btn>
    </motion.div>
  );
}