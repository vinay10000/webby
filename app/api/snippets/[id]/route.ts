import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { validateSnippetId } from '@/lib/utils/validation';
import { GetSnippetResponse, ErrorResponse } from '@/types';

/**
 * GET /api/snippets/[id]
 * Retrieves a snippet by its unique ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: snippetId } = await params;

    // Validate snippet ID format
    if (!validateSnippetId(snippetId)) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid snippet ID',
        details: 'Snippet ID must be a valid UUID v4 format'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Query Supabase for snippet by ID
    const { data, error } = await supabase
      .from('snippets')
      .select('id, html, css, javascript, mode, created_at')
      .eq('id', snippetId)
      .single();

    if (error) {
      // Check if it's a "not found" error
      if (error.code === 'PGRST116' || error.message.includes('no rows')) {
        const errorResponse: ErrorResponse = {
          error: 'Snippet not found',
          details: `No snippet exists with ID: ${snippetId}`
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }

      console.error('[GET /api/snippets/[id]] Database error:', {
        error: error.message,
        details: error.details,
        code: error.code,
        snippetId,
        timestamp: new Date().toISOString()
      });

      const errorResponse: ErrorResponse = {
        error: 'Failed to load snippet',
        details: error.message
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    if (!data) {
      const errorResponse: ErrorResponse = {
        error: 'Snippet not found',
        details: `No snippet exists with ID: ${snippetId}`
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Return snippet data
    const response: GetSnippetResponse = {
      id: data.id,
      html: data.html,
      css: data.css,
      javascript: data.javascript,
      mode: data.mode,
      created_at: data.created_at
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[GET /api/snippets/[id]] Unexpected error:', {
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
