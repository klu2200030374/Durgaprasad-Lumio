import { useState } from 'react'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [prompt, setPrompt] = useState('Summarize the meeting in concise bullet points with action items and owners.')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [emails, setEmails] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [status, setStatus] = useState('')

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setTranscript(text)
  }

  const generate = async () => {
    setLoading(true); setStatus('')
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to summarize')
      setSummary(data.summary || '')
    } catch (e) {
      console.error(e)
      setStatus(e.message)
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async () => {
    setEmailSending(true); setStatus('')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emails, summary })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')
      setStatus('Email sent successfully.')
    } catch (e) {
      console.error(e)
      setStatus(e.message)
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h1>AI Meeting Summarizer</h1>
        <span className="badge">Username: <span className="code">Durgaprasad-Lumio</span></span>
      </div>
      <p><small>Upload a text transcript, add a custom instruction, generate/edit a summary, then share via email.</small></p>

      <label>Transcript</label>
      <textarea rows={10} value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="Paste your meeting transcript here..." />
      <div className="row">
        <input type="file" accept=".txt" onChange={onFile} />
        <small>Only .txt files for simplicity.</small>
      </div>

      <label>Custom Instruction / Prompt</label>
      <input type="text" value={prompt} onChange={e=>setPrompt(e.target.value)} />

      <div className="row">
        <button disabled={loading || !transcript.trim()} onClick={generate}>{loading ? 'Generating...' : 'Generate Summary'}</button>
        <small>Uses your configured AI provider.</small>
      </div>

      <label>Generated Summary (Editable)</label>
      <textarea rows={12} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Your summary will appear here..." />

      <label>Share via Email</label>
      <input type="text" placeholder="recipient1@example.com, recipient2@example.com" value={emails} onChange={e=>setEmails(e.target.value)} />
      <div className="row">
        <button disabled={emailSending || !summary.trim() || !emails.trim()} onClick={sendEmail}>{emailSending ? 'Sending...' : 'Send Summary'}</button>
        <small>Comma-separated list of recipients.</small>
      </div>

      {status && <p><small>{status}</small></p>}

      <hr />
      <p className="footer">Built for Lumio – focus on functionality over design.</p>
    </div>
  )
}
