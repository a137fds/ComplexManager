import { supabase } from './supabase';

export async function logApplicationError(params: {
  operation: string;
  path?: string;
  error: unknown;
  userMessage: string;
  context?: Record<string, unknown>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  const err = params.error instanceof Error ? params.error : new Error(String(params.error));
  const anyError = params.error as any;

  const { data: profile } = user
    ? await supabase.from('user_profiles').select('role').eq('id', user.id).maybeSingle()
    : { data: null as any };

  const { error: logError } = await supabase.from('error_log').insert({
    user_id: user?.id ?? null,
    user_role: profile?.role ?? null,
    operation: params.operation,
    path: params.path ?? window.location.pathname,
    error_code: anyError?.code ?? anyError?.name ?? null,
    technical_message: err.message || 'Unknown error',
    user_message: params.userMessage,
    context: params.context ?? {},
  });

  if (logError) console.error('Failed to write application error log:', logError);
  console.error(err);
}
