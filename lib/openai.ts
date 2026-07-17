import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function suggestFieldMappings(sourceFields: string[], destinationFields: string[], sourceEntityName: string, destinationEntityName: string) {
  const prompt = `You are a data migration expert. Given source fields from ${sourceEntityName} and destination fields from ${destinationEntityName}, suggest the best field mappings with confidence scores.

Source fields: ${sourceFields.join(', ')}
Destination fields: ${destinationFields.join(', ')}

Return a JSON array only, no other text, in this exact format:
[{"source_field": "fieldname", "destination_field": "fieldname", "confidence": 95, "reason": "exact name match"}]

Rules:
- Only suggest mappings where you are reasonably confident
- Confidence 90-100 means very strong match (exact or near-exact name, same data type implied)
- Confidence 70-89 means good match (similar meaning, common migration pattern)
- Confidence 50-69 means possible match (related concept but not certain)
- Do not include mappings below 50 confidence
- Consider common Dynamics 365 field naming patterns like emailaddress1 matching to email, fullname matching to name, telephone1 matching to phone`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 2000,
  })

  const content = response.choices[0].message.content || '[]'
  try {
    const clean = content.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return []
  }
}
