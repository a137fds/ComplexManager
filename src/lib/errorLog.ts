import { supabase } from './supabase';

export async function getApplicationErrorMessage(error: unknown, fallback = 'The operation failed. Please try again.') {
  const anyError = error as any;

  // Supabase FunctionsHttpError keeps the actual Edge Function response in `context`.
  // Read that response so the useful server-side error is not hidden behind the
  // generic "Edge Function returned a non-2xx status code" message.
  const response = anyError?.context;
  if (response && typeof response.clone === 'function') {
    try {
      const body = await response.clone().json();
      const message = body?.error ?? body?.message ?? body?.details;
      if (typeof message === 'string' && message.trim()) return message.trim();
    } catch {
      try {
        const text = await response.clone().text();
        if (text.trim()) return text.trim();
      } catch {
        // Fall through to the normal error message.
      }
    }
  }

  if (typeof anyError?.message === 'string' && anyError.message.trim() &&
      anyError.message !== 'Edge Function returned a non-2xx status code') {
    return anyError.message.trim();
  }

  return fallback;
}

export async function logApplicationError(params: {
  operation: string;
  path?: string;
  error: unknown;
  userMessage: string;
  context?: Record<string, unknown>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  const anyError = params.error as any;
  const technicalMessage = await getApplicationErrorMessage(params.error, params.userMessage);

  // Do not query the removed user_profiles table here. Roles are now stored in
  // user_roles -> roles, and the error logger must never fail while logging an error.
  let userRole: string | null = null;
  if (user) {
    const { data } = await supabase
      .from('user_roles')
      .select('roles(code)')
      .eq('user_id', user.id)
      .maybeSingle();
    userRole = (data as any)?.roles?.code ?? null;
  }

  const { error: logError } = await supabase.from('error_log').insert({
    user_id: user?.id ?? null,
    user_role: userRole,
    operation: params.operation,
    path: params.path ?? window.location.pathname,
    error_code: anyError?.code ?? anyError?.name ?? null,
    technical_message: technicalMessage,
    user_message: params.userMessage,
    context: { ...(params.context ?? {}), server_error: technicalMessage },
  });

  if (logError) console.error('Failed to write application error log:', logError);
  console.error('Application error:', technicalMessage, anyError);

  return technicalMessage;
}
