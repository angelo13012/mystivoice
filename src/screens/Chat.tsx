import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, MicOff, Send, Volume2, Lock, Eye, Play, Pause } from "lucide-react";
import { T, getPhotoBlur, isPhotoUnlocked, getMessagesLeft, getNextUnlockAt } from "../tokens";
import { sendVoiceMessage } from "../services/matchingService";

export function Chat({ match, onSend, onBack, isPrem, currentUid }: any) {
  const [inp, setInp] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const endRef = useRef<HTMLDivElement>(null);
  const mc = match.mc;
  const photos: string[] = match.prof.photos || (match.prof.photoUrl ? [match.prof.photoUrl] : []);
  const left = getMessagesLeft(mc, isPrem);
  const nextAt = getNextUnlockAt(mc, isPrem);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [match.msgs]);

  const send = () => { if (!inp.trim()) return; onSend(match.id, inp.trim()); setInp(""); };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size > 0) await sendVoiceMessage(match.id, currentUid, blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          if (t >= 60) { stopRecording(); return 60; }
          return t + 1;
        });
      }, 1000);
    } catch (e) {
      console.error("Mic error:", e);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    setRecordingTime(0);
  };

  const toggleVoice = (msgId: string, url: string) => {
    if (playingVoice === msgId) {
      audioRefs.current[msgId]?.pause();
      setPlayingVoice(null);
    } else {
      Object.values(audioRefs.current).forEach(a => a.pause());
      if (!audioRefs.current[msgId]) {
        const audio = new Audio(url);
        audio.onended = () => setPlayingVoice(null);
        audioRefs.current[msgId] = audio;
      }
      audioRefs.current[msgId].play();
      setPlayingVoice(msgId);
    }
  };

  const isMine = (m: any) => m.sid === currentUid;

  return (
    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 4px)", background: T.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", background: T.bgCard, borderBottom: `1px solid ${T.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: T.txM, display: "flex" }}><ArrowLeft size={22} /></button>
        <div style={{ display: "flex", gap: 6 }}>
          {photos.slice(0, 3).map((url, i) => {
            const blur = getPhotoBlur(i, mc, isPrem);
            const unlocked = isPhotoUnlocked(i, mc, isPrem);
            return (
              <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => unlocked && setSelectedPhoto(url)}
                style={{ width: i === 0 ? 44 : 32, height: i === 0 ? 44 : 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative", cursor: unlocked ? "pointer" : "default", border: unlocked ? `2px solid ${T.ac}` : `2px solid ${T.bd}` }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px)`, transform: "scale(1.15)" }} alt="" />
                {!unlocked && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}><Lock size={i === 0 ? 14 : 10} color="rgba(255,255,255,0.7)" /></div>}
              </motion.div>
            );
          })}
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.tx }}>{match.prof.firstName}</span>
          {left > 0 && nextAt && <div style={{ fontSize: 11, color: T.ac, marginTop: 1 }}>📸 +{left} msg pour débloquer une photo</div>}
          {left === 0 && <div style={{ fontSize: 11, color: T.emerald, marginTop: 1 }}>✨ Toutes les photos débloquées !</div>}
        </div>
      </div>

      {/* Photos gallery */}
      {photos.length > 0 && (
        <div style={{ padding: "12px 16px 8px", borderBottom: `1px solid ${T.bd}`, display: "flex", gap: 8 }}>
          {photos.slice(0, 3).map((url, i) => {
            const blur = getPhotoBlur(i, mc, isPrem);
            const unlocked = isPhotoUnlocked(i, mc, isPrem);
            const thresholds = isPrem ? [0, 20, 40] : [20, 40, 60];
            return (
              <motion.div key={i} whileTap={unlocked ? { scale: 0.97 } : {}} onClick={() => unlocked && setSelectedPhoto(url)}
                style={{ flex: 1, aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", position: "relative", cursor: unlocked ? "pointer" : "default", border: `1px solid ${unlocked ? T.acL : T.bd}` }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px)`, transform: "scale(1.1)" }} alt="" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center" }}>
                  {unlocked
                    ? <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}><Eye size={10} /> Voir</span>
                    : <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>🔒 {thresholds[i] === 0 ? "Match" : `${thresholds[i]} msg`}</span>
                  }
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
        {match.msgs.map((m: any) => {
          const mine = isMine(m);
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "80%" }}>
              {m.type === "voice" ? (
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => toggleVoice(m.id, m.voiceUrl)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 18, background: mine ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, border: "none", cursor: "pointer", borderBottomRightRadius: mine ? 4 : 18, borderBottomLeftRadius: mine ? 18 : 4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: mine ? "rgba(255,255,255,0.2)" : "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {playingVoice === m.id ? <Pause size={16} color={mine ? "#fff" : T.ac} /> : <Play size={16} color={mine ? "#fff" : T.ac} style={{ marginLeft: 2 }} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.div key={i}
                        animate={playingVoice === m.id ? { height: [4, 8 + Math.random() * 16, 4] } : { height: 4 }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                        style={{ width: 2.5, borderRadius: 2, background: mine ? "rgba(255,255,255,0.7)" : T.ac }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: mine ? "rgba(255,255,255,0.7)" : T.txD, minWidth: 24 }}>🎤</span>
                </motion.button>
              ) : (
                <div style={{ padding: "12px 16px", borderRadius: 18, background: mine ? `linear-gradient(135deg,${T.ac},${T.acD})` : T.bgEl, color: mine ? "#fff" : T.tx, fontSize: 14, lineHeight: 1.5, borderBottomRightRadius: mine ? 4 : 18, borderBottomLeftRadius: mine ? 18 : 4 }}>
                  {m.text}
                </div>
              )}
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Recording indicator */}
      <AnimatePresence>
        {recording && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ padding: "10px 20px", background: "rgba(244,63,94,0.1)", borderTop: `1px solid rgba(244,63,94,0.2)`, display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: T.rose }} />
            <span style={{ fontSize: 13, color: T.rose, fontWeight: 600 }}>Enregistrement... {recordingTime}s</span>
            <span style={{ fontSize: 12, color: T.txD, marginLeft: "auto" }}>Max 60s — relâche pour envoyer</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div style={{ padding: "12px 16px", background: T.bgCard, borderTop: `1px solid ${T.bd}`, display: "flex", gap: 10, alignItems: "center" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: recording ? `linear-gradient(135deg,${T.rose},#DC2626)` : T.bgEl, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: recording ? "#fff" : T.ac, boxShadow: recording ? "0 4px 20px rgba(244,63,94,0.3)" : "none" }}>
          {recording ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>
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