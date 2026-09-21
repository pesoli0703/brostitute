import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const isConfigured = !!url && !!key && !url.includes('placeholder-project')

  let dbConnected = false
  let dbError = null

  if (isConfigured) {
    try {
      const client = createClient(url, key)
      const { data, error } = await client.from('profiles').select('count', { count: 'exact', head: true })
      if (!error) {
        dbConnected = true
      } else {
        dbError = error.message
      }
    } catch (e: any) {
      dbError = e?.message || 'Failed to ping Supabase'
    }
  }

  return NextResponse.json({
    isConfigured,
    supabaseUrl: url ? url.substring(0, 20) + '...' : null,
    dbConnected,
    dbError
  })
}

export async function POST(req: NextRequest) {
  try {
    const { supabaseUrl, supabaseAnonKey } = await req.json()

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Missing Supabase URL or Anon Key' }, { status: 400 })
    }

    // Verify connection first
    const client = createClient(supabaseUrl, supabaseAnonKey)
    const { error: testError } = await client.auth.getSession()

    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = `# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey.trim()}
`
    fs.writeFileSync(envPath, envContent, 'utf-8')

    // Also update process.env for current running server
    process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl.trim()
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey.trim()

    return NextResponse.json({
      success: true,
      message: 'Supabase credentials saved successfully to .env.local',
      warning: testError ? `Note: Auth ping returned: ${testError.message}` : null
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update credentials' }, { status: 500 })
  }
}
