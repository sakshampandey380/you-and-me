/* ==========================================================================
   YOU & ME — 3D Chat Application
   User Management & Multi-Attribute Search Service
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { storage } from './storage.js';
import { auth } from './auth.js';

class UserService {
  getUserById(userId) {
    if (!userId) return null;
    const current = auth.getCurrentUser();
    if (userId === "CURRENT_USER" && current) {
      return current;
    }
    return storage.getUserByUid(userId);
  }

  getAllUsers() {
    return storage.getUsers();
  }

  getAllEnrolledUsers(options = {}) {
    const current = auth.getCurrentUser();
    const currentUid = current ? (current.uid || current.userId) : null;
    let users = this.getAllUsers();

    if (options.excludeSelf !== false && currentUid) {
      users = users.filter(u => (u.uid || u.userId) !== currentUid);
    }

    return users.map(u => ({
      ...u,
      uid: u.uid || u.userId,
      userId: u.uid || u.userId,
      displayName: u.displayName || u.name,
      isSelf: Boolean(currentUid && (u.uid || u.userId) === currentUid),
      matchType: 'all',
      matchReason: currentUid && (u.uid || u.userId) === currentUid ? 'Your Profile' : 'Registered Member'
    }));
  }

  getSuggestedUsers(limit = 20, includeSelf = false) {
    const current = auth.getCurrentUser();
    const currentUid = current ? (current.uid || current.userId) : null;
    const users = this.getAllUsers();

    // Prioritize other registered users
    const others = users
      .filter(u => !currentUid || (u.uid || u.userId) !== currentUid)
      .map(u => ({
        ...u,
        uid: u.uid || u.userId,
        userId: u.uid || u.userId,
        displayName: u.displayName || u.name,
        isSelf: false,
        matchType: 'suggestion',
        matchReason: 'Registered Member'
      }));

    const list = [...others];
    if (includeSelf && currentUid && current) {
      list.push({
        ...current,
        uid: current.uid || current.userId,
        userId: current.uid || current.userId,
        displayName: current.displayName || current.name,
        isSelf: true,
        matchType: 'suggestion',
        matchReason: 'Your Account'
      });
    }

    if (limit && limit > 0) {
      return list.slice(0, limit);
    }
    return list;
  }

  searchUsers(query, options = {}) {
    const rawQ = String(query || '').trim();
    const shouldExcludeSelf = options.excludeSelf !== false; // Default: true (Requirement 10)

    if (!rawQ) {
      if (options.includeSuggestions) {
        return this.getSuggestedUsers(options.limit || 20, !shouldExcludeSelf);
      }
      return [];
    }

    const q = rawQ.toLowerCase();
    const cleanUserQuery = q.replace(/^@+/, '');
    const cleanUserQueryAlphanum = cleanUserQuery.replace(/[^a-z0-9]/g, '');
    const cleanIdQuery = q.replace(/[^a-z0-9]/g, '');
    const queryDigits = q.replace(/[^0-9]/g, '');
    const nameTokens = q.split(/\s+/).filter(Boolean);

    const current = auth.getCurrentUser();
    const currentUid = current ? String(current.uid || current.userId || '').toUpperCase() : null;
    const users = this.getAllUsers();

    const results = [];

    for (const u of users) {
      if (!u) continue;
      const targetUid = String(u.uid || u.userId || '').toUpperCase();
      if (!targetUid) continue;

      const isSelf = Boolean(currentUid && targetUid === currentUid);
      if (shouldExcludeSelf && isSelf) continue;

      const targetRawId = targetUid.toLowerCase();
      const targetCleanId = targetRawId.replace(/[^a-z0-9]/g, '');
      const targetNumId = targetRawId.replace(/[^0-9]/g, '');
      const targetUser = String(u.username || '').toLowerCase();
      const targetUserClean = targetUser.replace(/[^a-z0-9]/g, '');
      const targetName = String(u.displayName || u.name || '').toLowerCase();
      const targetEmail = String(u.email || '').toLowerCase();
      const targetDob = String(u.dob || u.birthday || '').toLowerCase();

      let score = 0;
      let matchType = '';
      let matchReason = '';

      // 1. User ID / UID matching (e.g. SK-A82K92, A82K92, or digits)
      if (cleanIdQuery.length >= 2 || queryDigits.length >= 2) {
        if (
          targetRawId === q ||
          targetCleanId === cleanIdQuery ||
          (queryDigits.length >= 4 && targetNumId === queryDigits)
        ) {
          score = 100;
          matchType = 'id';
          matchReason = isSelf ? `Your User ID (${targetUid})` : `Exact User ID (${targetUid})`;
        } else if (
          targetCleanId.startsWith(cleanIdQuery) ||
          (queryDigits.length >= 2 && targetNumId.startsWith(queryDigits)) ||
          targetRawId.startsWith(q)
        ) {
          score = 85;
          matchType = 'id';
          matchReason = `ID starts with ${rawQ}`;
        } else if (
          targetCleanId.includes(cleanIdQuery) ||
          (queryDigits.length >= 3 && targetNumId.includes(queryDigits)) ||
          targetRawId.includes(q)
        ) {
          score = 70;
          matchType = 'id';
          matchReason = `ID contains ${rawQ}`;
        }
      }

      // 2. Username matching (with or without '@')
      if (cleanUserQuery.length >= 1) {
        if (targetUser === cleanUserQuery || (cleanUserQueryAlphanum.length >= 2 && targetUserClean === cleanUserQueryAlphanum)) {
          const userScore = 95;
          if (userScore > score) {
            score = userScore;
            matchType = 'username';
            matchReason = isSelf ? `Your Username (@${u.username})` : `Exact @${u.username}`;
          }
        } else if (targetUser.startsWith(cleanUserQuery) || (cleanUserQueryAlphanum.length >= 2 && targetUserClean.startsWith(cleanUserQueryAlphanum))) {
          const userScore = 80;
          if (userScore > score) {
            score = userScore;
            matchType = 'username';
            matchReason = `@${u.username}`;
          }
        } else if (targetUser.includes(cleanUserQuery) || (cleanUserQueryAlphanum.length >= 2 && targetUserClean.includes(cleanUserQueryAlphanum))) {
          const userScore = 65;
          if (userScore > score) {
            score = userScore;
            matchType = 'username';
            matchReason = `@${u.username}`;
          }
        }
      }

      // 3. Full Name / Display Name matching
      if (targetName === q) {
        const nameScore = 92;
        if (nameScore > score) {
          score = nameScore;
          matchType = 'name';
          matchReason = isSelf ? 'Your Name' : 'Exact name match';
        }
      } else if (targetName.startsWith(q)) {
        const nameScore = 78;
        if (nameScore > score) {
          score = nameScore;
          matchType = 'name';
          matchReason = 'Name starts with';
        }
      } else if (nameTokens.length > 0 && nameTokens.every(tok => targetName.includes(tok))) {
        const nameScore = 62;
        if (nameScore > score) {
          score = nameScore;
          matchType = 'name';
          matchReason = 'Name match';
        }
      } else if (targetName.includes(q)) {
        const nameScore = 50;
        if (nameScore > score) {
          score = nameScore;
          matchType = 'name';
          matchReason = 'Name contains';
        }
      }

      // 4. Birthday / DOB matching (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, etc.)
      if (targetDob && q.length >= 2) {
        const cleanDobDigits = targetDob.replace(/[^0-9]/g, '');
        const cleanQDigits = q.replace(/[^0-9]/g, '');

        if (targetDob === q) {
          const dobScore = 90;
          if (dobScore > score) {
            score = dobScore;
            matchType = 'dob';
            matchReason = `Birthday: ${u.dob || u.birthday}`;
          }
        } else if (targetDob.includes(q)) {
          const dobScore = 75;
          if (dobScore > score) {
            score = dobScore;
            matchType = 'dob';
            matchReason = `Birthday matches ${rawQ}`;
          }
        } else if (cleanQDigits.length >= 2 && cleanDobDigits.includes(cleanQDigits)) {
          const dobScore = 68;
          if (dobScore > score) {
            score = dobScore;
            matchType = 'dob';
            matchReason = `Birthday (${u.dob || u.birthday})`;
          }
        }
      }

      // 5. Email matching
      if (targetEmail) {
        if (targetEmail === q) {
          const emailScore = 80;
          if (emailScore > score) {
            score = emailScore;
            matchType = 'email';
            matchReason = `Email (${u.email})`;
          }
        } else if (targetEmail.includes(q) && q.length >= 3) {
          const emailScore = 35;
          if (emailScore > score) {
            score = emailScore;
            matchType = 'email';
            matchReason = `Email contains ${rawQ}`;
          }
        }
      }

      if (score > 0) {
        results.push({
          ...u,
          uid: targetUid,
          userId: targetUid,
          displayName: u.displayName || u.name,
          isSelf,
          matchScore: score,
          matchType,
          matchReason
        });
      }
    }

    results.sort((a, b) => b.matchScore - a.matchScore);

    if (options.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  updateProfile(profileData) {
    return auth.updateCurrentUser(profileData);
  }
}

export const userService = new UserService();
