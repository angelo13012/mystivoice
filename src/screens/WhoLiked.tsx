import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Lock } from "lucide-react";
import { T, INTENTIONS } from "../tokens";
import { getWhoLikedMe, likeUser } from "../services/matchingService";
import { Btn } from "../components/ui/Btn";
import { Glass } from "../components/ui/Glass";

export function WhoLiked({ currentUid, isPrem, onBack, onMatch }: any) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    getWhoLikedMe(currentUid).then(p => {
      setProfiles(p);
      setLoading(false);
    });
  }, [currentUid]);

  const handleLike = async (prof: any) => {
    setLiking(prof.id);
    const isMatch = await likeUser(currentUid, prof.id);
    setProfiles(prev => prev.filter(p => p.id !== prof.id));
    if (isMatch) onMatch(prof);
    setLiking(null);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      style={{ padding: "0 20px 100px", background: T.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", position: "sticky", top: 0, background: T.bg, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: T.txM, display: "flex", padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.tx, flex: 1 }}>Qui m'a liké 💘</h2>
        {profiles.length > 0 && (
          <span style={{ padding: "4px 12px", borderRadius: 50, background: "rgba(244,63,94,0.1)", color: T.rose, fontSize: 13, fontWeight: 700, border: "1px solid rgba(244,63,94,0.15)" }}>
            {profiles.length}
          </span>
        )}
      </div>

      {!isPrem ? (
        <Glass style={{ padding: 32, textAlign: "center", marginTop: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={28} color={T.gold} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: T.tx, marginBottom: 8 }}>Fonctionnalité Premium</h3>
          <p style={{ fontSize: 14, color: T.txM, lineHeight: 1.6, marginBottom: 24 }}>
            Découvre qui t'a déjà liké et matche instantanément avec eux !
          </p>
          {profiles.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ display: "flex" }}>
                {profiles.slice(0, 4).map((p, i) => (
                  <div key={p.id} style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${T.ac},${T.rose})`, border: `2px solid ${T.bg}`, marginLeft: i > 0 ? -14 : 0, display: "flex", alignItems: "center", justifyContent: "center", filter: "blur(6px)" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{p.firstName?.[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontSize: 13, color: T.ac, fontWeight: 600, marginBottom: 20 }}>
            {profiles.length > 0 ? `${profiles.length} personne${profiles.length > 1 ? "s ont" : " a"} déjà liké ton profil !` : "Des gens ont peut-être liké ton profil..."}
          </p>
          <Btn variant="gold" size="md" style={{ width: "100%" }} onClick={onBack}>
            ✨ Passer à Premium — 4,99€/mois
          </Btn>
        </Glass>
      ) : loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${T.bd}`, borderTopColor: T.ac }} />
        </div>
      ) : profiles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Heart size={48} color={T.txD} style={{ marginBottom: 16 }} />
          <p style={{ color: T.txM, fontSize: 16, fontWeight: 700 }}>Personne pour l'instant</p>
          <p style={{ color: T.txD, fontSize: 13, marginTop: 6 }}>Continue à découvrir des profils !</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {profiles.map(p => {
            const intention = INTENTIONS.find(i => i.key === p.intention);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: T.bgCard, borderRadius: 20, border: `1px solid ${T.bd}`, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${T.ac},${T.rose})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{p.firstName?.[0]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.tx }}>{p.firstName}, {p.age} ans</div>
                    {p.occupation && <div style={{ fontSize: 12, color: T.acL, marginTop: 1 }}>{p.occupation}</div>}
                    {p.city && <div style={{ fontSize: 12, color: T.txD, marginTop: 1 }}>📍 {p.city}</div>}
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleLike(p)}
                    disabled={liking === p.id}
                    style={{ width: 48, height: 48, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.rose},#DC2626)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(244,63,94,0.3)", opacity: liking === p.id ? 0.6 : 1 }}>
                    <Heart size={22} color="#fff" fill="#fff" />
                  </motion.button>
                </div>
                {intention && (
                  <div style={{ padding: "0 16px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600, background: "rgba(244,63,94,0.1)", color: T.rose, border: "1px solid rgba(244,63,94,0.15)" }}>
                      {intention.emoji} {intention.label}
                    </span>
                    {p.passions?.slice(0, 3).map((pass: string) => (
                      <span key={pass} style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 600, background: "rgba(139,92,246,0.1)", color: T.acL, border: "1px solid rgba(139,92,246,0.15)" }}>{pass}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}