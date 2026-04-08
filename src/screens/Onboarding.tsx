import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowLeft, ChevronRight, Check, MapPin } from "lucide-react";
import { T, PASSIONS, INTENTIONS } from "../tokens";
import { Btn } from "../components/ui/Btn";
import { Inp } from "../components/ui/Inp";
import { Glass } from "../components/ui/Glass";
import { VoiceWave } from "../components/ui/VoiceWave";

export function Onboarding({ userData, onDone }: any) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [intention, setIntention] = useState("");
  const [passions, setPassions] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(30);
  const [bio, setBio] = useState("");
  const [rec, setRec] = useState(false);
  const [recDone, setRecDone] = useState(false);
  const [rt, setRt] = useState(0);
  const tm = useRef<any>(null);

  const togRec = () => {
    if (rec) { setRec(false); setRecDone(true); clearInterval(tm.current); }
    else { setRec(true); setRt(0); tm.current = setInterval(() => setRt((t: number) => { if (t >= 30) { setRec(false); setRecDone(true); clearInterval(tm.current); return 30; } return t + 1; }), 1000); }
  };

  const togP = (p: string) => passions.includes(p) ? setPassions(passions.filter(x => x !== p)) : passions.length < 5 && setPassions([...passions, p]);

  const steps = [
    // 1. GENRE
    {
      title: "Qui êtes-vous ?",
      sub: "Personnalisez votre expérience",
      ok: !!gender,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          {[{ v: "homme", l: "Homme", e: "👨" }, { v: "femme", l: "Femme", e: "👩" }, { v: "non-binaire", l: "Non-binaire", e: "🌟" }].map(({ v, l, e }) =>
            <motion.button key={v} whileTap={{ scale: 0.97 }} onClick={() => setGender(v)}
              style={{ padding: "18px 24px", borderRadius: 18, border: gender === v ? "none" : `1px solid ${T.bd}`, background: gender === v ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: gender === v ? "#fff" : T.tx, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, boxShadow: gender === v ? `0 4px 20px ${T.acGlow}` : "none" }}>
              <span style={{ fontSize: 24 }}>{e}</span>{l}{gender === v && <Check size={18} style={{ marginLeft: "auto" }} />}
            </motion.button>
          )}
        </div>
      ),
    },
    // 2. INTENTION
    {
      title: "Que recherchez-vous ?",
      sub: "Soyez honnête, ça aide à mieux matcher",
      ok: !!intention,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          {INTENTIONS.map(({ key, label, emoji, desc }) =>
            <motion.button key={key} whileTap={{ scale: 0.97 }} onClick={() => setIntention(key)}
              style={{ padding: "16px 20px", borderRadius: 18, border: intention === key ? "none" : `1px solid ${T.bd}`, background: intention === key ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: intention === key ? "#fff" : T.tx, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14, boxShadow: intention === key ? `0 4px 20px ${T.acGlow}` : "none", textAlign: "left" }}>
              <span style={{ fontSize: 28 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{desc}</div>
              </div>
              {intention === key && <Check size={18} style={{ marginLeft: "auto" }} />}
            </motion.button>
          )}
        </div>
      ),
    },
    // 3. PASSIONS
    {
      title: "Vos passions",
      sub: "Choisissez jusqu'à 5 centres d'intérêt",
      ok: passions.length >= 2,
      body: (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24, justifyContent: "center" }}>
          {PASSIONS.map(p => { const s = passions.includes(p); return (
            <motion.button key={p} whileTap={{ scale: 0.94 }} onClick={() => togP(p)}
              style={{ padding: "10px 18px", borderRadius: 50, border: s ? "none" : `1px solid ${T.bd}`, background: s ? T.ac : T.bgEl, color: s ? "#fff" : T.txM, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: !s && passions.length >= 5 ? 0.4 : 1 }}>
              {p}
            </motion.button>
          ); })}
        </div>
      ),
    },
    // 4. LOCALISATION
    {
      title: "Où êtes-vous ?",
      sub: "Pour trouver des gens près de chez vous",
      ok: city.trim().length >= 2,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
          <Inp label="Votre ville" icon={MapPin} placeholder="Ex: Paris, Lyon, Marseille..." value={city} onChange={(e: any) => setCity(e.target.value)} />
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginLeft: 4, display: "block", marginBottom: 10 }}>
              Rayon de recherche : <span style={{ color: T.ac }}>{radius} km</span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 4px" }}>
              <span style={{ fontSize: 12, color: T.txD }}>5</span>
              <input
                type="range" min={5} max={200} step={5} value={radius}
                onChange={(e: any) => setRadius(parseInt(e.target.value))}
                style={{ flex: 1, accentColor: T.ac, height: 6 }}
              />
              <span style={{ fontSize: 12, color: T.txD }}>200</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
              {[10, 30, 50, 100].map(r =>
                <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => setRadius(r)}
                  style={{ padding: "8px 16px", borderRadius: 50, border: radius === r ? "none" : `1px solid ${T.bd}`, background: radius === r ? T.ac : T.bgEl, color: radius === r ? "#fff" : T.txM, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {r} km
                </motion.button>
              )}
            </div>
          </div>
        </div>
      ),
    },
    // 5. BIO
    {
      title: "Parlez de vous",
      sub: "Une courte bio pour donner envie de vous écouter",
      ok: true,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.txD, textTransform: "uppercase", letterSpacing: 1.5, marginLeft: 4 }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e: any) => setBio(e.target.value)}
              placeholder="Ex: Passionné de jazz et de voyages. J'adore les conversations profondes autour d'un café..."
              maxLength={300}
              style={{ width: "100%", background: T.bgEl, border: `1px solid ${T.bd}`, borderRadius: 14, padding: "14px 16px", color: T.tx, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", minHeight: 120, resize: "none" }}
            />
            <span style={{ fontSize: 11, color: T.txD, textAlign: "right" }}>{bio.length}/300</span>
          </div>
          <Glass style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: T.txM, lineHeight: 1.6 }}>
              💡 <strong>Conseils :</strong> Parlez de vos passions, de ce qui vous fait rire, de ce que vous cherchez. Soyez authentique !
            </p>
          </Glass>
        </div>
      ),
    },
    // 6. VOIX
    {
      title: "Votre voix mystère",
      sub: "Enregistrez un message de présentation",
      ok: true,
      body: (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 32 }}>
          <Glass style={{ padding: 24, width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: T.txM, marginBottom: 20, lineHeight: 1.6 }}>🎤 Présentez-vous en quelques mots : votre prénom, vos passions, ce que vous recherchez...</p>
            <VoiceWave playing={rec} color={rec ? T.rose : T.ac} />
            <motion.button whileTap={{ scale: 0.92 }} onClick={togRec}
              style={{ width: 88, height: 88, borderRadius: "50%", border: "none", background: rec ? `linear-gradient(135deg,${T.rose},#DC2626)` : `linear-gradient(135deg,${T.ac},${T.acD})`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto 0", boxShadow: rec ? "0 4px 30px rgba(244,63,94,0.3)" : `0 4px 30px ${T.acGlow}` }}>
              {rec ? <MicOff size={36} color="#fff" /> : <Mic size={36} color="#fff" />}
            </motion.button>
            <p style={{ fontSize: 13, color: T.txD, marginTop: 12 }}>{rec ? `Enregistrement... ${rt}s / 30s` : recDone ? "✅ Voix enregistrée !" : "Appuyez pour enregistrer"}</p>
          </Glass>
        </div>
      ),
    },
  ];

  const c = steps[step];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: "100vh", padding: 24, background: T.bg, display: "flex", flexDirection: "column" }}>
      {/* Progress bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, paddingTop: 8 }}>
        {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.ac : T.bgEl, transition: "background 0.3s" }} />)}
      </div>

      <div style={{ flex: 1, maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: T.tx, marginBottom: 6 }}>{c.title}</h2>
            <p style={{ fontSize: 14, color: T.txM }}>{c.sub}</p>
            {c.body}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        {step > 0 && <Btn variant="ghost" size="md" onClick={() => setStep(step - 1)} style={{ flex: 1 }}><ArrowLeft size={18} /> Retour</Btn>}
        <Btn size="md" disabled={!c.ok} onClick={() => {
          if (step < steps.length - 1) setStep(step + 1);
          else onDone({
            ...userData,
            gender,
            intention,
            passions,
            city,
            radius,
            bio: bio || `Salut, je suis ${userData.firstName} !`,
          });
        }} style={{ flex: 1 }}>
          {step === steps.length - 1 ? "Découvrir" : "Suivant"} <ChevronRight size={18} />
        </Btn>
      </div>
    </motion.div>
  );
}