import { T } from "../../tokens";

export function Glass({ children, style }: any) {
  return <div style={{ background:T.bgCard, border:`1px solid ${T.bd}`, borderRadius:24, ...style }}>{children}</div>;
}