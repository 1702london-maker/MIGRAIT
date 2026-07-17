import { NextRequest, NextResponse } from 'next/server'
import { suggestFieldMappings } from '@/lib/openai'

function similarity(a: string, b: string): number {
  const na = a.toLowerCase().replace(/[_\s-]/g, '')
  const nb = b.toLowerCase().replace(/[_\s-]/g, '')
  if (na === nb) return 100
  if (na.includes(nb) || nb.includes(na)) return 85
  const matrix: number[][] = Array.from({ length: na.length + 1 }, (_, i) => [i])
  for (let j = 0; j <= nb.length; j++) matrix[0][j] = j
  for (let i = 1; i <= na.length; i++) {
    for (let j = 1; j <= nb.length; j++) {
      matrix[i][j] = na[i - 1] === nb[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1])
    }
  }
  const maxLen = Math.max(na.length, nb.length)
  return Math.round((1 - matrix[na.length][nb.length] / maxLen) * 100)
}

export async function POST(req: NextRequest) {
  const { source_fields, destination_fields, source_entity, destination_entity } = await req.json()

  // Try OpenAI first
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-placeholder')) {
    try {
      const aiSuggestions = await suggestFieldMappings(source_fields, destination_fields, source_entity || 'source', destination_entity || 'destination')
      return NextResponse.json({ suggestions: aiSuggestions })
    } catch {
      // fall through to local algorithm
    }
  }

  const suggestions: { source_field: string; destination_field: string; confidence: number }[] = []
  const usedDest = new Set<string>()

  for (const sf of source_fields) {
    let best = { dest: '', score: 0 }
    for (const df of destination_fields) {
      if (usedDest.has(df)) continue
      const score = similarity(sf, df)
      if (score > best.score) best = { dest: df, score }
    }
    if (best.score >= 40) {
      suggestions.push({ source_field: sf, destination_field: best.dest, confidence: best.score })
      usedDest.add(best.dest)
    }
  }

  return NextResponse.json({ suggestions })
}
