import { notFound } from 'next/navigation';
import { ViewClient } from './ViewClient';
import { GetSnippetResponse, ErrorResponse } from '@/types';

interface ViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Server component for viewing shared snippets
 * Fetches snippet data from API and passes to ViewClient
 */
export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;

  try {
    // Fetch snippet from API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/snippets/${id}`, {
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || 'Failed to load snippet');
    }

    const snippet: GetSnippetResponse = await response.json();

    // Pass snippet data to client component
    return <ViewClient snippet={snippet} />;

  } catch (error) {
    console.error('[ViewPage] Error loading snippet:', error);
    
    // If it's a network error or other issue, show not found
    notFound();
  }
}
