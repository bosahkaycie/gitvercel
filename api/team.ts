import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DATA_FILE = path.resolve(process.cwd(), 'public/data/team_members.json');

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const getLocalTeam = () => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading local team_members.json:', e);
    }
    return [];
  };

  const saveLocalTeam = (team: any[]) => {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(team, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed saving local team_members.json:', e);
    }
  };

  if (req.method === 'GET') {
    const local = getLocalTeam();
    if (local.length > 0) {
      return res.status(200).json({ success: true, team: local });
    }

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          saveLocalTeam(data);
          return res.status(200).json({ success: true, team: data });
        }
      } catch (e) {}
    }

    return res.status(200).json({ success: true, team: local });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'save', member, id, team } = body;
      let current = getLocalTeam();

      if (action === 'delete') {
        const targetId = id || member?.id;
        current = current.filter((m: any) => m.id !== targetId);
      } else if (action === 'save' && member) {
        const idx = current.findIndex((m: any) => m.id === member.id);
        if (idx >= 0) {
          current[idx] = { ...current[idx], ...member, updated_at: new Date().toISOString() };
        } else {
          current.push({ ...member, id: member.id || `team-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
        }
      } else if (team && Array.isArray(team)) {
        current = team;
      }

      current.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
      saveLocalTeam(current);

      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
          if (action === 'delete') {
            await supabase.from('team_members').delete().eq('id', id || member?.id);
          } else if (action === 'save' && member) {
            await supabase.from('team_members').upsert(member);
          }
        } catch (e) {}
      }

      return res.status(200).json({ success: true, team: current });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
