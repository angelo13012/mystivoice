import { motion } from "framer-motion";
import { T } from "../../tokens";

export function VoiceWave({ playing, color = T.ac }: { playing: boolean; color?: string }) {
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