import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ profile: data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 