import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Simple dummy user ID for testing (same as used in main app)
const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000001'

export async function GET(request: NextRequest) {
  try {
    // Fetch all notes for the dummy user
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', DUMMY_USER_ID)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notes: notes || [],
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    // Insert note directly into Supabase
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        user_id: DUMMY_USER_ID,
        content: content,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)

      // Check if it's a foreign key constraint error
      const isForeignKeyError = error.message?.includes('foreign key constraint') ||
                                 error.message?.includes('notes_user_id_fkey')

      if (isForeignKeyError) {
        return NextResponse.json(
          {
            success: false,
            error: '⚠️ Database setup incomplete: Test user not found. Please run database/test-user-setup.sql in your Supabase SQL Editor. See database/README.md for instructions.',
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      note: note,
    })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
