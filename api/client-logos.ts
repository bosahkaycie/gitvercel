import { createClient } from '@supabase/supabase-js';

export interface ClientRelationshipItem {
  id: string;
  name: string;
  category: 'Direct Client' | 'Project & Delivery Partner' | 'Industry Stakeholder';
  role?: string;
  logo_url: string;
  website?: string;
  display_order: number;
  status: 'published' | 'draft';
}

export const DEFAULT_CLIENT_RELATIONSHIPS: ClientRelationshipItem[] = [
  {
    id: 'client-shell',
    name: 'Shell',
    category: 'Direct Client',
    role: 'Operating Engagement',
    logo_url: '/assets/clients/shell.svg',
    display_order: 1,
    status: 'published'
  },
  {
    id: 'client-nnpc',
    name: 'NNPC Limited',
    category: 'Industry Stakeholder',
    role: 'National Energy Infrastructure',
    logo_url: '/assets/clients/nnpc.svg',
    display_order: 2,
    status: 'published'
  },
  {
    id: 'client-totalenergies',
    name: 'TotalEnergies',
    category: 'Direct Client',
    role: 'Offshore & Energy Operations',
    logo_url: '/assets/clients/totalenergies.svg',
    display_order: 3,
    status: 'published'
  },
  {
    id: 'client-renaissance',
    name: 'Renaissance Africa Energy Company Limited',
    category: 'Industry Stakeholder',
    role: 'Upstream Asset Operations',
    logo_url: '/assets/clients/renaissance.svg',
    display_order: 4,
    status: 'published'
  },
  {
    id: 'client-newcross',
    name: 'Newcross Exploration & Production',
    category: 'Project & Delivery Partner',
    role: 'Field Development Support',
    logo_url: '/assets/clients/newcross.svg',
    display_order: 5,
    status: 'published'
  },
  {
    id: 'client-panocean',
    name: 'Pan Ocean Oil Corporation (Nigeria) Limited',
    category: 'Project & Delivery Partner',
    role: 'Pipeline & Facility Support',
    logo_url: '/assets/clients/panocean.svg',
    display_order: 6,
    status: 'published'
  },
  {
    id: 'client-matrix',
    name: 'Matrix Energy',
    category: 'Direct Client',
    role: 'Downstream & Terminal Engineering',
    logo_url: '/assets/clients/matrix.svg',
    display_order: 7,
    status: 'published'
  }
];

const STORAGE_PATH = 'config/client_logos.json';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbldpfvceacfonkzzhig.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // GET: Retrieve all client organisation logos
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
      if (error) {
        // First time initialization: seed baseline logos to cloud storage
        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(DEFAULT_CLIENT_RELATIONSHIPS, null, 2), {
          contentType: 'application/json',
          upsert: true
        });
        return res.status(200).json({ success: true, clients: DEFAULT_CLIENT_RELATIONSHIPS });
      }

      const text = await data.text();
      const clients = JSON.parse(text);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, clients: Array.isArray(clients) ? clients : DEFAULT_CLIENT_RELATIONSHIPS });
    } catch (err: any) {
      console.warn('client-logos download fallback:', err);
      return res.status(200).json({ success: true, clients: DEFAULT_CLIENT_RELATIONSHIPS, warning: err.message });
    }
  }

  // POST: Create, Update, Delete, Reorder, or Reset
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'save', client, clients, id } = body;

      // Current items in storage
      let currentList: ClientRelationshipItem[] = [];
      try {
        const { data } = await supabase.storage.from('media').download(STORAGE_PATH);
        if (data) {
          const text = await data.text();
          currentList = JSON.parse(text);
        }
      } catch {
        currentList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }
      if (!Array.isArray(currentList) || currentList.length === 0) {
        currentList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }

      let updatedList: ClientRelationshipItem[] = [...currentList];

      if (action === 'save') {
        if (!client || !client.name) {
          return res.status(400).json({ success: false, error: 'Organisation name is required.' });
        }
        const targetId = client.id || `client-${Date.now()}`;
        const item: ClientRelationshipItem = {
          id: targetId,
          name: client.name.trim(),
          category: client.category || 'Direct Client',
          role: client.role ? client.role.trim() : 'Operating Engagement',
          logo_url: client.logo_url || '/assets/clients/shell.svg',
          website: client.website ? client.website.trim() : '',
          display_order: Number(client.display_order) || updatedList.length + 1,
          status: client.status || 'published'
        };

        const existingIdx = updatedList.findIndex(c => c.id === targetId);
        if (existingIdx >= 0) {
          updatedList[existingIdx] = item;
        } else {
          updatedList.push(item);
        }
      } else if (action === 'save_all' && Array.isArray(clients)) {
        updatedList = clients;
      } else if (action === 'delete') {
        const targetId = id || client?.id;
        updatedList = updatedList.filter(c => c.id !== targetId);
      } else if (action === 'reset') {
        updatedList = [...DEFAULT_CLIENT_RELATIONSHIPS];
      }

      // Sort by display order
      updatedList.sort((a, b) => a.display_order - b.display_order);

      // Save back to cloud storage
      const { error: uploadErr } = await supabase.storage.from('media').upload(
        STORAGE_PATH,
        JSON.stringify(updatedList, null, 2),
        { contentType: 'application/json', upsert: true }
      );

      if (uploadErr) {
        console.warn('Storage save warning:', uploadErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Client organisation logos updated successfully.',
        clients: updatedList
      });
    } catch (err: any) {
      console.error('API /api/client-logos error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
