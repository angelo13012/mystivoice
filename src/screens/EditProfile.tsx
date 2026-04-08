import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { T, PASSIONS, INTENTIONS } from "../tokens";
import { Btn } from "../components/ui/Btn";
import { Inp } from "../components/ui/Inp";

export function EditProfile({ user, onSave, onBack }: any) {
  const [gender, setGender] = useState(user.gender || "");
  const [intention, setIntention] = useState(user.intention || "");
  const [passions, setPassions] = useState<string[]>(user.passions || []);
  const [city, setCity] = useState(user.city || "");
  const [radius, setRadius] = useState(user.radius || 30);
  const [bio, setBio] = useState(user.bio || "");
  const [occupation, setOccupation] = useState(user.occupation || "");
  const [lookingFor, setLookingFor] = useState(user.lookingFor || "");
  const [saving, setSaving] = useState(false);

  const togP = (p: string) => passions.includes(p) ? setPassions(passions.filter(x => x !== p)) : passions.length < 5 && setPassions([...passions, p]);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ gender, intention, passions, city, radius, bio, occupation, lookingFor });
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      style={{ padding: "0 20px 120px", background: T.bg, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", position: "sticky", top: 0, background: T.bg, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: T.txM, display: "flex", padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.tx, flex: 1 }}>Modifier mon profil</h2>
      </div>

      {/* Genre */}
      <SectionTitle title="Genre" />
      <div style={{ display: "flex", gap: 8 }}>
        {[{ v: "homme", l: "Homme" }, { v: "femme", l: "Femme" }, { v: "non-binaire", l: "Non-binaire" }].map(({ v, l }) =>
          <motion.button key={v} whileTap={{ scale: 0.95 }} onClick={() => setGender(v)}
            style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: gender === v ? "none" : `1px solid ${T.bd}`, background: gender === v ? T.ac : T.bgEl, color: gender === v ? "#fff" : T.txM, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {l}
          </motion.button>
        )}
      </div>

      {/* Intention */}
      <SectionTitle title="Je recherche" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {INTENTIONS.map(({ key, label, emoji, desc }) =>
          <motion.button key={key} whileTap={{ scale: 0.97 }} onClick={() => setIntention(key)}
            style={{ padding: "14px 16px", borderRadius: 16, border: intention === key ? "none" : `1px solid ${T.bd}`, background: intention === key ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: intention === key ? "#fff" : T.tx, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", boxShadow: intention === key ? `0 4px 16px ${T.acGlow}` : "none" }}>
            <span style={{ fontSize: 24 }}>{emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>{desc}</div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Passions */}
      <SectionTitle title={`Passions (${passions.length}/5)`} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PASSIONS.map(p => { const s = passions.includes(p); return (
          <motion.button key={p} whileTap={{ scale: 0.94 }} onClick={() => togP(p)}
            style={{ padding: "8px 16px", borderRadius: 50, border: s ? "none" : `1px solid ${T.bd}`, background: s ? T.ac : T.bgEl, color: s ? "#fff" : T.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: !s && passions.length >= 5 ? 0.4 : 1 }}>
            {p}
          </motion.button>
        ); })}
      </div>

      {/* Localisation */}
      <SectionTitle title="Localisation" />
      <Inp label="Ma ville" icon={MapPin} placeholder="Paris, Lyon, Marseille..." value={city} onChange={(e: any) => setCity(e.target.value)} />
      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginLeft: 4, display: "block", marginBottom: 8 }}>
          Rayon : <span style={{ color: T.ac }}>{radius} km</span>
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 4px" }}>
          <span style={{ fontSize: 12, color: T.txD }}>5</span>
          <input type="range" min={5} max={200} step={5} value={radius} onChange={(e: any) => setRadius(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: T.ac, height: 6 }} />
          <span style={{ fontSize: 12, color: T.txD }}>200</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
          {[10, 30, 50, 100].map(r =>
            <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => setRadius(r)}
              style={{ padding: "6px 14px", borderRadius: 50, border: radius === r ? "none" : `1px solid ${T.bd}`, background: radius === r ? T.ac : T.bgEl, color: radius === r ? "#fff" : T.txM, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {r} km
            </motion.button>
          )}
        </div>
      </div>

      {/* Métier */}
      <SectionTitle title="Métier" />
      <Inp placeholder="Ex: Architecte, Étudiant, Chef cuisinier..." value={occupation} onChange={(e: any) => setOccupation(e.target.value)} />

      {/* Ce que je cherche (texte libre) */}
      <SectionTitle title="Ce que je cherche (en quelques mots)" />
      <Inp placeholder="Ex: Quelqu'un de drôle et spontané..." value={lookingFor} onChange={(e: any) => setLookingFor(e.target.value)} />

      {/* Bio */}
      <SectionTitle title="Bio" />
      <textarea
        value={bio} onChange={(e: any) => setBio(e.target.value)}
        placeholder="Parlez de vous..."
        maxLength={300}
        style={{ width: "100%", background: T.bgEl, border: `1px solid ${T.bd}`, borderRadius: 14, padding: "14px 16px", color: T.tx, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", minHeight: 100, resize: "none" }}
      />
      <span style={{ fontSize: 11, color: T.txD, textAlign: "right", display: "block", marginTop: 4 }}>{bio.length}/300</span>

      {/* Save button */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "16px 20px", background: T.bgGlass, backdropFilter: "blur(20px)", borderTop: `1px solid ${T.bd}`, zIndex: 50 }}>
        <Btn size="lg" style={{ width: "100%" }} onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Btn>
      </div>
    </motion.div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 style={{ fontSize: 13, fontWeight: 700, color: T.txM, textTransform: "uppercase", letterSpacing: 1, marginTop: 24, marginBottom: 10 }}>{title}</h3>;
}