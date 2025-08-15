import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Play() {
  const { puzzleId } = useParams();
  const [start, setStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<number>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (start !== null) {
      timer.current = window.setInterval(() => {
        setElapsed(Date.now() - start);
      }, 100);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [start]);

  const begin = () => setStart(Date.now());

  const solve = async () => {
    if (!puzzleId || start === null) return;
    const final = Date.now() - start;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from('attempts').insert({
      puzzle_id: puzzleId,
      player_id: user?.id,
      time_ms: final,
      penalties_ms: 0,
      final_time_ms: final,
    });
    if (error) {
      if (error.code === '23505') setMessage('You have already played this puzzle.');
      else setMessage(error.message);
    } else {
      navigate(`/leaderboard/${puzzleId}`);
    }
  };

  return (
    <main>
      <h1>Puzzle {puzzleId}</h1>
      {start === null ? (
        <button onClick={begin}>Begin</button>
      ) : (
        <>
          <p>Time: {(elapsed / 1000).toFixed(1)}s</p>
          <button onClick={solve}>Mark as solved</button>
          {message && <p>{message}</p>}
        </>
      )}
    </main>
  );
}
