import React from 'react';
import { App } from '../App';
import { LoginView } from './LoginView';
import { useAuth } from './AuthContext';

export const AuthGate: React.FC = () => {
  const { session, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500">Loading…</div>;
  }

  if (!session) return <LoginView />;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md rounded-xl bg-white shadow p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-800">Account profile not found</h1>
          <p className="text-sm text-slate-500 mt-2">Your account exists, but it has no Complex Manager profile.</p>
          <button onClick={() => void signOut()} className="mt-4 rounded-lg bg-slate-800 text-white px-4 py-2">Sign out</button>
        </div>
      </div>
    );
  }

  return <App />;
};
