import { getFontEmbedCSS, toPng } from 'html-to-image'
import { CANVAS } from '../brand'
import { postFilenamePrefix } from '../data/file-names'

// Embedding the webfonts is the slow part of a capture, so do it once.
let fontCSS: Promise<string> | null = null

async function capture(node: HTMLElement) {
  // Without this, a capture taken before Sora loads falls back to system fonts.
  await document.fonts.ready
  fontCSS ??= getFontEmbedCSS(node)
  return toPng(node, {
    width: CANVAS.width,
    height: CANVAS.height,
    pixelRatio: 1,
    fontEmbedCSS: await fontCSS,
  })
}

function save(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export const slideFilename = (postId: string, index: number) =>
  postFilenamePrefix(postId) === postId
    ? `${postId}_slide-${String(index + 1).padStart(2, '0')}.png`
    : `${postFilenamePrefix(postId)}-${index + 1}.png`

export async function downloadSlide(node: HTMLElement, filename: string) {
  save(await capture(node), filename)
}

/** Sequential on purpose: parallel captures fight over fonts and memory. */
export async function downloadAll(nodes: HTMLElement[], postId: string) {
  for (const [i, node] of nodes.entries()) {
    save(await capture(node), slideFilename(postId, i))
    await new Promise(r => setTimeout(r, 250)) // browsers drop rapid-fire downloads
  }
}
