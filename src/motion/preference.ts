export type MotionPreference='system'|'full'|'reduced';
export function reducedMotion(preference:MotionPreference='system'){return preference==='reduced'||preference==='system'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;}
