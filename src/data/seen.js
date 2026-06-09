// Loader for "Set & afprøvet"-posterne. Hver post er sin egen fil i
// src/data/seen/*.json (redigeres via /admin). Kun browser-brug, så
// import.meta.glob er fint her. Nyeste post (efter dato) vises først.

const modules = import.meta.glob('./seen/*.json', { eager: true })

export const seen = Object.values(modules)
  .map((module) => module.default ?? module)
  .sort((a, b) => (b.hvornaar ?? '').localeCompare(a.hvornaar ?? ''))
