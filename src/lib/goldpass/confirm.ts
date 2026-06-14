'use client'

/* GoldPass confirm-dialog bus.
   confirmDialog() publishes a request; <GpConfirm/> renders it and resolves
   the returned promise with the user's choice. Replaces window.confirm. */

export interface ConfirmRequest { id: number; message: string; resolve: (ok: boolean) => void }

type Listener = (r: ConfirmRequest) => void
let listeners: Listener[] = []
let seq = 0

export function confirmDialog(message: string): Promise<boolean> {
  return new Promise(resolve => {
    const req: ConfirmRequest = { id: ++seq, message, resolve }
    listeners.forEach(l => l(req))
  })
}

export function onConfirmRequest(fn: Listener): () => void {
  listeners.push(fn)
  return () => { listeners = listeners.filter(l => l !== fn) }
}
