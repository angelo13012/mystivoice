import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Heart, X, Play, Pause, Send, ArrowLeft, Crown,
  MessageCircle, User, Sparkles, ChevronRight, Eye,
  Lock, Check, LogOut, Clock, Mail,
  Volume2, Headphones
} from "lucide-react";
import { useAuth } from "./hooks/useAuth";

/* ─── DESIGN TOKENS ─── */
const T = {
  bg: "#0A0A0F", bgCard: "#13131A", bgEl: "#1A1A24",
  bgGlass: "rgba(19,19,26,0.85)",
  ac: "#8B5CF6", acL: "#A78BFA", acD: "#6D28D9",
  acGlow: "rgba(139,92,246,0.25)",
  gold: "#F59E0B", goldGlow: "rgba(245,158,11,0.2)",
  rose: "#F43F5E", emerald: "#10B981",
  tx: "#F8FAFC", txM: "#94A3B8", txD: "#475569",
  bd: "rgba(148,163,184,0.08)", bdL: "rgba(148,163,184,0.15)",
};

/* ─── MOCK PROFILES ─── */
const PROFILES = [
  { id:"p1", firstName:"Léa", age:24, bio:"Passionnée de rando et de podcasts true crime. J'adore rire et découvrir de nouveaux endroits !", occupation:"Infirmière", passions:["Randonnée","Cuisine","Yoga"], photoUrl:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", grad:["#EC4899","#F43F5E"], lookingFor:"Relation sérieuse" },
  { id:"p2", firstName:"Thomas", age:28, bio:"Architecte le jour, musicien jazz la nuit. Un café et une bonne discussion, c'est tout ce qu'il me faut.", occupation:"Architecte", passions:["Jazz","Photo","Voyages"], photoUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", grad:["#3B82F6","#6366F1"], lookingFor:"Quelqu'un de créatif" },
  { id:"p3", firstName:"Camille", age:26, bio:"Graphiste freelance, un peu geek, beaucoup escalade. Je cherche quelqu'un pour partager des aventures.", occupation:"Graphiste", passions:["Art Digital","Escalade","Séries SF"], photoUrl:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", grad:["#10B981","#14B8A6"], lookingFor:"Aventures et rires" },
  { id:"p4", firstName:"Hugo", age:30, bio:"Chef cuisinier passionné. Je voyage pour découvrir de nouvelles saveurs.", occupation:"Chef cuisinier", passions:["Gastronomie","Voyage","Vin"], photoUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop", grad:["#F59E0B","#EF4444"], lookingFor:"Relation sérieuse" },
  { id:"p5", firstName:"Sofia", age:25, bio:"Danseuse et prof de yoga. L'énergie qu'on dégage compte plus que le physique.", occupation:"Danseuse", passions:["Danse","Yoga","Méditation"], photoUrl:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", grad:["#D946EF","#8B5CF6"], lookingFor:"Connexion authentique" },
];

const PASSIONS = ["Musique","Danse","Cinéma","Sport","Cuisine","Voyage","Art","Lecture","Jeux Vidéo","Nature","Tech","Mode","Photo","Animaux","Yoga","Théâtre"];

/* ─── BLUR UTILS ─── */
const getBlur = (n: number, p: boolean) => p ? (n>=10?0:n>=5?8:n>=2?16:24) : (n>=20?0:n>=10?10:n>=5?18:28);
const getPct = (n: number, p: boolean) => Math.min(100, Math.round((n / (p?10:20)) * 100));
const getLeft = (n: number, p: boolean) => Math.max(0, (p?10:20) - n);

/* ─── VOICE WAVE ─── */
function VoiceWave({ playing, color = T.ac }: { playing: boolean; color?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, height:48 }}>
      {Array.from({length:12}).map((_,i) => (
        <motion.div key={i}
          style={{ width:3, borderRadius:2, background:color, opacity:playing?0.9:0.3 }}
          animate={{ height: playing ? [8, 20+Math.random()*24, 12, 28+Math.random()*16, 8] : 4 }}
          transition={{ duration:0.8+Math.random()*0.4, repeat:Infinity, repeatType:"reverse", delay:i*0.07, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── BTN ─── */
function Btn({ children, variant="primary", size="md", disabled, style, ...p }: any) {
  const v: any = {
    primary: { background:`linear-gradient(135deg,${T.ac},${T.acD})`, color:"#fff", boxShadow:`0 4px 24px ${T.acGlow}` },
    ghost: { background:"transparent", color:T.txM, border:`1px solid ${T.bdL}` },
    gold: { background:`linear-gradient(135deg,${T.gold},#D97706)`, color:"#fff", boxShadow:`0 4px 24px ${T.goldGlow}` },
    danger: { background:"transparent", color:T.rose, border:`1px solid rgba(244,63,94,0.2)` },
  };
  const sz: any = { sm:{padding:"8px 16px",borderRadius:12,fontSize:13}, md:{padding:"14px 24px",borderRadius:16,fontSize:15}, lg:{padding:"18px 32px",borderRadius:20,fontSize:16}, xl:{padding:"20px 40px",borderRadius:24,fontSize:17} };
  return (
    <motion.button whileTap={disabled?{}:{scale:0.96}} whileHover={disabled?{}:{scale:1.02}}
      style={{ border:"none", fontWeight:700, cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:disabled?0.5:1, fontFamily:"inherit", ...v[variant], ...sz[size], ...style }}
      disabled={disabled} {...p}>{children}</motion.button>
  );
}

/* ─── INPUT ─── */
function Inp({ label, icon:Icon, ...p }: any) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:700, color:T.txD, textTransform:"uppercase", letterSpacing:1.5, marginLeft:4 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {Icon && <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.txD }}><Icon size={18}/></div>}
        <input style={{ width:"100%", background:T.bgEl, border:`1px solid ${T.bd}`, borderRadius:14, padding:Icon?"14px 16px 14px 44px":"14px 16px", color:T.tx, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} {...p}/>
      </div>
    </div>
  );
}

/* ─── GLASS CARD ─── */
function Glass({ children, style }: any) {
  return <div style={{ background:T.bgCard, border:`1px solid ${T.bd}`, borderRadius:24, ...style }}>{children}</div>;
}

/* ═══ SPLASH ═══ */
function Splash({ onGo }: { onGo: (m: string) => void }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, background:`radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, ${T.bg} 60%)`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", top:-80, right:-60, filter:"blur(40px)" }}/>
      <motion.div initial={{scale:0.8,y:20}} animate={{scale:1,y:0}} transition={{type:"spring",damping:20,delay:0.2}}
        style={{ width:88, height:88, borderRadius:28, background:`linear-gradient(135deg,${T.ac},${T.acD})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 40px ${T.acGlow}`, marginBottom:24 }}>
        <Headphones size={44} color="#fff"/>
      </motion.div>
      <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
        style={{ fontSize:36, fontWeight:800, color:T.tx, letterSpacing:-1, marginBottom:8 }}>MeetVoice</motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
        style={{ fontSize:16, color:T.txM, textAlign:"center", maxWidth:280, lineHeight:1.6, marginBottom:48 }}>
        L'amour au premier <span style={{color:T.ac,fontWeight:700}}>son</span>.<br/>Découvrez les gens par leur voix, pas leur photo.
      </motion.p>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
        style={{ width:"100%", maxWidth:320, display:"flex", flexDirection:"column", gap:12 }}>
        <Btn size="xl" style={{width:"100%"}} onClick={()=>onGo("signup")}><Mic size={20}/> Commencer</Btn>
        <Btn variant="ghost" size="md" style={{width:"100%"}} onClick={()=>onGo("login")}>J'ai déjà un compte</Btn>
      </motion.div>
    </motion.div>
  );
}

/* ═══ AUTH ═══ */
function Auth({ mode, onToggle, onDone }: any) {
  const [f, setF] = useState({email:"",password:"",firstName:"",age:""});
  const [err, setErr] = useState("");
  const go = () => {
    setErr("");
    if(!f.email||!f.password) return setErr("Remplissez tous les champs.");
    if(mode==="signup"&&(!f.firstName||!f.age)) return setErr("Prénom et âge requis.");
    onDone({ email:f.email, password:f.password, firstName:mode==="signup"?f.firstName:f.email.split("@")[0], age:mode==="signup"?parseInt(f.age)||25:25 });
  };
  return (
    <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
      style={{ minHeight:"100vh", padding:24, background:T.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:400, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:56,height:56,borderRadius:18,margin:"0 auto 16px",background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center" }}><Headphones size={28} color="#fff"/></div>
          <h2 style={{ fontSize:26,fontWeight:800,color:T.tx,marginBottom:6 }}>{mode==="login"?"Bon retour !":"Créer un compte"}</h2>
          <p style={{ fontSize:14,color:T.txM }}>{mode==="login"?"Connectez-vous":"Rejoignez l'aventure vocale"}</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          {err&&<div style={{padding:"12px 16px",borderRadius:12,background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.2)",color:T.rose,fontSize:13,textAlign:"center"}}>{err}</div>}
          <Inp label="Email" icon={Mail} type="email" placeholder="votre@email.com" value={f.email} onChange={(e: any)=>setF({...f,email:e.target.value})}/>
          <Inp label="Mot de passe" icon={Lock} type="password" placeholder="••••••••" value={f.password} onChange={(e: any)=>setF({...f,password:e.target.value})}/>
          {mode==="signup"&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} style={{display:"flex",flexDirection:"column",gap:16}}>
            <Inp label="Prénom" icon={User} placeholder="Marie" value={f.firstName} onChange={(e: any)=>setF({...f,firstName:e.target.value})}/>
            <Inp label="Âge" icon={Clock} type="number" placeholder="25" value={f.age} onChange={(e: any)=>setF({...f,age:e.target.value})}/>
          </motion.div>}
          <Btn size="lg" style={{width:"100%",marginTop:8}} onClick={go}>{mode==="login"?"Se connecter":"Créer mon compte"} <ChevronRight size={18}/></Btn>
          <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",color:T.ac,fontSize:14,fontWeight:600,fontFamily:"inherit",padding:8}}>
            {mode==="login"?"Pas encore de compte ? S'inscrire":"Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ ONBOARDING ═══ */
function Onboard({ userData, onDone }: any) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [passions, setPassions] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [rec, setRec] = useState(false);
  const [done, setDone] = useState(false);
  const [rt, setRt] = useState(0);
  const tm = useRef<any>(null);

  const togRec = () => {
    if(rec){setRec(false);setDone(true);clearInterval(tm.current);}
    else{setRec(true);setRt(0);tm.current=setInterval(()=>setRt((t: number)=>{if(t>=30){setRec(false);setDone(true);clearInterval(tm.current);return 30;}return t+1;}),1000);}
  };
  const togP = (p: string) => passions.includes(p)?setPassions(passions.filter(x=>x!==p)):passions.length<5&&setPassions([...passions,p]);

  const steps = [
    { title:"Qui êtes-vous ?", sub:"Personnalisez votre expérience", ok:!!gender,
      body:<div style={{display:"flex",flexDirection:"column",gap:12,marginTop:24}}>
        {[{v:"homme",l:"Homme",e:"👨"},{v:"femme",l:"Femme",e:"👩"},{v:"non-binaire",l:"Non-binaire",e:"🌟"}].map(({v,l,e})=>
          <motion.button key={v} whileTap={{scale:0.97}} onClick={()=>setGender(v)}
            style={{padding:"18px 24px",borderRadius:18,border:gender===v?"none":`1px solid ${T.bd}`,background:gender===v?`linear-gradient(135deg,${T.ac},${T.acD})`:T.bgEl,color:gender===v?"#fff":T.tx,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,boxShadow:gender===v?`0 4px 20px ${T.acGlow}`:"none"}}>
            <span style={{fontSize:24}}>{e}</span>{l}{gender===v&&<Check size={18} style={{marginLeft:"auto"}}/>}
          </motion.button>
        )}
      </div>},
    { title:"Vos passions", sub:"Choisissez jusqu'à 5 centres d'intérêt", ok:passions.length>=2,
      body:<div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:24,justifyContent:"center"}}>
        {PASSIONS.map(p=>{const s=passions.includes(p);return(
          <motion.button key={p} whileTap={{scale:0.94}} onClick={()=>togP(p)}
            style={{padding:"10px 18px",borderRadius:50,border:s?"none":`1px solid ${T.bd}`,background:s?T.ac:T.bgEl,color:s?"#fff":T.txM,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",opacity:!s&&passions.length>=5?0.4:1}}>
            {p}
          </motion.button>
        );})}
      </div>},
    { title:"Votre voix mystère", sub:"Enregistrez un message de présentation", ok:true,
      body:<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,marginTop:32}}>
        <Glass style={{padding:24,width:"100%",textAlign:"center"}}>
          <p style={{fontSize:14,color:T.txM,marginBottom:20,lineHeight:1.6}}>💡 Présentez-vous : prénom, passions, ce que vous recherchez...</p>
          <VoiceWave playing={rec} color={rec?T.rose:T.ac}/>
          <motion.button whileTap={{scale:0.92}} onClick={togRec}
            style={{width:88,height:88,borderRadius:"50%",border:"none",background:rec?`linear-gradient(135deg,${T.rose},#DC2626)`:`linear-gradient(135deg,${T.ac},${T.acD})`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",margin:"20px auto 0",boxShadow:rec?"0 4px 30px rgba(244,63,94,0.3)":`0 4px 30px ${T.acGlow}`}}>
            {rec?<MicOff size={36} color="#fff"/>:<Mic size={36} color="#fff"/>}
          </motion.button>
          <p style={{fontSize:13,color:T.txD,marginTop:12}}>{rec?`Enregistrement... ${rt}s / 30s`:done?"✅ Voix enregistrée !":"Appuyez pour enregistrer"}</p>
        </Glass>
        <div style={{width:"100%"}}><Inp label="Bio courte (optionnel)" placeholder="Passionné de jazz et de voyages..." value={bio} onChange={(e: any)=>setBio(e.target.value)}/></div>
      </div>},
  ];
  const c = steps[step];
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{minHeight:"100vh",padding:24,background:T.bg,display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",gap:6,marginBottom:32,paddingTop:8}}>
        {steps.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=step?T.ac:T.bgEl,transition:"background 0.3s"}}/>)}
      </div>
      <div style={{flex:1,maxWidth:400,margin:"0 auto",width:"100%"}}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}>
            <h2 style={{fontSize:26,fontWeight:800,color:T.tx,marginBottom:6}}>{c.title}</h2>
            <p style={{fontSize:14,color:T.txM}}>{c.sub}</p>{c.body}
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{display:"flex",gap:12,marginTop:24}}>
        {step>0&&<Btn variant="ghost" size="md" onClick={()=>setStep(step-1)} style={{flex:1}}><ArrowLeft size={18}/> Retour</Btn>}
        <Btn size="md" disabled={!c.ok} onClick={()=>{if(step<steps.length-1)setStep(step+1);else onDone({...userData,gender,passions,bio:bio||`Salut, je suis ${userData.firstName} !`});}} style={{flex:1}}>
          {step===steps.length-1?"Découvrir":"Suivant"} <ChevronRight size={18}/>
        </Btn>
      </div>
    </motion.div>
  );
}

/* ═══ DISCOVERY ═══ */
function Discovery({ profiles, onLike, onPass }: any) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dir, setDir] = useState<string | null>(null);
  const p = profiles[idx % profiles.length];
  const act = (a: string) => {
    setDir(a==="like"?"right":"left"); setPlaying(false);
    setTimeout(()=>{a==="like"?onLike(p):onPass(p);setDir(null);setIdx((i: number)=>(i+1)%profiles.length);},300);
  };
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
      style={{padding:"16px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:20,paddingBottom:100}}>
      <motion.div animate={{x:dir==="right"?300:dir==="left"?-300:0,opacity:dir?0:1,rotate:dir==="right"?15:dir==="left"?-15:0}} transition={{duration:0.3}}
        style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%"}}>
        <div style={{position:"relative"}}>
          <motion.div animate={playing?{scale:[1,1.08,1]}:{scale:1}} transition={{duration:1.5,repeat:Infinity}}
            style={{width:160,height:160,borderRadius:"50%",background:`linear-gradient(135deg,${p.grad[0]},${p.grad[1]})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:playing?`0 0 60px ${p.grad[0]}40`:`0 8px 32px rgba(0,0,0,0.3)`}}>
            <Volume2 size={56} color="rgba(255,255,255,0.5)"/>
          </motion.div>
          {playing&&<><motion.div animate={{scale:[1,1.6],opacity:[0.3,0]}} transition={{duration:2,repeat:Infinity}} style={{position:"absolute",inset:-16,borderRadius:"50%",border:`2px solid ${p.grad[0]}`}}/><motion.div animate={{scale:[1,1.8],opacity:[0.2,0]}} transition={{duration:2,repeat:Infinity,delay:0.5}} style={{position:"absolute",inset:-16,borderRadius:"50%",border:`2px solid ${p.grad[1]}`}}/></>}
        </div>
        <div style={{background:T.bgCard,padding:"10px 20px",borderRadius:50,border:`1px solid ${T.bd}`,textAlign:"center"}}>
          <span style={{fontSize:17,fontWeight:700,color:T.tx}}>{p.firstName}, {p.age} ans</span>
          <span style={{display:"block",fontSize:11,color:T.txD,marginTop:2}}>{p.occupation} · {p.lookingFor}</span>
        </div>
      </motion.div>
      <Glass style={{padding:24,width:"100%"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,justifyContent:"center"}}>
          {p.passions.map((x: string)=><span key={x} style={{padding:"6px 14px",borderRadius:50,background:"rgba(139,92,246,0.1)",color:T.acL,fontSize:12,fontWeight:600,border:"1px solid rgba(139,92,246,0.15)"}}>{x}</span>)}
        </div>
        <VoiceWave playing={playing}/>
        <div style={{display:"flex",justifyContent:"center",margin:"12px 0"}}>
          <motion.button whileTap={{scale:0.9}} onClick={()=>setPlaying(!playing)}
            style={{width:64,height:64,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${T.ac},${T.acD})`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px ${T.acGlow}`}}>
            {playing?<Pause size={28} color="#fff"/>:<Play size={28} color="#fff" style={{marginLeft:3}}/>}
          </motion.button>
        </div>
        <p style={{textAlign:"center",color:T.txM,fontSize:14,fontStyle:"italic",lineHeight:1.6}}>"{p.bio}"</p>
      </Glass>
      <div style={{display:"flex",gap:20,alignItems:"center"}}>
        <motion.button whileTap={{scale:0.85}} onClick={()=>act("pass")} style={{width:64,height:64,borderRadius:"50%",border:`2px solid ${T.bdL}`,background:T.bgCard,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={28} color={T.txM}/></motion.button>
        <motion.button whileTap={{scale:0.85}} onClick={()=>act("like")} style={{width:72,height:72,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${T.rose},#DC2626)`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(244,63,94,0.3)"}}><Heart size={32} color="#fff" fill="#fff"/></motion.button>
      </div>
    </motion.div>
  );
}

/* ═══ MATCH POPUP ═══ */
function MatchPop({ profile, onChat, onContinue }: any) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}}>
      <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",damping:15,delay:0.2}} style={{textAlign:"center"}}>
        <motion.div animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:"linear"}}
          style={{width:140,height:140,borderRadius:"50%",background:`conic-gradient(${T.ac},${T.rose},${T.gold},${T.ac})`,padding:3,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
          <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`linear-gradient(135deg,${profile.grad[0]},${profile.grad[1]})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Heart size={48} color="#fff" fill="#fff"/>
          </div>
        </motion.div>
        <h2 style={{fontSize:32,fontWeight:800,color:T.tx,marginBottom:8}}>C'est un Match ! 🎉</h2>
        <p style={{fontSize:16,color:T.txM,marginBottom:32}}>{profile.firstName} et vous avez matché !<br/><span style={{fontSize:13,color:T.txD}}>La photo se dévoilera au fil de vos échanges...</span></p>
        <div style={{display:"flex",flexDirection:"column",gap:12,width:280,margin:"0 auto"}}>
          <Btn size="lg" style={{width:"100%"}} onClick={onChat}><MessageCircle size={20}/> Envoyer un message</Btn>
          <Btn variant="ghost" size="md" style={{width:"100%"}} onClick={onContinue}>Continuer à découvrir</Btn>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══ MATCHES LIST ═══ */
function MatchesList({ matches, onOpen, isPrem }: any) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{padding:"16px 20px",paddingBottom:100}}>
      <h2 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:20}}>Conversations</h2>
      {matches.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px"}}><MessageCircle size={48} color={T.txD} style={{marginBottom:16}}/><p style={{color:T.txM,fontSize:15}}>Pas encore de match</p><p style={{color:T.txD,fontSize:13,marginTop:4}}>Likez des profils pour commencer !</p></div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {matches.map((m: any)=>{const bl=getBlur(m.mc,isPrem),pc=getPct(m.mc,isPrem),last=m.msgs[m.msgs.length-1];return(
            <motion.button key={m.id} whileTap={{scale:0.98}} onClick={()=>onOpen(m)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:14,background:T.bgCard,borderRadius:18,border:`1px solid ${T.bd}`,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
              <div style={{width:52,height:52,borderRadius:"50%",overflow:"hidden",flexShrink:0,position:"relative"}}>
                <img src={m.prof.photoUrl} style={{width:"100%",height:"100%",objectFit:"cover",filter:`blur(${bl}px)`,transform:"scale(1.1)"}} alt=""/>
                {bl>0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.2)"}}><Eye size={16} color="rgba(255,255,255,0.6)"/></div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:700,color:T.tx}}>{m.prof.firstName}</span><span style={{fontSize:11,color:T.ac,fontWeight:600}}>{pc}% révélé</span></div>
                <p style={{fontSize:13,color:T.txM,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{last?last.text:"Commencez à discuter ! 💬"}</p>
                <div style={{height:3,borderRadius:2,marginTop:6,background:T.bgEl,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,width:`${pc}%`,background:`linear-gradient(90deg,${T.ac},${T.rose})`,transition:"width 0.5s ease"}}/></div>
              </div>
            </motion.button>
          );})}
        </div>
      )}
    </motion.div>
  );
}

/* ═══ CHAT ═══ */
function ChatView({ match, onSend, onBack, isPrem }: any) {
  const [inp, setInp] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const bl=getBlur(match.mc,isPrem), pc=getPct(match.mc,isPrem), left=getLeft(match.mc,isPrem);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[match.msgs]);
  const send = () => {if(!inp.trim())return;onSend(match.id,inp.trim());setInp("");};
  return (
    <motion.div initial={{x:300,opacity:0}} animate={{x:0,opacity:1}} exit={{x:300,opacity:0}}
      style={{display:"flex",flexDirection:"column",height:"calc(100vh - 4px)"}}>
      <div style={{padding:"14px 20px",background:T.bgCard,borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:T.txM,display:"flex"}}><ArrowLeft size={22}/></button>
        <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><img src={match.prof.photoUrl} style={{width:"100%",height:"100%",objectFit:"cover",filter:`blur(${bl}px)`,transform:"scale(1.1)"}} alt=""/></div>
        <div style={{flex:1}}>
          <span style={{fontSize:15,fontWeight:700,color:T.tx}}>{match.prof.firstName}</span>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
            <div style={{height:3,flex:1,borderRadius:2,background:T.bgEl,overflow:"hidden",maxWidth:100}}><div style={{height:"100%",borderRadius:2,width:`${pc}%`,background:`linear-gradient(90deg,${T.ac},${T.rose})`}}/></div>
            <span style={{fontSize:11,color:T.ac,fontWeight:600}}>{pc}%</span>
          </div>
        </div>
      </div>
      {left>0&&<div style={{padding:"8px 16px",textAlign:"center",background:"rgba(139,92,246,0.06)",borderBottom:`1px solid ${T.bd}`}}><p style={{fontSize:12,color:T.ac}}>✨ Plus que <strong>{left} messages</strong> pour voir son visage{!isPrem&&<span style={{color:T.gold}}> · Premium = 2× plus rapide</span>}</p></div>}
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8}}>
        {match.msgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px"}}><Volume2 size={40} color={T.txD} style={{marginBottom:12}}/><p style={{color:T.txM,fontSize:14}}>Envoyez votre premier message !</p></div>}
        {match.msgs.map((m: any)=>(
          <motion.div key={m.id} initial={{opacity:0,y:10,scale:0.95}} animate={{opacity:1,y:0,scale:1}} style={{alignSelf:m.sid==="me"?"flex-end":"flex-start",maxWidth:"80%"}}>
            <div style={{padding:"12px 16px",borderRadius:18,background:m.sid==="me"?`linear-gradient(135deg,${T.ac},${T.acD})`:T.bgEl,color:m.sid==="me"?"#fff":T.tx,fontSize:14,lineHeight:1.5,borderBottomRightRadius:m.sid==="me"?4:18,borderBottomLeftRadius:m.sid==="me"?18:4}}>{m.text}</div>
          </motion.div>
        ))}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"12px 16px",background:T.bgCard,borderTop:`1px solid ${T.bd}`,display:"flex",gap:10,alignItems:"center"}}>
        <button style={{width:44,height:44,borderRadius:"50%",border:"none",background:T.bgEl,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.ac}}><Mic size={20}/></button>
        <input value={inp} onChange={(e)=>setInp(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Écris quelque chose..."
          style={{flex:1,background:T.bgEl,border:`1px solid ${T.bd}`,borderRadius:50,padding:"12px 18px",color:T.tx,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
        <motion.button whileTap={{scale:0.9}} onClick={send}
          style={{width:44,height:44,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${T.ac},${T.acD})`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Send size={18} color="#fff"/></motion.button>
      </div>
    </motion.div>
  );
}

/* ═══ PROFILE ═══ */
function ProfileView({ user, onPrem, onLogout }: any) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{padding:"16px 20px",paddingBottom:100}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24}}>
        <div style={{width:96,height:96,borderRadius:"50%",background:`linear-gradient(135deg,${T.ac},${T.rose})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px ${T.acGlow}`,marginBottom:14}}><User size={40} color="#fff"/></div>
        <h2 style={{fontSize:22,fontWeight:800,color:T.tx,display:"flex",alignItems:"center",gap:8}}>{user.firstName}, {user.age} ans {user.isPremium&&<Crown size={20} color={T.gold} fill={T.gold}/>}</h2>
        <p style={{fontSize:13,color:T.txM,marginTop:2}}>{user.bio}</p>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",justifyContent:"center"}}>
          {user.passions?.map((p: string)=><span key={p} style={{padding:"5px 12px",borderRadius:50,fontSize:11,fontWeight:600,background:"rgba(139,92,246,0.1)",color:T.acL,border:"1px solid rgba(139,92,246,0.15)"}}>{p}</span>)}
        </div>
      </div>
      <Glass style={{padding:20,marginBottom:14,background:user.isPremium?"rgba(245,158,11,0.05)":T.bgCard}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:12,background:user.isPremium?"rgba(245,158,11,0.15)":"rgba(139,92,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Crown size={22} color={user.isPremium?T.gold:T.ac}/></div>
            <div><p style={{fontSize:15,fontWeight:700,color:T.tx}}>MeetPremium</p><p style={{fontSize:12,color:T.txM}}>4,99€ / mois</p></div>
          </div>
          <Btn variant={user.isPremium?"ghost":"gold"} size="sm" onClick={onPrem}>{user.isPremium?"Actif ✓":"S'abonner"}</Btn>
        </div>
        {["Défloutage 2× plus rapide","Likes illimités","Voir qui vous a liké","Filtres avancés"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><Check size={14} color={T.emerald}/><span style={{fontSize:13,color:T.txM}}>{f}</span></div>)}
      </Glass>
      <Btn variant="danger" size="md" style={{width:"100%",marginTop:8}} onClick={onLogout}><LogOut size={18}/> Se déconnecter</Btn>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════ */
/*  MAIN APP — FIREBASE CONNECTED             */
/* ═══════════════════════════════════════════ */
export default function App() {
  const { userData, loading, signup, login, logout, updateProfile } = useAuth();
  const [scr, setScr] = useState("splash");
  const [authMode, setAM] = useState("signup");
  const [tempUser, setTempUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [popup, setPopup] = useState<any>(null);

  // Auto-redirect si déjà connecté
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

  // Loading screen
  if (loading) {
    return (
      <div style={{ fontFamily:"'Satoshi',system-ui,sans-serif", background:T.bg, color:T.tx, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
          style={{ width:48, height:48, borderRadius:"50%", border:`3px solid ${T.bd}`, borderTopColor:T.ac }} />
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
    await updateProfile({ gender: data.gender, passions: data.passions, bio: data.bio });
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
        {scr === "onboarding" && <Onboard key="o" userData={user} onDone={handleOnboardDone} />}
        {scr === "discovery" && <Discovery key="d" profiles={PROFILES} onLike={like} onPass={() => { }} />}
        {scr === "matches" && <MatchesList key="m" matches={matches} isPrem={user?.isPremium} onOpen={(m: any) => { setActive(m); setScr("chat"); }} />}
        {scr === "chat" && active && <ChatView key="c" match={active} isPrem={user?.isPremium} onSend={sendMsg} onBack={() => setScr("matches")} />}
        {scr === "profile" && user && <ProfileView key="p" user={user} onPrem={() => updateProfile({ isPremium: !user.isPremium })} onLogout={handleLogout} />}
      </AnimatePresence>
      {isApp && scr !== "chat" && (
        <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.bgGlass, backdropFilter: "blur(20px)", borderTop: `1px solid ${T.bd}`, display: "flex", zIndex: 100, paddingBottom: 8 }}>
          {[{ k: "discovery", I: Sparkles, l: "Découvrir" }, { k: "matches", I: MessageCircle, l: "Messages" }, { k: "profile", I: User, l: "Profil" }].map(({ k, I, l }) => { const a = scr === k; return (
            <button key={k} onClick={() => setScr(k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 4px", gap: 4, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: a ? "rgba(139,92,246,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={20} color={a ? T.ac : T.txD} /></div>
              <span style={{ fontSize: 10, fontWeight: a ? 700 : 500, color: a ? T.ac : T.txD }}>{l}</span>
            </button>
          ); })}
        </nav>
      )}
      <AnimatePresence>{popup && <MatchPop profile={popup} onChat={() => { const m = matches.find((x: any) => x.prof.id === popup.id); if (m) { setActive(m); setScr("chat"); } setPopup(null); }} onContinue={() => setPopup(null)} />}</AnimatePresence>
    </div>
  );
}