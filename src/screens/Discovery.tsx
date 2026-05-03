import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Play, Pause, Volume2, SlidersHorizontal, ChevronDown } from "lucide-react";
import { T, INTENTIONS } from "../tokens";
import { Glass } from "../components/ui/Glass";
import { VoiceWave } from "../components/ui/VoiceWave";
import { getProfilesToDiscover } from "../services/matchingService";

const GENDER_OPTIONS = [
  { v: "tous", l: "Tout le monde" },
  { v: "homme", l: "Hommes" },
  { v: "femme", l: "Femmes" },
  { v: "non-binaire", l: "Non-binaire" },
];

export function Discovery({ currentUid, onLike, onPass }: any) {
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dir, setDir] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(50);
  const [intention, setIntention] = useState("tous");
  const [gender, setGender] = useState("tous");

  useEffect(() => {
    if (!currentUid) return;
    getProfilesToDiscover(currentUid).then(p => {
      setAllProfiles(p);
      setLoading(false);
    });
  }, [currentUid]);

  useEffect(() => {
    let filtered = allProfiles;
    if (gender !== "tous") filtered = filtered.filter(p => p.gender === gender);
    if (intention !== "tous") filtered = filtered.filter(p => p.intention === intention);
    filtered = filtered.filter(p => {
      const age = parseInt(p.age) || 0;
      return age >= ageMin && age <= ageMax;
    });
    setProfiles(filtered);
    setIdx(0);
  }, [allProfiles, gender, intention, ageMin, ageMax]);

  const act = (a: string) => {
    setDir(a === "like" ? "right" : "left");
    setPlaying(false);
    setTimeout(() => {
      if (a === "like") onLike(profiles[idx]);
      else onPass(profiles[idx]);
      setDir(null);
      setIdx(i => i + 1);
    }, 300);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${T.bd}`, borderTopColor: T.ac }} />
    </div>
  );

  const activeFiltersCount = [gender !== "tous", intention !== "tous", ageMin !== 18 || ageMax !== 50].filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ padding: "12px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingBottom: 100 }}>

      {/* Filtres button */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 50, border: `1px solid ${activeFiltersCount > 0 ? T.ac : T.bd}`, background: activeFiltersCount > 0 ? "rgba(139,92,246,0.1)" : T.bgCard, cursor: "pointer", fontFamily: "inherit" }}>
          <SlidersHorizontal size={16} color={activeFiltersCount > 0 ? T.ac : T.txM} />
          <span style={{ fontSize: 13, fontWeight: 600, color: activeFiltersCount > 0 ? T.ac : T.txM }}>Filtres</span>
          {activeFiltersCount > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: T.ac, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{activeFiltersCount}</span>}
          <ChevronDown size={14} color={T.txM} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </motion.button>
      </div>

      {/* Panel filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ width: "100%", overflow: "hidden" }}>
            <Glass style={{ padding: 20, width: "100%" }}>

              {/* Genre */}
              <p style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Je cherche</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {GENDER_OPTIONS.map(({ v, l }) => (
                  <motion.button key={v} whileTap={{ scale: 0.95 }} onClick={() => setGender(v)}
                    style={{ padding: "7px 14px", borderRadius: 50, border: gender === v ? "none" : `1px solid ${T.bd}`, background: gender === v ? T.ac : T.bgEl, color: gender === v ? "#fff" : T.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {l}
                  </motion.button>
                ))}
              </div>

              {/* Intention */}
              <p style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Intention</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIntention("tous")}
                  style={{ padding: "7px 14px", borderRadius: 50, border: intention === "tous" ? "none" : `1px solid ${T.bd}`, background: intention === "tous" ? T.ac : T.bgEl, color: intention === "tous" ? "#fff" : T.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Toutes
                </motion.button>
                {INTENTIONS.map(({ key, label, emoji }) => (
                  <motion.button key={key} whileTap={{ scale: 0.95 }} onClick={() => setIntention(key)}
                    style={{ padding: "7px 14px", borderRadius: 50, border: intention === key ? "none" : `1px solid ${T.bd}`, background: intention === key ? T.ac : T.bgEl, color: intention === key ? "#fff" : T.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {emoji} {label}
                  </motion.button>
                ))}
              </div>

              {/* Âge */}
              <p style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                Âge : <span style={{ color: T.ac }}>{ageMin} – {ageMax} ans</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: T.txD, width: 28 }}>{ageMin}</span>
                  <input type="range" min={18} max={ageMax - 1} value={ageMin} onChange={e => setAgeMin(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: T.ac }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: T.txD, width: 28 }}>{ageMax}</span>
                  <input type="range" min={ageMin + 1} max={80} value={ageMax} onChange={e => setAgeMax(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: T.ac }} />
                </div>
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setGender("tous"); setIntention("tous"); setAgeMin(18); setAgeMax(50); }}
                  style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 12, border: `1px solid ${T.bd}`, background: "transparent", color: T.rose, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Réinitialiser les filtres
                </motion.button>
              )}
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profil card */}
      {profiles.length === 0 || idx >= profiles.length ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: 16, padding: 32 }}>
          <Volume2 size={48} color={T.txD} />
          <p style={{ color: T.txM, fontSize: 16, fontWeight: 700, textAlign: "center" }}>
            {activeFiltersCount > 0 ? "Aucun profil avec ces filtres" : "Plus de profils pour l'instant"}
          </p>
          <p style={{ color: T.txD, fontSize: 13, textAlign: "center" }}>
            {activeFiltersCount > 0 ? "Essaie d'élargir tes critères" : "Reviens plus tard !"}
          </p>
        </div>
      ) : (() => {
        const p = profiles[idx];
        const grad = p.grad || ["#8B5CF6", "#6D28D9"];
        return (
          <>
            <motion.div
              animate={{ x: dir === "right" ? 300 : dir === "left" ? -300 : 0, opacity: dir ? 0 : 1, rotate: dir === "right" ? 15 : dir === "left" ? -15 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>

              <div style={{ position: "relative" }}>
                <motion.div animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 160, height: 160, borderRadius: "50%", background: `linear-gradient(135deg,${grad[0]},${grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: playing ? `0 0 60px ${grad[0]}40` : `0 8px 32px rgba(0,0,0,0.3)` }}>
                  <Volume2 size={56} color="rgba(255,255,255,0.5)" />
                </motion.div>
                {playing && <>
                  <motion.div animate={{ scale: [1, 1.6], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `2px solid ${grad[0]}` }} />
                  <motion.div animate={{ scale: [1, 1.8], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `2px solid ${grad[1]}` }} />
                </>}
              </div>

              <div style={{ background: T.bgCard, padding: "10px 20px", borderRadius: 50, border: `1px solid ${T.bd}`, textAlign: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: T.tx }}>{p.firstName}, {p.age} ans</span>
                <span style={{ display: "block", fontSize: 11, color: T.txD, marginTop: 2 }}>{p.occupation} · {p.city}</span>
              </div>
            </motion.div>

            <Glass style={{ padding: 24, width: "100%" }}>
              {p.intention && (
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <span style={{ padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 600, background: "rgba(244,63,94,0.1)", color: T.rose, border: "1px solid rgba(244,63,94,0.15)" }}>
                    {p.intention === "serious" ? "💘 Relation sérieuse" : p.intention === "casual" ? "🔥 Casual" : p.intention === "friendship" ? "😊 Amitié" : "🤷 Ouvert"}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
                {(p.passions || []).map((x: string) => <span key={x} style={{ padding: "6px 14px", borderRadius: 50, background: "rgba(139,92,246,0.1)", color: T.acL, fontSize: 12, fontWeight: 600, border: "1px solid rgba(139,92,246,0.15)" }}>{x}</span>)}
              </div>
              <VoiceWave playing={playing} />
              <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlaying(!playing)}
                  style={{ width: 64, height: 64, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.ac},${T.acD})`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 24px ${T.acGlow}` }}>
                  {playing ? <Pause size={28} color="#fff" /> : <Play size={28} color="#fff" style={{ marginLeft: 3 }} />}
                </motion.button>
              </div>
              <p style={{ textAlign: "center", color: T.txM, fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>"{p.bio}"</p>
            </Glass>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => act("pass")}
                style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${T.bdL}`, background: T.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={28} color={T.txM} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => act("like")}
                style={{ width: 72, height: 72, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${T.rose},#DC2626)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(244,63,94,0.3)" }}>
                <Heart size={32} color="#fff" fill="#fff" />
              </motion.button>
            </div>
          </>
        );
      })()}
    </motion.div>
  );
}