import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { validatePayloadSize } from '@/lib/utils/validation';
import { CreateSnippetRequest, CreateSnippetResponse, ErrorResponse } from '@/types';

/**
 * POST /api/snippets
 * Creates a new snippet and returns its ID and share URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: CreateSnippetRequest = await request.json();

    // Validate required fields
    if (typeof body.html !== 'string' || typeof body.css !== 'string' || 
        typeof body.javascript !== 'string' || typeof body.mode !== 'string') {
      const errorResponse: ErrorResponse = {
        error: 'Invalid request body',
        details: 'Missing required fields: html, css, javascript, mode'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate mode value
    if (body.mode !== 'single' && body.mode !== 'multi') {
      const errorResponse: ErrorResponse = {
        error: 'Invalid mode',
        details: 'Mode must be either "single" or "multi"'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate payload size (500KB limit)
    if (!validatePayloadSize(body)) {
      const errorResponse: ErrorResponse = {
        error: 'Snippet size exceeds 500KB limit',
        details: 'Please reduce content size'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Insert snippet into Supabase
    const { data, error } = await supabase
      .from('snippets')
      .insert({
        html: body.html,
        css: body.css,
        javascript: body.javascript,
        mode: body.mode
      })
      .select('id')
      .single();

    if (error) {
      console.error('[POST /api/snippets] Database error:', {
        error: error.message,
        details: error.details,
        timestamp: new Date().toISOString()
      });

      const errorResponse: ErrorResponse = {
        error: 'Failed to save snippet',
        details: error.message
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    if (!data || !data.id) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to save snippet',
        details: 'No ID returned from database'
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Generate share URL
    const baseUrl = request.nextUrl.origin;
    const shareUrl = `${baseUrl}/view/${data.id}`;

    // Return success response
    const response: CreateSnippetResponse = {
      id: data.id,
      url: shareUrl
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('[POST /api/snippets] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    const errorResponse: ErrorResponse = {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
