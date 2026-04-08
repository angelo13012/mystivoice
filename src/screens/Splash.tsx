import { motion } from "framer-motion";
import { Mic, Headphones } from "lucide-react";
import { T } from "../tokens";
import { Btn } from "../components/ui/Btn";

export function Splash({ onGo }: { onGo: (m: string) => void }) {
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