import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('display_name, timezone')
        .eq('id', user.id)
        .maybeSingle();
      if (data) {
        setDisplayName(data.display_name ?? '');
        setTimezone(data.timezone ?? import.meta.env.VITE_DEFAULT_TZ);
      }
    };
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: displayName, timezone });
    if (error) setMessage(error.message);
    else setMessage('Saved');
  };

  return (
    <main>
      <h1>Profile</h1>
      <form onSubmit={save}>
        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label>
          Timezone
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
