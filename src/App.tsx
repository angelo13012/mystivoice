import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, User } from "lucide-react";
import { T, MOCK_PROFILES } from "./tokens";
import { useAuth } from "./hooks/useAuth";
import { Splash } from "./screens/Splash";
import { Auth } from "./screens/Auth";
import { Onboarding } from "./screens/Onboarding";
import { Discovery } from "./screens/Discovery";
import { MatchPopup } from "./screens/MatchPopup";
import { Matches } from "./screens/Matches";
import { Chat } from "./screens/Chat";
import { Profile } from "./screens/Profile";

export default function App() {
  const { userData, loading, signup, login, logout, updateProfile } = useAuth();
  const [scr, setScr] = useState("splash");
  const [authMode, setAM] = useState("signup");
  const [tempUser, setTempUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [popup, setPopup] = useState<any>(null);

  useEffect(() => {
    if (!loading && userData) {
      if (userData.gender && userData.passions?.length > 0) {
        setScr("discovery");
      } else {
        setTempUser(userData);
        setScr("onboarding");
      }
    }
  }, [loading, userData]);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Satoshi',system-ui,sans-serif", background: T.bg, color: T.tx, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${T.bd}`, borderTopColor: T.ac }} />
      </div>
    );
  }

  const handleAuthDone = async (data: any) => {
    try {
      if (authMode === "signup") {
        await signup(data.email, data.password, { firstName: data.firstName, age: data.age });
        setTempUser({ firstName: data.firstName, age: data.age });
        setScr("onboarding");
      } else {
        await login(data.email, data.password);
      }
    } catch (err: any) {
      console.error("Auth error:", err.message);
    }
  };

  const handleOnboardDone = async (data: any) => {
    await updateProfile({
      gender: data.gender,
      intention: data.intention,
      passions: data.passions,
      city: data.city,
      radius: data.radius,
      bio: data.bio,
    });
    setScr("discovery");
  };

  const like = (prof: any) => {
    if (Math.random() > 0.3) {
      const m = { id: `m-${Date.now()}`, prof, mc: 0, msgs: [] };
      setMatches((p) => [m, ...p]);
      setPopup(prof);
    }
  };

  const sendMsg = (mid: string, text: string) => {
    const msg = { id: `${Date.now()}`, sid: "me", text, ts: Date.now() };
    const up = (m: any) => m.id === mid ? { ...m, msgs: [...m.msgs, msg], mc: m.mc + 1 } : m;
    setMatches((p) => p.map(up));
    setActive((p: any) => p && p.id === mid ? { ...p, msgs: [...p.msgs, msg], mc: p.mc + 1 } : p);
    setTimeout(() => {
      const reps = ["Haha j'adore ! 😄", "On a les mêmes goûts !", "Raconte-moi plus 🎤", "J'aime discuter avec toi", "Ça me fait sourire 😊", "Tu t'exprimes bien", "On devrait s'appeler !", "Tu es intéressant(e)"];
      const r = { id: `${Date.now() + 1}`, sid: "other", text: reps[Math.floor(Math.random() * reps.length)], ts: Date.now() + 1 };
      const up2 = (m: any) => m.id === mid ? { ...m, msgs: [...m.msgs, r], mc: m.mc + 1 } : m;
      setMatches((p) => p.map(up2));
      setActive((p: any) => p && p.id === mid ? { ...p, msgs: [...p.msgs, r], mc: p.mc + 1 } : p);
    }, 1500 + Math.random() * 2000);
  };

  const handleLogout = async () => {
    await logout();
    setMatches([]);
    setActive(null);
    setScr("splash");
  };

  const user = userData || tempUser;
  const isApp = ["discovery", "matches", "chat", "profile"].includes(scr);

  return (
    <div style={{ fontFamily: "'Satoshi',system-ui,sans-serif", background: T.bg, color: T.tx, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      {isApp && scr !== "chat" && (
        <header style={{ padding: "14px 20px", background: T.bgGlass, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: `linear-gradient(135deg,${T.ac},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MeetVoice</h1>
        </header>
      )}

      <AnimatePresence mode="wait">
        {scr === "splash" && <Splash key="s" onGo={(m) => { setAM(m); setScr("auth"); }} />}
        {scr === "auth" && <Auth key="a" mode={authMode} onToggle={() => setAM((m: string) => m === "login" ? "signup" : "login")} onDone={handleAuthDone} />}
        {scr === "onboarding" && <Onboarding key="o" userData={user} onDone={handleOnboardDone} />}
        {scr === "discovery" && <Discovery key="d" profiles={MOCK_PROFILES} onLike={like} onPass={() => { }} />}
        {scr === "matches" && <Matches key="m" matches={matches} isPrem={user?.isPremium} onOpen={(m: any) => { setActive(m); setScr("chat"); }} />}
        {scr === "chat" && active && <Chat key="c" match={active} isPrem={user?.isPremium} onSend={sendMsg} onBack={() => setScr("matches")} />}
        {scr === "profile" && user && <Profile key="p" user={user} onPrem={() => updateProfile({ isPremium: !user.isPremium })} onLogout={handleLogout} />}
      </AnimatePresence>

      {isApp && scr !== "chat" && (
        <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.bgGlass, backdropFilter: "blur(20px)", borderTop: `1px solid ${T.bd}`, display: "flex", zIndex: 100, paddingBottom: 8 }}>
          {[{ k: "discovery", I: Sparkles, l: "Découvrir" }, { k: "matches", I: MessageCircle, l: "Messages" }, { k: "profile", I: User, l: "Profil" }].map(({ k, I, l }) => {
            const a = scr === k;
            return (
              <button key={k} onClick={() => setScr(k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px", gap: 4, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: a ? "rgba(139,92,246,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={20} color={a ? T.ac : T.txD} /></div>
                <span style={{ fontSize: 10, fontWeight: a ? 700 : 500, color: a ? T.ac : T.txD }}>{l}</span>
              </button>
            );
          })}
        </nav>
      )}

      <AnimatePresence>
        {popup && <MatchPopup profile={popup} onChat={() => { const m = matches.find((x: any) => x.prof.id === popup.id); if (m) { setActive(m); setScr("chat"); } setPopup(null); }} onContinue={() => setPopup(null)} />}
      </AnimatePresence>
    </div>
  );
}