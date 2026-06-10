'use client'

/* GoldPass notification bus.
   Components publish via notify(); the <GpToasts/> overlay subscribes via onToast().
   Every toast is mirrored to the console so issues are debuggable after the toast fades. */

export type ToastKind = 'info' | 'success' | 'warn' | 'error'
export interface Toast { id: number; kind: ToastKind; msg: string; code?: string }

type Listener = (t: Toast) => void
let listeners: Listener[] = []
let seq = 0

export function notify(kind: ToastKind, msg: string, code?: string) {
  const t: Toast = { id: ++seq, kind, msg, code }
  const line = `[GoldPass${code ? ' ' + code : ''}] ${msg}`
  if (kind === 'error') console.error(line)
  else if (kind === 'warn') console.warn(line)
  else console.info(line)
  listeners.forEach(l => l(t))
}

export function onToast(fn: Listener): () => void {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}
