import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, User } from "lucide-react";
import { T } from "./tokens";
import { useAuth } from "./hooks/useAuth";
import { Splash } from "./screens/Splash";
import { Auth } from "./screens/Auth";
import { Onboarding } from "./screens/Onboarding";
import { Discovery } from "./screens/Discovery";
import { MatchPopup } from "./screens/MatchPopup";
import { Matches } from "./screens/Matches";
import { Chat } from "./screens/Chat";
import { Profile } from "./screens/Profile";
import { EditProfile } from "./screens/EditProfile";
import { WhoLiked } from "./screens/WhoLiked";
import { likeUser, passUser, listenMatches, sendMessage, listenMessages, getWhoLikedMe } from "./services/matchingService";

export default function App() {
  const { userData, loading, signup, login, logout, updateProfile, uploadPhoto, deletePhoto } = useAuth();
  const [scr, setScr] = useState("splash");
  const [authMode, setAM] = useState("signup");
  const [tempUser, setTempUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [popup, setPopup] = useState<any>(null);
  const [notif, setNotif] = useState<{ text: string; type: "match" | "message" } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const prevMatchesRef = useRef<any[]>([]);
  const notifTimer = useRef<any>(null);

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

  useEffect(() => {
    if (!userData?.id) return;
    const unsub = listenMatches(userData.id, (newMatches) => {
      const prev = prevMatchesRef.current;
      if (prev.length > 0 && newMatches.length > prev.length) {
        const newMatch = newMatches.find(m => !prev.find(p => p.id === m.id));
        if (newMatch) showNotif(`💘 Match avec ${newMatch.prof.firstName} !`, "match");
      }
      newMatches.forEach(m => {
        const prevMatch = prev.find(p => p.id === m.id);
        if (prevMatch && m.msgs.length > prevMatch.msgs.length) {
          const lastMsg = m.msgs[m.msgs.length - 1];
          if (lastMsg?.sid !== userData.id && scr !== "chat") {
            const text = lastMsg.type === "voice" ? "🎤 Message vocal" : lastMsg.text;
            showNotif(`💬 ${m.prof.firstName} : ${text.slice(0, 30)}`, "message");
          }
        }
      });
      const unread = newMatches.filter(m => {
        const last = m.msgs[m.msgs.length - 1];
        return last && last.sid !== userData.id && !last.read;
      }).length;
      setUnreadCount(unread);
      prevMatchesRef.current = newMatches;
      setMatches(newMatches);
    });
    return unsub;
  }, [userData?.id, scr]);

  useEffect(() => {
    if (!userData?.id) return;
    getWhoLikedMe(userData.id).then(profiles => setLikedCount(profiles.length));
  }, [userData?.id]);

  useEffect(() => {
    if (!active?.id) return;
    const unsub = listenMessages(active.id, (msgs) => {
      setActive((prev: any) => prev ? { ...prev, msgs, mc: msgs.length } : prev);
      setMatches(prev => prev.map(m => m.id === active.id ? { ...m, msgs, mc: msgs.length } : m));
    });
    return unsub;
  }, [active?.id]);

  const showNotif = (text: string, type: "match" | "message") => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotif({ text, type });
    notifTimer.current = setTimeout(() => setNotif(null), 4000);
  };

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

  const handleLike = async (prof: any) => {
    if (!userData?.id) return;
    const isMatch = await likeUser(userData.id, prof.id);
    if (isMatch) setPopup(prof);
  };

  const handlePass = async (prof: any) => {
    if (!userData?.id) return;
    await passUser(userData.id, prof.id);
  };

  const handleSendMsg = async (matchId: string, text: string) => {
    if (!userData?.id) return;
    await sendMessage(matchId, userData.id, text);
  };

  const handleLogout = async () => {
    await logout();
    setMatches([]);
    setActive(null);
    setScr("splash");
  };

  const user = userData || tempUser;
  const isApp = ["discovery", "matches", "chat", "profile", "edit", "wholiked"].includes(scr);

  return (
    <div style={{ fontFamily: "'Satoshi',system-ui,sans-serif", background: T.bg, color: T.tx, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" }}>

      <AnimatePresence>
        {notif && (
          <motion.div initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }}
            onClick={() => { setNotif(null); if (notif.type === "message") setScr("matches"); }}
            style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 448, zIndex: 500, padding: "14px 18px", borderRadius: 16, background: notif.type === "match" ? `linear-gradient(135deg,${T.rose},#DC2626)` : `linear-gradient(135deg,${T.ac},${T.acD})`, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{notif.text}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginLeft: "auto" }}>Appuie pour voir</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isApp && scr !== "chat" && scr !== "edit" && scr !== "wholiked" && (
        <header style={{ padding: "14px 20px", background: T.bgGlass, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: `linear-gradient(135deg,${T.ac},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MeetVoice</h1>
        </header>
      )}

      <AnimatePresence mode="wait">
        {scr === "splash" && <Splash key="s" onGo={(m) => { setAM(m); setScr("auth"); }} />}
        {scr === "auth" && <Auth key="a" mode={authMode} onToggle={() => setAM((m: string) => m === "login" ? "signup" : "login")} onDone={handleAuthDone} />}
        {scr === "onboarding" && <Onboarding key="o" userData={user} onDone={handleOnboardDone} />}
        {scr === "discovery" && <Discovery key="d" currentUid={userData?.id} onLike={handleLike} onPass={handlePass} />}
        {scr === "matches" && <Matches key="m" matches={matches} isPrem={user?.isPremium} currentUid={userData?.id} onOpen={(m: any) => { setActive(m); setScr("chat"); }} />}
        {scr === "chat" && active && <Chat key="c" match={active} isPrem={user?.isPremium} currentUid={userData?.id} onSend={handleSendMsg} onBack={() => setScr("matches")} />}
        {scr === "profile" && user && <Profile key="p" user={user} likedCount={likedCount} onPrem={() => updateProfile({ isPremium: !user.isPremium })} onLogout={handleLogout} onEdit={() => setScr("edit")} onWhoLiked={() => setScr("wholiked")} />}
        {scr === "edit" && user && <EditProfile key="e" user={user} onSave={async (data: any) => { await updateProfile(data); setScr("profile"); }} onBack={() => setScr("profile")} onUploadPhoto={uploadPhoto} onDeletePhoto={deletePhoto} />}
        {scr === "wholiked" && user && <WhoLiked key="wl" currentUid={userData?.id} isPrem={user?.isPremium} onBack={() => setScr("profile")} onMatch={(prof: any) => { setPopup(prof); setScr("profile"); }} />}
      </AnimatePresence>

      {isApp && scr !== "chat" && scr !== "edit" && scr !== "wholiked" && (
        <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.bgGlass, backdropFilter: "blur(20px)", borderTop: `1px solid ${T.bd}`, display: "flex", zIndex: 100, paddingBottom: 8 }}>
          {[{ k: "discovery", I: Sparkles, l: "Découvrir", badge: 0 }, { k: "matches", I: MessageCircle, l: "Messages", badge: unreadCount }, { k: "profile", I: User, l: "Profil", badge: 0 }].map(({ k, I, l, badge }) => {
            const a = scr === k;
            return (
              <button key={k} onClick={() => setScr(k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px", gap: 4, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: a ? "rgba(139,92,246,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <I size={20} color={a ? T.ac : T.txD} />
                  {badge > 0 && (
                    <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: T.rose, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{badge > 9 ? "9+" : badge}</span>
                    </div>
                  )}
                </div>
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