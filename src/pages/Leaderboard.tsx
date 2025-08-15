import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Row {
  rank: number;
  player_name: string;
  time_ms: number;
}

export default function Leaderboard() {
  const { puzzleId } = useParams();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!puzzleId) return;
      const { data, error } = await supabase.rpc('get_leaderboard', {
        puzzle_id: puzzleId,
        limit: 100,
      });
      if (!error && data) setRows(data);
    };
    load();
  }, [puzzleId]);

  return (
    <main>
      <h1>Leaderboard</h1>
      <ol>
        {rows.map((r) => (
          <li key={r.rank}>
            {r.rank}. {r.player_name} - {(r.time_ms / 1000).toFixed(2)}s
          </li>
        ))}
      </ol>
    </main>
  );
}
