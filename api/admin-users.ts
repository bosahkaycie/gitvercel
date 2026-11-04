import { createClient } from '@supabase/supabase-js';

// Server-side secure Supabase administrator account & credentials management
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

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase credentials not configured on server.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
      return res.status(200).json({ success: true, users: data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'create', userData = {}, password } = body;

      const email = (userData.email || body.email || '').trim().toLowerCase();
      const fullName = (userData.full_name || body.full_name || '').trim();
      const role = userData.role || body.role || 'Content Editor';
      const status = userData.status || body.status || 'active';
      const pass = password || userData.password || body.password;

      if (!email) {
        return res.status(400).json({ success: false, error: 'Corporate email address is required.' });
      }

      // =========================================================================
      // 1. ACTION: CREATE NEW ADMINISTRATOR WITH IMMEDIATE CREDENTIALS
      // =========================================================================
      if (action === 'create') {
        if (!fullName) {
          return res.status(400).json({ success: false, error: 'Full name is required.' });
        }
        if (!pass || pass.length < 6) {
          return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
        }

        let authUserId: string | null = null;

        // Check if user already exists in Supabase Auth
        const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
          email,
          password: pass,
          email_confirm: true,
          user_metadata: {
            name: fullName,
            full_name: fullName,
            role
          }
        });

        if (createErr) {
          // If already registered in Auth, update password directly
          const { data: listData } = await supabase.auth.admin.listUsers();
          const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === email);

          if (existingAuthUser) {
            authUserId = existingAuthUser.id;
            const { error: updateErr } = await supabase.auth.admin.updateUserById(existingAuthUser.id, {
              password: pass,
              email_confirm: true,
              user_metadata: {
                name: fullName,
                full_name: fullName,
                role
              }
            });
            if (updateErr) {
              return res.status(500).json({ success: false, error: `Failed to update credentials: ${updateErr.message}` });
            }
          } else {
            return res.status(500).json({ success: false, error: createErr.message });
          }
        } else if (createData?.user) {
          authUserId = createData.user.id;
        }

        // Upsert record in admin_users table
        const record = {
          id: authUserId || (userData.id && userData.id.length > 20 ? userData.id : crypto.randomUUID()),
          email,
          full_name: fullName,
          role,
          status,
          created_at: userData.created_at || new Date().toISOString(),
          last_login_at: new Date().toISOString()
        };

        const { error: tableErr } = await supabase.from('admin_users').upsert(record, { onConflict: 'email' });
        if (tableErr) {
          console.warn('admin_users table upsert notice:', tableErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Administrator account and password created successfully. Access granted immediately.',
          user: record
        });
      }

      // =========================================================================
      // 2. ACTION: UPDATE EXISTING ADMINISTRATOR
      // =========================================================================
      if (action === 'update') {
        const id = userData.id || body.id;

        // If a new password was provided, update credentials in Supabase Auth
        if (pass && pass.length >= 6) {
          // Find auth user ID
          let targetAuthId = id;
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find(u => u.email?.toLowerCase() === email || u.id === id);

          if (authUser) {
            targetAuthId = authUser.id;
            const { error: passErr } = await supabase.auth.admin.updateUserById(targetAuthId, {
              password: pass,
              email_confirm: true,
              user_metadata: {
                name: fullName || authUser.user_metadata?.name,
                full_name: fullName || authUser.user_metadata?.full_name,
                role: role || authUser.user_metadata?.role
              }
            });
            if (passErr) {
              console.warn('Supabase password reset notice:', passErr.message);
            }
          }
        } else {
          // Update metadata without password
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find(u => u.email?.toLowerCase() === email || u.id === id);
          if (authUser) {
            await supabase.auth.admin.updateUserById(authUser.id, {
              user_metadata: {
                name: fullName || authUser.user_metadata?.name,
                full_name: fullName || authUser.user_metadata?.full_name,
                role: role || authUser.user_metadata?.role
              }
            });
          }
        }

        // Update database table
        const updatePayload: Record<string, any> = {
          full_name: fullName,
          role,
          status
        };

        const { error: updateTableErr } = await supabase
          .from('admin_users')
          .update(updatePayload)
          .eq('email', email);

        if (updateTableErr) {
          console.warn('admin_users update notice:', updateTableErr.message);
        }

        const updatedRecord = {
          id: id || crypto.randomUUID(),
          email,
          full_name: fullName,
          role,
          status,
          created_at: userData.created_at || new Date().toISOString(),
          last_login_at: userData.last_login_at || new Date().toISOString()
        };

        return res.status(200).json({
          success: true,
          message: 'Administrator privileges updated successfully.',
          user: updatedRecord
        });
      }

      // =========================================================================
      // 3. ACTION: TOGGLE STATUS (ACTIVE / SUSPENDED)
      // =========================================================================
      if (action === 'toggle-status') {
        const newStatus = status;
        await supabase
          .from('admin_users')
          .update({ status: newStatus })
          .eq('email', email);

        return res.status(200).json({ success: true, status: newStatus });
      }

      // =========================================================================
      // 4. ACTION: DELETE ADMINISTRATOR
      // =========================================================================
      if (action === 'delete') {
        const id = userData.id || body.id;

        // Delete from admin_users
        if (email) {
          await supabase.from('admin_users').delete().eq('email', email);
        } else if (id) {
          await supabase.from('admin_users').delete().eq('id', id);
        }

        // Delete from Auth
        try {
          const { data: listData } = await supabase.auth.admin.listUsers();
          const authUser = listData?.users?.find(u => u.email?.toLowerCase() === email || u.id === id);
          if (authUser) {
            await supabase.auth.admin.deleteUser(authUser.id);
          }
        } catch (authDelErr) {
          console.warn('Auth deletion notice:', authDelErr);
        }

        return res.status(200).json({ success: true, message: 'Administrator removed successfully.' });
      }

      return res.status(400).json({ success: false, error: `Unsupported action: ${action}` });
    } catch (err: any) {
      console.error('API /api/admin-users error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
