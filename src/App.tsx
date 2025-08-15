import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import Home from './pages/Home';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/Login';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, sess) => {
      setSession(sess);
      if (sess) {
        ensureProfile(sess.user.id, sess.user.email);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function ensureProfile(id: string, email: string | undefined) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (error) return;
    if (!data) {
      await supabase.from('profiles').insert({
        id,
        display_name: email?.split('@')[0] ?? 'Player',
        timezone: import.meta.env.VITE_DEFAULT_TZ,
      });
    }
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/profile">Profile</Link> |{' '}
        <button
          onClick={() =>
            supabase.auth.signOut().then(() => {
              setSession(null);
              navigate('/');
            })
          }
        >
          Sign out
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:puzzleId" element={<Play />} />
        <Route path="/leaderboard/:puzzleId" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
