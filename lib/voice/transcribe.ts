// Voice transcription utility
// Supports both Deepgram and OpenAI Whisper

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Check which API key is available - prioritize OpenAI
  const openaiKey = process.env.OPENAI_API_KEY
  const deepgramKey = process.env.DEEPGRAM_API_KEY

  if (openaiKey) {
    return transcribeWithWhisper(audioBlob, openaiKey)
  } else if (deepgramKey) {
    return transcribeWithDeepgram(audioBlob, deepgramKey)
  } else {
    throw new Error('No transcription API key configured. Please set OPENAI_API_KEY or DEEPGRAM_API_KEY')
  }
}

async function transcribeWithDeepgram(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.deepgram.com/v1/listen', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': audioBlob.type,
    },
    body: audioBlob,
  })

  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
}

async function transcribeWithWhisper(
  audioBlob: Blob,
  apiKey: string
): Promise<string> {
  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('model', 'whisper-1')

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`OpenAI Whisper API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.text || ''
}
