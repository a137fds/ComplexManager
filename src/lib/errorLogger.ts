import { supabase } from './supabase';

export interface ErrorLogInput {
  operation?: string;
  path?: string;
  errorCode?: string;
  technicalMessage: string;
  userMessage: string;
  context?: Record<string, unknown>;
}

export async function logError(error: ErrorLogInput): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    let role: string | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      role = profile?.role ?? null;
    }

    await supabase.from('error_log').insert({
      user_id: user?.id ?? null,
      user_role: role,
      operation: error.operation ?? null,
      path: error.path ?? null,
      error_code: error.errorCode ?? null,
      technical_message: error.technicalMessage,
      user_message: error.userMessage,
      context: error.context ?? {},
    });
  } catch (loggingError) {
    console.error('Failed to write error log:', loggingError);
  }
}

export function technicalMessage(error: unknown): string {
  if (error instanceof Error) return error.stack || error.message;
  if (typeof error === 'string') return error;
  try { return JSON.stringify(error); } catch { return String(error); }
}
