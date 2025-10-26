import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio } from '@/lib/voice/transcribe'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert File to Blob
    const audioBlob = new Blob([await audioFile.arrayBuffer()], {
      type: audioFile.type
    })

    // Transcribe using OpenAI (or fallback to Deepgram)
    const text = await transcribeAudio(audioBlob)

    return NextResponse.json({
      success: true,
      text,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed'
      },
      { status: 500 }
    )
  }
}
