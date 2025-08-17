export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { transcript, prompt } = req.body || {}
  if (!transcript || !prompt) return res.status(400).json({ error: 'Missing transcript or prompt' })

  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase()
  try {
    let apiUrl, apiKey, model
    let headers = { 'Content-Type': 'application/json' }

    if (provider === 'groq') {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
      apiKey = process.env.GROQ_API_KEY
      model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
      headers['Authorization'] = `Bearer ${apiKey}`
    } else {
      return res.status(400).json({ error: 'Unsupported AI_PROVIDER. Use "groq" or "openai".' })
    }

    if (!apiKey) return res.status(400).json({ error: `Missing API key for ${provider}.` })

    const userContent = `${prompt.trim()}

Transcript:
${transcript.trim()}`

    const body = {
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a precise assistant that writes crisp, structured meeting summaries. Always include succinct headings when appropriate.' },
        { role: 'user', content: userContent }
      ]
    }

    const r = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) })
    if (!r.ok) {
      const errText = await r.text()
      return res.status(r.status).json({ error: `AI API error (${r.status}): ${errText}` })
    }
    const data = await r.json()
    const summary = data?.choices?.[0]?.message?.content || ''
    return res.status(200).json({ summary })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Internal Server Error' })
  }
}
