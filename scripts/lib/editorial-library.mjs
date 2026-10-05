import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const cache = new Map()

/** Load the site's actual TypeScript data and rendered template strings for audit tools. */
export function loadSiteModule(filename) {
  const resolved = path.resolve(filename)
  if (cache.has(resolved)) return cache.get(resolved).exports
  const module = { exports: {} }
  cache.set(resolved, module)
  if (resolved.endsWith('.json')) {
    module.exports = JSON.parse(fs.readFileSync(resolved, 'utf8'))
    return module.exports
  }
  const { outputText } = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: resolved,
  })
  const localRequire = name => {
    if (!name.startsWith('@/') && !name.startsWith('.')) return require(name)
    const base = name.startsWith('@/') ? path.resolve('src', name.slice(2)) : path.resolve(path.dirname(resolved), name)
    const file = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    if (!file) throw new Error(`Cannot resolve ${name} from ${resolved}`)
    return loadSiteModule(file)
  }
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports)
  return module.exports
}

export function guideInventory() {
  const { ARTICLE_LIBRARY } = loadSiteModule('src/data/article-library.ts')
  return ARTICLE_LIBRARY.map(article => {
    const slug = article.language === 'sw' ? article.englishSlug ?? article.slug : article.slug
    const source = `src/content/${article.language === 'sw' ? 'sw' : 'insights'}/${slug}.ts`
    const html = loadSiteModule(source).default
    const words = html.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').trim().split(/\s+/).length
    return { ...article, source, html, words, minutes: Math.max(1, Math.ceil(words / 200)) }
  })
}
