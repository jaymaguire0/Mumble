import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface Puzzle {
  id: number;
  difficulty: string;
}

function todayString() {
  const tz = import.meta.env.VITE_DEFAULT_TZ;
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz });
  return formatter.format(new Date());
}

export default function Home() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  useEffect(() => {
    const load = async () => {
      const today = todayString();
      const { data } = await supabase
        .from('puzzles')
        .select('id,difficulty')
        .eq('date', today)
        .in('difficulty', ['Easy', 'Hard']);
      setPuzzles(data ?? []);
    };
    load();
  }, []);

  return (
    <main>
      <h1>Today's Puzzles</h1>
      <ul>
        {puzzles.map((p) => (
          <li key={p.id}>
            {p.difficulty} - <Link to={`/play/${p.id}`}>Play</Link> |{' '}
            <Link to={`/leaderboard/${p.id}`}>Leaderboard</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
