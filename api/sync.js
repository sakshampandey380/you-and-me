/* ==========================================================================
   YOU & ME — 3D Chat Application
   Vercel Serverless Multi-Device Synchronization Endpoint
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

// Global in-memory cache preserved across warm serverless container invocations
const globalUsers = global._ymUsers || new Map();
global._ymUsers = globalUsers;

export default async function handler(req, res) {
  // Enable CORS so requests from both https://... and localhost/file:// work seamlessly
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Optional: Check if Upstash Redis or Vercel KV environment variables are present
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. GET: Fetch all registered users
  if (req.method === 'GET') {
    let usersList = Array.from(globalUsers.values());

    if (kvUrl && kvToken) {
      try {
        const kvRes = await fetch(`${kvUrl}/get/ym_all_users`, {
          headers: { Authorization: `Bearer ${kvToken}` }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            if (Array.isArray(parsed)) {
              // Merge with memory cache
              parsed.forEach(u => {
                if (u && (u.uid || u.userId)) {
                  const id = String(u.uid || u.userId).toUpperCase();
                  globalUsers.set(id, u);
                }
              });
              usersList = Array.from(globalUsers.values());
            }
          }
        }
      } catch (err) {
        console.warn('[Sync API] KV fetch warning:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: usersList.length,
      users: usersList,
      timestamp: Date.now()
    });
  }

  // 2. POST: Register or update a user across devices
  if (req.method === 'POST') {
    try {
      const user = req.body;
      if (!user || (!user.uid && !user.userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user payload' });
      }

      const uid = String(user.uid || user.userId).toUpperCase();
      const sanitizedUser = {
        uid: uid,
        userId: uid,
        name: user.name || 'User',
        displayName: user.displayName || user.name || 'User',
        username: String(user.username || '').replace(/^@+/, ''),
        email: user.email || '',
        avatar: user.avatar || user.profilePicture || '',
        profilePicture: user.profilePicture || user.avatar || '',
        dob: user.dob || user.birthday || '',
        birthday: user.birthday || user.dob || '',
        language: user.language || 'English',
        bio: user.bio || 'Hey there! I am using You & Me 🚀',
        status: user.status || 'Available for conversations ✨',
        onlineStatus: 'online',
        lastSeen: 'Just now',
        updatedAt: new Date().toISOString()
      };

      globalUsers.set(uid, sanitizedUser);

      // Persist to Vercel KV / Upstash if configured
      if (kvUrl && kvToken) {
        try {
          const allArr = Array.from(globalUsers.values());
          await fetch(`${kvUrl}/set/ym_all_users`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${kvToken}` },
            body: JSON.stringify(allArr)
          });
        } catch (kvErr) {
          console.warn('[Sync API] KV save warning:', kvErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'User synced successfully',
        user: sanitizedUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

