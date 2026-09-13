(() => {
  // js/config.js
  var APP_CONFIG = {
    name: "You & Me",
    tagline: "Connect. Chat. Share. Together.",
    creatorSignature: "Made by Sakcham \u2764\uFE0F",
    version: "1.0.0",
    storagePrefix: "ym_3d_",
    uniqueIdPrefix: "YM-",
    defaultAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238a3ffc'/><stop offset='100%' stop-color='%23ff3366'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' opacity='0.9'/><path d='M20,84 C20,64 35,58 50,58 C65,58 80,64 80,84 Z' fill='%23ffffff' opacity='0.9'/></svg>"
  };
  var INITIAL_DEMO_USERS = [
    {
      userId: "YM-482913",
      name: "Alex Rivera",
      username: "alex",
      email: "alex@youandme.app",
      password: "password123",
      bio: "Passionate photographer & stargazer \u2728 Building the future of 3D spaces.",
      status: "Exploring new horizons \u{1F30C}",
      onlineStatus: "online",
      lastSeen: "Just now",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-10T10:00:00Z"
    },
    {
      userId: "YM-773104",
      name: "Emma Watson",
      username: "emma",
      email: "emma@youandme.app",
      password: "password123",
      bio: "Coffee enthusiast, UI designer & book lover \u2615\u{1F4D6} Always here for deep talks.",
      status: "Lost in a good melody \u{1F3A7}",
      onlineStatus: "online",
      lastSeen: "Just now",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T12:30:00Z"
    },
    {
      userId: "YM-519280",
      name: "Arjun Sharma",
      username: "arjun",
      email: "arjun@youandme.app",
      password: "password123",
      bio: "Tech explorer, rock climber & coder \u{1F3D4}\uFE0F Let's connect and create together.",
      status: "Coding with passion \u{1F4BB}",
      onlineStatus: "offline",
      lastSeen: "15m ago",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-01T08:15:00Z"
    },
    {
      userId: "YM-628491",
      name: "Sophia Chen",
      username: "sophia",
      email: "sophia@youandme.app",
      password: "password123",
      bio: "Digital artist & sound designer \u{1F3A8} Dreaming in pastel gradients.",
      status: "Crafting 3D worlds \u{1F52E}",
      onlineStatus: "online",
      lastSeen: "Just now",
      profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-02-14T14:00:00Z"
    },
    {
      userId: "YM-304918",
      name: "Daniel Brooks",
      username: "daniel",
      email: "daniel@youandme.app",
      password: "password123",
      bio: "Filmmaker & world traveler \u{1F3A5} Looking for stories that inspire.",
      status: "Editing on the go \u2708\uFE0F",
      onlineStatus: "offline",
      lastSeen: "2 hours ago",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-03-01T16:45:00Z"
    }
  ];
  var INITIAL_DEMO_CONVERSATIONS = [
    {
      conversationId: "conv-alex",
      participants: ["CURRENT_USER", "YM-482913"],
      createdAt: "2026-09-10T10:00:00Z",
      unreadCount: 1,
      messages: [
        {
          id: "msg-101",
          senderId: "YM-482913",
          type: "text",
          text: "Hey! Welcome to You & Me \u{1F680} The 3D atmosphere here feels unbelievable!",
          timestamp: "2026-09-13T18:20:00Z",
          status: "read",
          reactions: [{ emoji: "\u2764\uFE0F", userIds: ["CURRENT_USER"] }]
        },
        {
          id: "msg-102",
          senderId: "CURRENT_USER",
          type: "text",
          text: "I love the floating particles and depth! How are you doing today?",
          timestamp: "2026-09-13T18:22:00Z",
          status: "read",
          reactions: [{ emoji: "\u{1F525}", userIds: ["YM-482913"] }]
        },
        {
          id: "msg-103",
          senderId: "YM-482913",
          type: "image",
          mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
          caption: "Check out the starry night view from the hill tonight! \u{1F30C}",
          timestamp: "2026-09-13T18:24:00Z",
          status: "read",
          reactions: [{ emoji: "\u{1F62E}", userIds: ["CURRENT_USER"] }, { emoji: "\u2764\uFE0F", userIds: ["CURRENT_USER"] }]
        },
        {
          id: "msg-104",
          senderId: "YM-482913",
          type: "text",
          text: "Let me know what you think of the new 3D theme! \u2728",
          timestamp: "2026-09-13T18:25:00Z",
          status: "delivered",
          reactions: []
        }
      ]
    },
    {
      conversationId: "conv-emma",
      participants: ["CURRENT_USER", "YM-773104"],
      createdAt: "2026-09-11T14:00:00Z",
      unreadCount: 0,
      messages: [
        {
          id: "msg-201",
          senderId: "YM-773104",
          type: "text",
          text: "Hey there! Are we still catching up this evening? \u2615",
          timestamp: "2026-09-13T16:10:00Z",
          status: "read",
          reactions: [{ emoji: "\u{1F44D}", userIds: ["CURRENT_USER"] }]
        },
        {
          id: "msg-202",
          senderId: "CURRENT_USER",
          type: "text",
          text: "Yes, definitely! Let's meet at 7 PM.",
          timestamp: "2026-09-13T16:15:00Z",
          status: "read",
          reactions: []
        },
        {
          id: "msg-203",
          senderId: "YM-773104",
          type: "text",
          text: "Perfect! See you soon \u{1F970}",
          timestamp: "2026-09-13T16:16:00Z",
          status: "read",
          reactions: [{ emoji: "\u2764\uFE0F", userIds: ["CURRENT_USER"] }]
        }
      ]
    }
  ];
  var EMOJI_CATEGORIES = [
    {
      name: "Love & Romance",
      emojis: ["\u2764\uFE0F", "\u{1F496}", "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F498}", "\u{1F49D}", "\u{1F49F}", "\u{1F48C}", "\u{1F970}", "\u{1F618}", "\u{1F60D}", "\u{1F339}", "\u2728", "\u{1F4AB}", "\u{1F54A}\uFE0F", "\u{1F48D}"]
    },
    {
      name: "Smileys & Expressions",
      emojis: ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F643}", "\u{1F609}", "\u{1F60C}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F60E}", "\u{1F929}", "\u{1F973}", "\u{1F60F}", "\u{1F97A}", "\u{1F622}", "\u{1F62D}", "\u{1F624}", "\u{1F620}", "\u{1F92F}", "\u{1F633}", "\u{1F917}", "\u{1F914}", "\u{1F92B}", "\u{1F634}"]
    },
    {
      name: "Gestures & Hands",
      emojis: ["\u{1F44D}", "\u{1F44E}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}", "\u{1F932}", "\u{1F91D}", "\u{1F64F}", "\u270C\uFE0F", "\u{1F91E}", "\u{1F91F}", "\u{1F918}", "\u{1F44C}", "\u{1F90C}", "\u{1F90F}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F447}", "\u261D\uFE0F", "\u270B", "\u{1F91A}", "\u{1F590}\uFE0F", "\u{1F596}", "\u{1F44B}", "\u{1F919}", "\u{1F4AA}"]
    },
    {
      name: "Vibes & Atmosphere",
      emojis: ["\u{1F525}", "\u2B50", "\u{1F31F}", "\u{1F389}", "\u{1F38A}", "\u{1F388}", "\u{1F37E}", "\u{1F942}", "\u2615", "\u{1F355}", "\u{1F370}", "\u{1F369}", "\u{1F3D6}\uFE0F", "\u{1F680}", "\u{1F308}", "\u2600\uFE0F", "\u{1F319}", "\u{1F30C}", "\u{1F3B5}", "\u{1F3B6}"]
    }
  ];

  // js/services/storage.js
  var StorageService = class {
    constructor() {
      this.prefix = APP_CONFIG.storagePrefix;
      this.memoryStore = {};
      this.init();
    }
    init() {
      if (!this.get("users")) {
        this.set("users", INITIAL_DEMO_USERS);
      }
      if (!this.get("friendships")) {
        this.set("friendships", [
          { id: "f-1", user1: "CURRENT_USER", user2: "YM-482913", status: "accepted", createdAt: "2026-09-01T10:00:00Z" },
          { id: "f-2", user1: "CURRENT_USER", user2: "YM-773104", status: "accepted", createdAt: "2026-09-05T12:00:00Z" },
          { id: "f-3", user1: "YM-519280", user2: "CURRENT_USER", status: "pending", createdAt: "2026-09-13T14:30:00Z" }
          // Incoming request from Arjun!
        ]);
      }
      if (!this.get("conversations")) {
        this.set("conversations", INITIAL_DEMO_CONVERSATIONS);
      }
      if (!this.get("notifications")) {
        this.set("notifications", [
          {
            id: "notif-1",
            type: "friend_request",
            title: "New Friend Request",
            message: "Arjun Sharma sent you a friend request.",
            fromUserId: "YM-519280",
            timestamp: "2026-09-13T14:30:00Z",
            read: false
          },
          {
            id: "notif-2",
            type: "reaction",
            title: "New Reaction",
            message: "Emma reacted with \u2764\uFE0F to your message.",
            fromUserId: "YM-773104",
            timestamp: "2026-09-13T16:16:00Z",
            read: true
          }
        ]);
      }
      if (!this.get("settings")) {
        this.set("settings", {
          theme: "dark",
          depthIntensity: 1,
          soundEnabled: true,
          enterToSend: true,
          privacyLastSeen: true,
          privacyOnline: true
        });
      }
    }
    get(key) {
      try {
        if (typeof localStorage !== "undefined") {
          const data = localStorage.getItem(this.prefix + key);
          if (data) return JSON.parse(data);
        }
      } catch (e) {
      }
      return this.memoryStore[key] ? JSON.parse(JSON.stringify(this.memoryStore[key])) : null;
    }
    set(key, value) {
      this.memoryStore[key] = value;
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(this.prefix + key, JSON.stringify(value));
          return true;
        }
      } catch (e) {
      }
      return true;
    }
    remove(key) {
      delete this.memoryStore[key];
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(this.prefix + key);
          return true;
        }
      } catch (e) {
      }
      return true;
    }
    clearAll() {
      this.memoryStore = {};
      try {
        if (typeof localStorage !== "undefined") {
          Object.keys(localStorage).filter((k) => k.startsWith(this.prefix)).forEach((k) => localStorage.removeItem(k));
        }
      } catch (e) {
      }
      this.init();
      return true;
    }
  };
  var storage = new StorageService();

  // js/services/auth.js
  var AuthService = class {
    constructor() {
      this.currentUser = null;
      this._loadSession();
    }
    _loadSession() {
      const session = storage.get("active_session");
      if (session && session.userId) {
        const users = storage.get("users") || [];
        const user = users.find((u) => u.userId === session.userId);
        if (user) {
          this.currentUser = user;
        }
      }
    }
    generateUserId() {
      const randomNum = Math.floor(1e5 + Math.random() * 9e5);
      return `${APP_CONFIG.uniqueIdPrefix}${randomNum}`;
    }
    registerUser({ name, username, email, password, profilePicture }) {
      const users = storage.get("users") || [];
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const cleanEmail = email.trim().toLowerCase();
      if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
        throw new Error("Username is already taken. Please choose another.");
      }
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        throw new Error("An account with this email already exists.");
      }
      const newUser = {
        userId: this.generateUserId(),
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password,
        // In production, hashed on server
        profilePicture: profilePicture || APP_CONFIG.defaultAvatar,
        bio: "Hey there! I am using You & Me \u{1F680}",
        status: "Available for conversations \u2728",
        onlineStatus: "online",
        lastSeen: "Just now",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      users.push(newUser);
      storage.set("users", users);
      this._setSession(newUser, true);
      return newUser;
    }
    loginUser(identifier, password, rememberMe = true) {
      const users = storage.get("users") || [];
      const cleanId = identifier.trim().toLowerCase();
      const user = users.find(
        (u) => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId || u.userId.toLowerCase() === cleanId
      );
      if (!user) {
        throw new Error("No account found with this username, email or ID.");
      }
      if (user.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }
      user.onlineStatus = "online";
      user.lastSeen = "Just now";
      storage.set("users", users);
      this._setSession(user, rememberMe);
      return user;
    }
    _setSession(user, remember) {
      this.currentUser = user;
      if (remember) {
        storage.set("active_session", { userId: user.userId, token: "mock_jwt_ym_" + Date.now() });
      } else {
        sessionStorage.setItem("ym_temp_session", JSON.stringify({ userId: user.userId }));
      }
    }
    getCurrentUser() {
      if (!this.currentUser) {
        this._loadSession();
      }
      return this.currentUser;
    }
    updateCurrentUser(updates) {
      if (!this.currentUser) return null;
      const users = storage.get("users") || [];
      const index = users.findIndex((u) => u.userId === this.currentUser.userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        this.currentUser = users[index];
        storage.set("users", users);
        return this.currentUser;
      }
      return null;
    }
    logout() {
      if (this.currentUser) {
        const users = storage.get("users") || [];
        const user = users.find((u) => u.userId === this.currentUser.userId);
        if (user) {
          user.onlineStatus = "offline";
          user.lastSeen = "Just now";
          storage.set("users", users);
        }
      }
      this.currentUser = null;
      storage.remove("active_session");
      sessionStorage.removeItem("ym_temp_session");
    }
    isAuthenticated() {
      return !!this.getCurrentUser();
    }
  };
  var auth = new AuthService();

  // js/services/sound.js
  var SoundService = class {
    constructor() {
      this.ctx = null;
    }
    _initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    _isSoundEnabled() {
      const settings = storage.get("settings") || {};
      return settings.soundEnabled !== false;
    }
    playMessageSent() {
      if (!this._isSoundEnabled()) return;
      try {
        this._initContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {
        console.warn("Audio playback error", e);
      }
    }
    playMessageReceived() {
      if (!this._isSoundEnabled()) return;
      try {
        this._initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = "sine";
        osc2.type = "triangle";
        osc1.frequency.setValueAtTime(587.33, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        osc2.frequency.setValueAtTime(880, now);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.25);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.26);
        osc2.stop(now + 0.26);
      } catch (e) {
        console.warn("Audio playback error", e);
      }
    }
    playNotification() {
      if (!this._isSoundEnabled()) return;
      try {
        this._initContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(987.77, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {
        console.warn("Audio playback error", e);
      }
    }
  };
  var sound = new SoundService();

  // js/services/chat.js
  var ChatService = class {
    _getConversations() {
      return storage.get("conversations") || [];
    }
    _saveConversations(convs) {
      storage.set("conversations", convs);
    }
    _resolveId(id) {
      const current = auth.getCurrentUser();
      if (id === "CURRENT_USER" && current) return current.userId;
      return id;
    }
    getConversations() {
      const current = auth.getCurrentUser();
      if (!current) return [];
      const convs = this._getConversations();
      return convs.filter((c) => c.participants.map((p) => this._resolveId(p)).includes(current.userId)).map((c) => {
        const otherId = c.participants.map((p) => this._resolveId(p)).find((id) => id !== current.userId);
        const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
        return {
          ...c,
          otherParticipantId: otherId,
          lastMessage: lastMsg
        };
      }).sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.createdAt).getTime();
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
    }
    getConversationById(convId) {
      const current = auth.getCurrentUser();
      if (!current) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const otherId = conv.participants.map((p) => this._resolveId(p)).find((id) => id !== current.userId);
      return {
        ...conv,
        otherParticipantId: otherId
      };
    }
    getOrCreateConversation(targetUserId) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const convs = this._getConversations();
      let conv = convs.find((c) => {
        const parts = c.participants.map((p) => this._resolveId(p));
        return parts.includes(current.userId) && parts.includes(targetUserId);
      });
      if (!conv) {
        conv = {
          conversationId: "conv-" + Date.now(),
          participants: [current.userId, targetUserId],
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          unreadCount: 0,
          messages: []
        };
        convs.unshift(conv);
        this._saveConversations(convs);
      }
      return {
        ...conv,
        otherParticipantId: targetUserId
      };
    }
    sendMessage(convId, { type = "text", text = "", mediaUrl = null, fileName = null, fileSize = null, replyTo = null }) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) throw new Error("Conversation not found.");
      const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
      const newMsg = {
        id: messageId,
        senderId: current.userId,
        type,
        // 'text' | 'image' | 'video' | 'file'
        text: text ? text.trim() : "",
        mediaUrl: mediaUrl || null,
        fileName: fileName || null,
        fileSize: fileSize || null,
        replyTo: replyTo || null,
        // { id, senderName, text }
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "sent",
        reactions: []
      };
      conv.messages.push(newMsg);
      this._saveConversations(convs);
      sound.playMessageSent();
      return newMsg;
    }
    editMessage(convId, messageId, newText) {
      const current = auth.getCurrentUser();
      if (!current) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg && this._resolveId(msg.senderId) === current.userId) {
        msg.text = newText.trim();
        msg.edited = true;
        msg.editedAt = (/* @__PURE__ */ new Date()).toISOString();
        this._saveConversations(convs);
        return msg;
      }
      return null;
    }
    deleteMessage(convId, messageId, mode = "everyone") {
      const current = auth.getCurrentUser();
      if (!current) return false;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return false;
      const msg = conv.messages.find((m) => m.id === messageId);
      if (!msg) return false;
      if (mode === "everyone") {
        msg.type = "deleted";
        msg.text = "This message was deleted";
        msg.mediaUrl = null;
        msg.deleted = true;
      } else {
        msg.deletedFor = msg.deletedFor || [];
        if (!msg.deletedFor.includes(current.userId)) {
          msg.deletedFor.push(current.userId);
        }
      }
      this._saveConversations(convs);
      return true;
    }
    toggleReaction(convId, messageId, emoji) {
      const current = auth.getCurrentUser();
      if (!current) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const msg = conv.messages.find((m) => m.id === messageId);
      if (!msg) return null;
      msg.reactions = msg.reactions || [];
      let existingReaction = msg.reactions.find((r) => r.emoji === emoji);
      if (existingReaction) {
        const userIndex = existingReaction.userIds.map((id) => this._resolveId(id)).indexOf(current.userId);
        if (userIndex !== -1) {
          existingReaction.userIds.splice(userIndex, 1);
          if (existingReaction.userIds.length === 0) {
            msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
          }
        } else {
          existingReaction.userIds.push(current.userId);
        }
      } else {
        msg.reactions.push({
          emoji,
          userIds: [current.userId]
        });
      }
      this._saveConversations(convs);
      return msg.reactions;
    }
    markAsRead(convId) {
      const current = auth.getCurrentUser();
      if (!current) return;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return;
      conv.unreadCount = 0;
      conv.messages.forEach((m) => {
        if (this._resolveId(m.senderId) !== current.userId && m.status !== "read") {
          m.status = "read";
        }
      });
      this._saveConversations(convs);
    }
    searchInConversation(convId, query) {
      if (!query || !query.trim()) return [];
      const q = query.trim().toLowerCase();
      const conv = this.getConversationById(convId);
      if (!conv || !conv.messages) return [];
      return conv.messages.filter(
        (m) => m.type !== "deleted" && m.text && m.text.toLowerCase().includes(q)
      );
    }
  };
  var chatService = new ChatService();

  // js/services/user.js
  var UserService = class {
    getUserById(userId) {
      if (!userId) return null;
      const current = auth.getCurrentUser();
      if (userId === "CURRENT_USER" && current) {
        return current;
      }
      const users = storage.get("users") || [];
      return users.find((u) => u.userId === userId) || null;
    }
    getAllUsers() {
      return storage.get("users") || [];
    }
    searchUsers(query) {
      if (!query || !query.trim()) return [];
      const q = query.trim().toLowerCase();
      const current = auth.getCurrentUser();
      const currentId = current ? current.userId : null;
      const users = this.getAllUsers();
      return users.filter((u) => {
        if (currentId && u.userId === currentId) return false;
        const matchName = u.name.toLowerCase().includes(q);
        const matchUser = u.username.toLowerCase().includes(q);
        const matchId = u.userId.toLowerCase().includes(q);
        return matchName || matchUser || matchId;
      });
    }
    updateProfile(profileData) {
      return auth.updateCurrentUser(profileData);
    }
  };
  var userService = new UserService();

  // js/services/notification.js
  var NotificationService = class {
    _getNotifications() {
      return storage.get("notifications") || [];
    }
    _saveNotifications(list) {
      storage.set("notifications", list);
    }
    getNotifications() {
      return this._getNotifications().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    getUnreadCount() {
      return this._getNotifications().filter((n) => !n.read).length;
    }
    addNotification({ type, title, message, fromUserId = null }) {
      const list = this._getNotifications();
      const newNotif = {
        id: "notif-" + Date.now(),
        type,
        // 'message' | 'friend_request' | 'friend_accepted' | 'reaction'
        title,
        message,
        fromUserId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        read: false
      };
      list.unshift(newNotif);
      this._saveNotifications(list);
      sound.playNotification();
      window.dispatchEvent(new CustomEvent("ym:notification_added", { detail: newNotif }));
      return newNotif;
    }
    markAllAsRead() {
      const list = this._getNotifications();
      list.forEach((n) => n.read = true);
      this._saveNotifications(list);
      window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
    }
    clearAll() {
      this._saveNotifications([]);
      window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
    }
  };
  var notificationService = new NotificationService();

  // js/services/realtime.js
  var RealtimeService = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
      this.activeConversationId = null;
      this.socket = null;
      this.isWsConnected = false;
    }
    // Subscribe to realtime events
    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
    off(event, callback) {
      if (!this.listeners.has(event)) return;
      const callbacks = this.listeners.get(event).filter((cb) => cb !== callback);
      this.listeners.set(event, callbacks);
    }
    emit(event, payload) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach((cb) => cb(payload));
      }
    }
    setActiveConversation(convId) {
      this.activeConversationId = convId;
    }
    // Real WebSocket connect method (ready for backend server)
    connectWebSocket(url) {
      if (!url) return;
      try {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
          this.isWsConnected = true;
          this.emit("connection:ready", { status: "connected" });
        };
        this.socket.onmessage = (event) => {
          try {
            const { type, payload } = JSON.parse(event.data);
            this.emit(type, payload);
          } catch (e) {
            console.error("Invalid WS message format", e);
          }
        };
        this.socket.onclose = () => {
          this.isWsConnected = false;
          this.emit("connection:closed", {});
        };
      } catch (e) {
        console.warn("WebSocket not available, falling back to simulated realtime engine", e);
      }
    }
    // Simulate Partner Interactive Responses
    handleUserSentMessage(convId, sentMessage) {
      const conv = chatService.getConversationById(convId);
      if (!conv) return;
      const partnerId = conv.otherParticipantId;
      const partner = userService.getUserById(partnerId);
      if (!partner) return;
      setTimeout(() => {
        sentMessage.status = "delivered";
        this.emit("message:status_update", { messageId: sentMessage.id, status: "delivered" });
      }, 700);
      setTimeout(() => {
        sentMessage.status = "read";
        this.emit("message:status_update", { messageId: sentMessage.id, status: "read" });
      }, 1400);
      const typingDelay = 1800 + Math.random() * 800;
      setTimeout(() => {
        this.emit("typing:start", { conversationId: convId, userId: partnerId, userName: partner.name });
        const replyDelay = 2200 + Math.random() * 1400;
        setTimeout(() => {
          this.emit("typing:stop", { conversationId: convId, userId: partnerId });
          const replyText = this._generatePartnerResponse(partner.name, sentMessage.text);
          const replyMsg = {
            id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
            senderId: partnerId,
            type: "text",
            text: replyText,
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            status: "read",
            reactions: []
          };
          conv.messages.push(replyMsg);
          chatService._saveConversations(chatService._getConversations());
          this.emit("message:received", { conversationId: convId, message: replyMsg });
          if (this.activeConversationId === convId) {
            sound.playMessageReceived();
          } else {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
            chatService._saveConversations(chatService._getConversations());
            notificationService.addNotification({
              type: "message",
              title: partner.name,
              message: replyText,
              fromUserId: partnerId
            });
          }
        }, replyDelay);
      }, typingDelay);
    }
    _generatePartnerResponse(name, incomingText) {
      const text = (incomingText || "").toLowerCase();
      if (text.includes("hey") || text.includes("hello") || text.includes("hi")) {
        return `Hey! Wonderful to hear from you! How is your day going? \u2728`;
      }
      if (text.includes("how are you") || text.includes("how r u")) {
        return `I'm doing fantastic! The 3D atmosphere here in You & Me is so mesmerizing \u{1F31F} What about you?`;
      }
      if (text.includes("love") || text.includes("heart") || text.includes("you & me")) {
        return `You & Me has the best romantic 3D vibes! Love the flying hearts and spatial depth \u2764\uFE0F`;
      }
      if (text.includes("photo") || text.includes("pic") || text.includes("image")) {
        return `That looks incredible! The 3D viewer makes it pop out so vividly \u{1F4F8}`;
      }
      if (text.includes("bye") || text.includes("night")) {
        return `Goodnight! Sweet dreams, talk to you soon! \u{1F319}\u{1F4AB}`;
      }
      const responses = [
        `I completely agree! The depth and smooth glass look unreal \u2728`,
        `That sounds so nice! Tell me more about it \u{1F60A}`,
        `Absolutely! That made my day \u2764\uFE0F`,
        `Haha that's amazing! Have you tested the reactions bar yet? \u{1F525}`,
        `I love how fluid and fast this chat feels! \u{1F680}`,
        `Always here for you! Let's make today unforgettable \u{1F4AB}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };
  var realtime = new RealtimeService();

  // js/components/background3d.js
  var Background3D = class {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.width = 0;
      this.height = 0;
      this.animationFrameId = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;
      this.nodes = [];
      this.spheres = [];
      this.floatingHearts = [];
      this.time = 0;
      this.init();
    }
    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("mousemove", (e) => {
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 50;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 50;
      });
      window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
          this.targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 35;
          this.targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 35;
        }
      }, { passive: true });
      this._createSpheres(6);
      this._createNodes(35);
      this._createFloatingHearts(6);
      this.start();
    }
    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    _createSpheres(count) {
      this.spheres = [];
      for (let i = 0; i < count; i++) {
        this.spheres.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          z: Math.random() * 400 + 100,
          // 3D depth
          radius: Math.random() * 80 + 40,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          hue: i % 2 === 0 ? 335 : 265,
          // Rose or purple
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    }
    _createNodes(count) {
      this.nodes = [];
      for (let i = 0; i < count; i++) {
        this.nodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          depth: Math.random() * 0.8 + 0.2,
          radius: Math.random() * 2.5 + 1.2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    }
    _createFloatingHearts(count) {
      this.floatingHearts = [];
      for (let i = 0; i < count; i++) {
        this.floatingHearts.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 10 + 8,
          speedY: Math.random() * 0.5 + 0.2,
          wobble: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.35 + 0.15
        });
      }
    }
    start() {
      if (!this.animationFrameId) {
        this.animate();
      }
    }
    stop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
    animate() {
      this.time += 0.015;
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
      this.ctx.clearRect(0, 0, this.width, this.height);
      const settings = storage.get("settings") || {};
      const isLight = document.documentElement.getAttribute("data-theme") === "light" || settings.theme === "light";
      this._draw3DSpheres(isLight);
      this._drawNodesAndConnections(isLight);
      this._drawFloatingHearts(isLight);
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
    _draw3DSpheres(isLight) {
      this.ctx.save();
      for (let s of this.spheres) {
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.x < -s.radius) s.x = this.width + s.radius;
        if (s.x > this.width + s.radius) s.x = -s.radius;
        if (s.y < -s.radius) s.y = this.height + s.radius;
        if (s.y > this.height + s.radius) s.y = -s.radius;
        const depthFactor = 300 / (s.z || 300);
        const px = s.x + this.mouseX * depthFactor;
        const py = s.y + this.mouseY * depthFactor;
        const r = s.radius * depthFactor * (1 + Math.sin(this.time + s.pulseOffset) * 0.06);
        const grad = this.ctx.createRadialGradient(
          px - r * 0.3,
          py - r * 0.3,
          r * 0.1,
          px,
          py,
          r
        );
        const alpha = isLight ? 0.08 : 0.18;
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 75%, ${alpha * 1.5})`);
        grad.addColorStop(0.6, `hsla(${s.hue}, 90%, 55%, ${alpha})`);
        grad.addColorStop(1, "transparent");
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, r, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    _drawNodesAndConnections(isLight) {
      this.ctx.save();
      const maxDist = 120;
      const nodeColor = isLight ? "rgba(120, 60, 220," : "rgba(180, 120, 255,";
      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = this.width;
        if (n.x > this.width) n.x = 0;
        if (n.y < 0) n.y = this.height;
        if (n.y > this.height) n.y = 0;
        const px = n.x + this.mouseX * n.depth;
        const py = n.y + this.mouseY * n.depth;
        this.ctx.fillStyle = `${nodeColor} ${0.35 * n.depth})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, n.radius * n.depth, 0, Math.PI * 2);
        this.ctx.fill();
        for (let j = i + 1; j < this.nodes.length; j++) {
          const n2 = this.nodes[j];
          const px2 = n2.x + this.mouseX * n2.depth;
          const py2 = n2.y + this.mouseY * n2.depth;
          const dx = px - px2;
          const dy = py - py2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15 * Math.min(n.depth, n2.depth);
            this.ctx.strokeStyle = `${nodeColor} ${alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(px, py);
            this.ctx.lineTo(px2, py2);
            this.ctx.stroke();
          }
        }
      }
      this.ctx.restore();
    }
    _drawFloatingHearts(isLight) {
      this.ctx.save();
      for (let h of this.floatingHearts) {
        h.y -= h.speedY;
        h.wobble += 0.02;
        const px = h.x + Math.sin(h.wobble) * 15 + this.mouseX * 0.2;
        const py = h.y + this.mouseY * 0.2;
        if (h.y < -30) {
          h.y = this.height + 30;
          h.x = Math.random() * this.width;
        }
        this.ctx.fillStyle = isLight ? `rgba(255, 51, 102, ${h.alpha * 0.6})` : `rgba(255, 51, 102, ${h.alpha})`;
        this.ctx.beginPath();
        const d = h.size * 0.5;
        this.ctx.moveTo(px, py - d * 0.4);
        this.ctx.bezierCurveTo(px - d * 0.8, py - d * 1.2, px - d * 1.6, py - d * 0.2, px, py + d * 1.2);
        this.ctx.bezierCurveTo(px + d * 1.6, py - d * 0.2, px + d * 0.8, py - d * 1.2, px, py - d * 0.4);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  };

  // js/components/toast.js
  var ToastService = class {
    constructor() {
      this.container = null;
      this._ensureContainer();
    }
    _ensureContainer() {
      if (!this.container) {
        this.container = document.querySelector(".toast-container");
        if (!this.container) {
          this.container = document.createElement("div");
          this.container.className = "toast-container";
          document.body.appendChild(this.container);
        }
      }
    }
    show(message, type = "info", duration = 3200) {
      this._ensureContainer();
      const toast2 = document.createElement("div");
      toast2.className = `toast-3d toast-${type}`;
      let iconSvg = "";
      if (type === "success") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else if (type === "error") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      }
      toast2.innerHTML = `
      <div style="color: ${type === "success" ? "var(--color-success)" : type === "error" ? "var(--color-danger)" : "var(--color-romantic-pink)"}; display:flex; align-items:center;">
        ${iconSvg}
      </div>
      <div style="flex:1; font-size:13.5px; font-weight:500;">${message}</div>
    `;
      toast2.addEventListener("click", () => this._dismiss(toast2));
      this.container.appendChild(toast2);
      setTimeout(() => {
        this._dismiss(toast2);
      }, duration);
    }
    _dismiss(toast2) {
      if (!toast2 || toast2.dataset.dismissed) return;
      toast2.dataset.dismissed = "true";
      toast2.style.opacity = "0";
      toast2.style.transform = "perspective(600px) translateY(-20px) scale(0.9)";
      setTimeout(() => {
        if (toast2.parentElement) toast2.parentElement.removeChild(toast2);
      }, 300);
    }
    success(msg) {
      this.show(msg, "success");
    }
    error(msg) {
      this.show(msg, "error");
    }
    info(msg) {
      this.show(msg, "info");
    }
  };
  var toast = new ToastService();

  // js/components/romanticScene.js
  var RomanticScene = class {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.width = 0;
      this.height = 0;
      this.animationFrameId = null;
      this.isRunning = false;
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;
      this.stars = [];
      this.hearts = [];
      this.fireflies = [];
      this.time = 0;
      this.init();
    }
    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("mousemove", (e) => {
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
      });
      window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
          this.targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 30;
          this.targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 30;
        }
      }, { passive: true });
      this._createStars(140);
      this._createHearts(28);
      this._createFireflies(24);
    }
    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    _createStars(count) {
      this.stars = [];
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.75),
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          depth: Math.random() * 0.5 + 0.2
        });
      }
    }
    _createHearts(count) {
      this.hearts = [];
      for (let i = 0; i < count; i++) {
        this.hearts.push(this._generateHeart(true));
      }
    }
    _generateHeart(randomY = false) {
      const depth = Math.random() * 0.8 + 0.4;
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : this.height + 20 + Math.random() * 50,
        size: (Math.random() * 14 + 10) * depth,
        speedY: (Math.random() * 1.2 + 0.6) * depth,
        speedX: (Math.sin(Math.random() * Math.PI) - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        depth,
        alpha: Math.random() * 0.6 + 0.4,
        hue: Math.random() > 0.3 ? 340 + Math.random() * 25 : 270 + Math.random() * 20,
        // Pink to purple
        wobbleOffset: Math.random() * Math.PI * 2
      };
    }
    _createFireflies(count) {
      this.fireflies = [];
      for (let i = 0; i < count; i++) {
        this.fireflies.push({
          x: Math.random() * this.width,
          y: this.height * 0.4 + Math.random() * (this.height * 0.55),
          radius: Math.random() * 2.5 + 1.2,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          pulseSpeed: Math.random() * 0.05 + 0.02,
          depth: Math.random() * 0.8 + 0.3
        });
      }
    }
    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.animate();
      }
    }
    stop() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
    animate() {
      if (!this.isRunning) return;
      this.time += 0.02;
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this._drawSkyGradient();
      this._drawMoon();
      this._drawStars();
      this._drawHillsAndGround();
      this._drawStreetLampAndCouple();
      this._drawFireflies();
      this._draw3DHearts();
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
    _drawSkyGradient() {
      const grad = this.ctx.createRadialGradient(
        this.width * 0.5 + this.mouseX * 0.2,
        this.height * 0.3 + this.mouseY * 0.2,
        10,
        this.width * 0.5,
        this.height * 0.5,
        this.width
      );
      grad.addColorStop(0, "#1c1542");
      grad.addColorStop(0.5, "#0e0e22");
      grad.addColorStop(1, "#06060e");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    _drawMoon() {
      const moonX = this.width * 0.82 + this.mouseX * 0.2;
      const moonY = this.height * 0.18 + this.mouseY * 0.2;
      const radius = Math.min(this.width * 0.06, 55);
      const glow = this.ctx.createRadialGradient(moonX, moonY, radius * 0.8, moonX, moonY, radius * 3);
      glow.addColorStop(0, "rgba(255, 230, 240, 0.25)");
      glow.addColorStop(0.5, "rgba(255, 105, 180, 0.08)");
      glow.addColorStop(1, "transparent");
      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, radius * 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.save();
      this.ctx.fillStyle = "#fff6ea";
      this.ctx.shadowColor = "#ff6584";
      this.ctx.shadowBlur = 20;
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.beginPath();
      this.ctx.arc(moonX - radius * 0.45, moonY - radius * 0.2, radius * 0.9, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    _drawStars() {
      this.ctx.save();
      for (let star of this.stars) {
        star.alpha += Math.sin(this.time + star.x) * star.twinkleSpeed;
        const alpha = Math.max(0.1, Math.min(1, star.alpha));
        const px = star.x + this.mouseX * star.depth;
        const py = star.y + this.mouseY * star.depth;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, star.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    _drawHillsAndGround() {
      this.ctx.save();
      const groundY = this.height * 0.88;
      this.ctx.fillStyle = "#0b0c1c";
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      this.ctx.lineTo(0, groundY - 30);
      this.ctx.quadraticCurveTo(this.width * 0.4, groundY - 90, this.width, groundY - 20);
      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();
      this.ctx.fill();
      const foreGround = this.ctx.createLinearGradient(0, groundY - 40, 0, this.height);
      foreGround.addColorStop(0, "#060712");
      foreGround.addColorStop(1, "#020308");
      this.ctx.fillStyle = foreGround;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      this.ctx.lineTo(0, groundY);
      this.ctx.quadraticCurveTo(this.width * 0.5, groundY - 35, this.width, groundY + 10);
      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
    _drawStreetLampAndCouple() {
      this.ctx.save();
      const isMobile = this.width < 768;
      const originX = isMobile ? this.width * 0.5 : this.width * 0.28;
      const originY = this.height * 0.86;
      const scale = isMobile ? Math.min(this.width / 440, 0.85) : 1;
      const lampX = originX + 75 * scale;
      const lampTopY = originY - 180 * scale;
      const coneGrad = this.ctx.createRadialGradient(lampX, lampTopY + 15, 10, lampX, lampTopY + 120, 160 * scale);
      coneGrad.addColorStop(0, "rgba(255, 235, 160, 0.45)");
      coneGrad.addColorStop(0.3, "rgba(255, 180, 80, 0.2)");
      coneGrad.addColorStop(0.8, "rgba(255, 105, 180, 0.05)");
      coneGrad.addColorStop(1, "transparent");
      this.ctx.fillStyle = coneGrad;
      this.ctx.beginPath();
      this.ctx.moveTo(lampX - 15 * scale, lampTopY + 20);
      this.ctx.lineTo(lampX - 120 * scale, originY + 10);
      this.ctx.lineTo(lampX + 120 * scale, originY + 10);
      this.ctx.lineTo(lampX + 15 * scale, lampTopY + 20);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = "#0a0a14";
      this.ctx.strokeStyle = "#0a0a14";
      this.ctx.lineWidth = 4 * scale;
      this.ctx.beginPath();
      this.ctx.moveTo(lampX, originY);
      this.ctx.lineTo(lampX, lampTopY + 20);
      this.ctx.stroke();
      this.ctx.fillRect(lampX - 8 * scale, originY - 10, 16 * scale, 12);
      this.ctx.fillRect(lampX - 5 * scale, lampTopY + 45, 10 * scale, 6);
      this.ctx.beginPath();
      this.ctx.moveTo(lampX - 16 * scale, lampTopY + 20);
      this.ctx.lineTo(lampX + 16 * scale, lampTopY + 20);
      this.ctx.lineTo(lampX + 12 * scale, lampTopY);
      this.ctx.lineTo(lampX - 12 * scale, lampTopY);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(lampX, lampTopY - 6, 8 * scale, 0, Math.PI, true);
      this.ctx.fill();
      const bulbGlow = this.ctx.createRadialGradient(lampX, lampTopY + 10, 2, lampX, lampTopY + 10, 24 * scale);
      bulbGlow.addColorStop(0, "#ffffff");
      bulbGlow.addColorStop(0.4, "#ffea9f");
      bulbGlow.addColorStop(1, "rgba(255, 170, 50, 0)");
      this.ctx.fillStyle = bulbGlow;
      this.ctx.beginPath();
      this.ctx.arc(lampX, lampTopY + 10, 20 * scale, 0, Math.PI * 2);
      this.ctx.fill();
      const benchX = originX - 45 * scale;
      const benchY = originY - 30 * scale;
      this.ctx.fillStyle = "#080812";
      this.ctx.strokeStyle = "#080812";
      this.ctx.lineWidth = 3.5 * scale;
      this.ctx.fillRect(benchX - 40 * scale, benchY + 10 * scale, 80 * scale, 5 * scale);
      this.ctx.fillRect(benchX - 38 * scale, benchY - 15 * scale, 76 * scale, 4 * scale);
      this.ctx.fillRect(benchX - 38 * scale, benchY - 7 * scale, 76 * scale, 4 * scale);
      this.ctx.beginPath();
      this.ctx.moveTo(benchX - 32 * scale, benchY + 12 * scale);
      this.ctx.lineTo(benchX - 35 * scale, originY + 2);
      this.ctx.moveTo(benchX + 32 * scale, benchY + 12 * scale);
      this.ctx.lineTo(benchX + 35 * scale, originY + 2);
      this.ctx.stroke();
      const p1X = benchX - 10 * scale;
      const p1Y = benchY - 12 * scale;
      this.ctx.fillStyle = "#06060c";
      this.ctx.beginPath();
      this.ctx.arc(p1X, p1Y - 26 * scale, 9 * scale, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(p1X - 8 * scale, p1Y + 10 * scale);
      this.ctx.lineTo(p1X - 5 * scale, p1Y - 18 * scale);
      this.ctx.lineTo(p1X + 8 * scale, p1Y - 18 * scale);
      this.ctx.lineTo(p1X + 10 * scale, p1Y + 10 * scale);
      this.ctx.closePath();
      this.ctx.fill();
      const p2X = benchX + 8 * scale;
      const p2Y = benchY - 10 * scale;
      this.ctx.beginPath();
      this.ctx.arc(p2X - 4 * scale, p2Y - 23 * scale, 8 * scale, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(p2X - 7 * scale, p2Y + 10 * scale);
      this.ctx.lineTo(p2X - 5 * scale, p2Y - 16 * scale);
      this.ctx.lineTo(p2X + 8 * scale, p2Y - 16 * scale);
      this.ctx.lineTo(p2X + 9 * scale, p2Y + 10 * scale);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillRect(p1X - 6 * scale, p1Y + 10 * scale, 8 * scale, 22 * scale);
      this.ctx.fillRect(p2X - 1 * scale, p2Y + 10 * scale, 8 * scale, 22 * scale);
      const lovePulse = Math.sin(this.time * 3) * 0.15 + 1;
      this._drawSingleHeart(benchX, p1Y - 50 * scale, 12 * lovePulse * scale, 0, 1, 345);
      this.ctx.restore();
    }
    _drawFireflies() {
      this.ctx.save();
      for (let f2 of this.fireflies) {
        f2.x += f2.speedX + Math.sin(this.time * 2 + f2.y) * 0.4;
        f2.y += f2.speedY + Math.cos(this.time * 2 + f2.x) * 0.4;
        if (f2.x < 0) f2.x = this.width;
        if (f2.x > this.width) f2.x = 0;
        if (f2.y < this.height * 0.3) f2.y = this.height * 0.85;
        if (f2.y > this.height * 0.9) f2.y = this.height * 0.4;
        const alpha = (Math.sin(this.time * 4 + f2.x) * 0.4 + 0.6) * f2.alpha;
        const glow = this.ctx.createRadialGradient(f2.x, f2.y, 0, f2.x, f2.y, f2.radius * 4);
        glow.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
        glow.addColorStop(0.5, `rgba(255, 105, 180, ${alpha * 0.4})`);
        glow.addColorStop(1, "transparent");
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(f2.x, f2.y, f2.radius * 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    _draw3DHearts() {
      for (let h of this.hearts) {
        h.y -= h.speedY;
        h.x += Math.sin(this.time + h.wobbleOffset) * 0.8;
        h.rotation += h.rotSpeed;
        const px = h.x + this.mouseX * h.depth;
        const py = h.y + this.mouseY * h.depth;
        this._drawSingleHeart(px, py, h.size, h.rotation, h.alpha * h.depth, h.hue);
        if (h.y < -50) {
          Object.assign(h, this._generateHeart(false));
        }
      }
    }
    _drawSingleHeart(x, y, size, rotation, alpha, hue) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      this.ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${alpha})`;
      this.ctx.shadowBlur = size * 0.8;
      this.ctx.fillStyle = `hsla(${hue}, 100%, 68%, ${alpha})`;
      this.ctx.beginPath();
      const d = size * 0.6;
      this.ctx.moveTo(0, -d * 0.4);
      this.ctx.bezierCurveTo(-d * 0.8, -d * 1.2, -d * 1.6, -d * 0.2, 0, d * 1.2);
      this.ctx.bezierCurveTo(d * 1.6, -d * 0.2, d * 0.8, -d * 1.2, 0, -d * 0.4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
      this.ctx.beginPath();
      this.ctx.arc(-d * 0.4, -d * 0.5, d * 0.25, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  };

  // js/views/authView.js
  var AuthView = class {
    constructor(onAuthSuccess) {
      this.onAuthSuccess = onAuthSuccess;
      this.scene = null;
      this.currentMode = "login";
      this.uploadedAvatarData = null;
      this._init();
    }
    _init() {
      this.scene = new RomanticScene("romantic-canvas");
      this._bindEvents();
    }
    show() {
      const authScreen = document.getElementById("auth-screen");
      if (authScreen) authScreen.style.display = "flex";
      if (this.scene) this.scene.start();
    }
    hide() {
      const authScreen = document.getElementById("auth-screen");
      if (authScreen) authScreen.style.display = "none";
      if (this.scene) this.scene.stop();
    }
    _bindEvents() {
      const tabLogin = document.getElementById("tab-login");
      const tabSignup = document.getElementById("tab-signup");
      const formLogin = document.getElementById("form-login");
      const formSignup = document.getElementById("form-signup");
      const avatarInput = document.getElementById("signup-avatar-input");
      const forgotPassBtn = document.getElementById("btn-forgot-password");
      if (tabLogin) {
        tabLogin.addEventListener("click", () => this.switchTab("login"));
      }
      if (tabSignup) {
        tabSignup.addEventListener("click", () => this.switchTab("signup"));
      }
      if (avatarInput) {
        avatarInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            if (!file.type.startsWith("image/")) {
              toast.error("Please select a valid image file.");
              return;
            }
            const reader = new FileReader();
            reader.onload = (evt) => {
              this.uploadedAvatarData = evt.target.result;
              const previewImg = document.getElementById("signup-avatar-preview");
              if (previewImg) previewImg.src = this.uploadedAvatarData;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
          e.preventDefault();
          const identifier = document.getElementById("login-identifier").value;
          const password = document.getElementById("login-password").value;
          const remember = document.getElementById("login-remember").checked;
          if (!identifier || !password) {
            toast.error("Please fill in all fields.");
            return;
          }
          try {
            const user = auth.loginUser(identifier, password, remember);
            toast.success(`Welcome back, ${user.name}! \u2728`);
            this.onAuthSuccess(user);
          } catch (err) {
            toast.error(err.message);
          }
        });
      }
      if (formSignup) {
        formSignup.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = document.getElementById("signup-name").value;
          const username = document.getElementById("signup-username").value;
          const email = document.getElementById("signup-email").value;
          const password = document.getElementById("signup-password").value;
          const confirmPassword = document.getElementById("signup-confirm-password").value;
          if (!name || !username || !email || !password) {
            toast.error("Please fill in all required fields.");
            return;
          }
          if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
          }
          if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
          }
          try {
            const user = auth.registerUser({
              name,
              username,
              email,
              password,
              profilePicture: this.uploadedAvatarData
            });
            toast.success(`Account created! Your ID is ${user.userId} \u{1F389}`);
            this.onAuthSuccess(user);
          } catch (err) {
            toast.error(err.message);
          }
        });
      }
      if (forgotPassBtn) {
        forgotPassBtn.addEventListener("click", (e) => {
          e.preventDefault();
          toast.info("Demo Account Tip: You can log in with username 'alex' and password 'password123', or create a new account!");
        });
      }
      document.querySelectorAll(".password-toggle-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const input = btn.parentElement.querySelector("input");
          if (input.type === "password") {
            input.type = "text";
            btn.style.color = "var(--color-romantic-pink)";
          } else {
            input.type = "password";
            btn.style.color = "var(--text-muted)";
          }
        });
      });
    }
    switchTab(mode) {
      this.currentMode = mode;
      const tabLogin = document.getElementById("tab-login");
      const tabSignup = document.getElementById("tab-signup");
      const formLogin = document.getElementById("form-login");
      const formSignup = document.getElementById("form-signup");
      if (mode === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        formLogin.style.display = "flex";
        formSignup.style.display = "none";
      } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        formSignup.style.display = "flex";
        formLogin.style.display = "none";
      }
    }
  };

  // js/views/chatListView.js
  var ChatListView = class {
    constructor(containerId, onSelectConversation) {
      this.container = document.getElementById(containerId);
      this.onSelectConversation = onSelectConversation;
      this.activeConvId = null;
      this.typingMap = /* @__PURE__ */ new Map();
    }
    setTyping(convId, userName) {
      if (userName) {
        this.typingMap.set(convId, userName);
      } else {
        this.typingMap.delete(convId);
      }
      this.render();
    }
    setActive(convId) {
      this.activeConvId = convId;
      this.render();
    }
    render(filter = "") {
      if (!this.container) return;
      const convs = chatService.getConversations();
      const current = auth.getCurrentUser();
      if (convs.length === 0) {
        this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">\u2728</div>
          <div class="empty-state-title">No Chats Yet</div>
          <div class="empty-state-text">Your conversations are waiting. Connect with friends to start chatting!</div>
        </div>
      `;
        return;
      }
      this.container.innerHTML = "";
      const q = filter.toLowerCase().trim();
      convs.forEach((conv) => {
        const partner = userService.getUserById(conv.otherParticipantId);
        if (!partner) return;
        if (q && !partner.name.toLowerCase().includes(q) && !partner.username.toLowerCase().includes(q)) {
          return;
        }
        const item = document.createElement("div");
        item.className = `chat-list-item card-3d ${conv.conversationId === this.activeConvId ? "active" : ""}`;
        let lastMsgText = "No messages yet";
        let lastMsgClass = "";
        if (this.typingMap.has(conv.conversationId)) {
          lastMsgText = "typing...";
          lastMsgClass = "typing";
        } else if (conv.lastMessage) {
          if (conv.lastMessage.type === "image") {
            lastMsgText = "\u{1F4F7} Photo";
          } else if (conv.lastMessage.type === "video") {
            lastMsgText = "\u{1F3A5} Video";
          } else if (conv.lastMessage.type === "file") {
            lastMsgText = "\u{1F4CE} Document";
          } else if (conv.lastMessage.type === "deleted") {
            lastMsgText = "\u{1F6AB} Message deleted";
          } else {
            lastMsgText = conv.lastMessage.text || "";
          }
        }
        let timeStr = "";
        if (conv.lastMessage) {
          const d = new Date(conv.lastMessage.timestamp);
          timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        const isOnline = partner.onlineStatus === "online";
        item.innerHTML = `
        <div class="avatar-wrap">
          <img src="${partner.profilePicture}" class="avatar-img" alt="${partner.name}" />
          <span class="avatar-status ${isOnline ? "online" : ""}"></span>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-header">
            <span class="chat-item-name">${partner.name}</span>
            <span class="chat-item-time">${timeStr}</span>
          </div>
          <div class="chat-item-bottom">
            <span class="chat-item-lastmsg ${lastMsgClass}">${lastMsgText}</span>
            ${conv.unreadCount > 0 ? `<span class="badge-count">${conv.unreadCount}</span>` : ""}
          </div>
        </div>
      `;
        item.addEventListener("click", () => {
          if (this.onSelectConversation) {
            this.onSelectConversation(conv.conversationId);
          }
        });
        this.container.appendChild(item);
      });
    }
  };

  // js/components/modal.js
  var ModalService = class {
    confirm({ title = "Confirm Action", message = "Are you sure?", confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) {
      return new Promise((resolve) => {
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop active";
        backdrop.innerHTML = `
        <div class="modal-3d">
          <div class="modal-header">
            <h3 style="font-size: 18px; font-weight: 700;">${title}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 24px;">
            ${message}
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-3d btn-glass btn-cancel">${cancelText}</button>
            <button class="btn-3d ${isDanger ? "btn-danger" : "btn-primary"} btn-confirm">${confirmText}</button>
          </div>
        </div>
      `;
        const cleanup = (result) => {
          backdrop.classList.remove("active");
          setTimeout(() => {
            if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
            resolve(result);
          }, 250);
        };
        backdrop.querySelector(".modal-close-btn").addEventListener("click", () => cleanup(false));
        backdrop.querySelector(".btn-cancel").addEventListener("click", () => cleanup(false));
        backdrop.querySelector(".btn-confirm").addEventListener("click", () => cleanup(true));
        backdrop.addEventListener("click", (e) => {
          if (e.target === backdrop) cleanup(false);
        });
        document.body.appendChild(backdrop);
      });
    }
  };
  var modal = new ModalService();

  // js/components/mediaViewer.js
  var MediaViewerService = class {
    constructor() {
      this.lightbox = null;
      this.zoomLevel = 1;
      this._build();
    }
    _build() {
      this.lightbox = document.createElement("div");
      this.lightbox.className = "media-lightbox";
      this.lightbox.innerHTML = `
      <div class="media-lightbox-toolbar">
        <button class="btn-icon zoom-in-btn" title="Zoom In">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button class="btn-icon zoom-out-btn" title="Zoom Out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button class="btn-icon download-btn" title="Download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button class="btn-icon close-btn" title="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="media-container" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; overflow:hidden;">
        <!-- Media inserted dynamically -->
      </div>
    `;
      document.body.appendChild(this.lightbox);
      this.lightbox.querySelector(".close-btn").addEventListener("click", () => this.close());
      this.lightbox.querySelector(".zoom-in-btn").addEventListener("click", () => this.zoom(0.25));
      this.lightbox.querySelector(".zoom-out-btn").addEventListener("click", () => this.zoom(-0.25));
      this.lightbox.addEventListener("click", (e) => {
        if (e.target === this.lightbox || e.target.classList.contains("media-container")) {
          this.close();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.lightbox.classList.contains("active")) {
          this.close();
        }
      });
    }
    open(mediaUrl, type = "image", fileName = "you_and_me_media") {
      const container = this.lightbox.querySelector(".media-container");
      container.innerHTML = "";
      this.zoomLevel = 1;
      if (type === "video") {
        const video = document.createElement("video");
        video.src = mediaUrl;
        video.controls = true;
        video.autoplay = true;
        video.className = "media-lightbox-content";
        container.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = mediaUrl;
        img.className = "media-lightbox-content";
        container.appendChild(img);
      }
      const downloadBtn = this.lightbox.querySelector(".download-btn");
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = mediaUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      this.lightbox.classList.add("active");
    }
    zoom(delta) {
      this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
      const media = this.lightbox.querySelector(".media-lightbox-content");
      if (media) {
        media.style.transform = `scale(${this.zoomLevel})`;
      }
    }
    close() {
      this.lightbox.classList.remove("active");
      const container = this.lightbox.querySelector(".media-container");
      const video = container.querySelector("video");
      if (video) video.pause();
      setTimeout(() => {
        container.innerHTML = "";
      }, 300);
    }
  };
  var mediaViewer = new MediaViewerService();

  // js/components/mediaPreview.js
  var MediaPreviewService = class {
    show({ file, dataUrl, type, caption = "" }) {
      return new Promise((resolve) => {
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop active";
        let previewContent = "";
        if (type === "image") {
          previewContent = `<img src="${dataUrl}" style="max-height: 220px; border-radius: 14px; object-fit: contain; margin: 0 auto; display: block;" />`;
        } else if (type === "video") {
          previewContent = `<video src="${dataUrl}" controls style="max-height: 220px; border-radius: 14px; width: 100%;"></video>`;
        } else {
          previewContent = `
          <div style="display: flex; align-items: center; gap: 14px; padding: 18px; background: rgba(0,0,0,0.2); border-radius: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: #fff;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 14px;">${file.name}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        `;
        }
        backdrop.innerHTML = `
        <div class="modal-3d" style="max-width: 440px;">
          <div class="modal-header">
            <h3 style="font-size: 17px; font-weight: 700;">Attachment Preview</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div style="margin-bottom: 16px;">
            ${previewContent}
          </div>
          <div style="margin-bottom: 20px;">
            <input type="text" class="preview-caption-input" placeholder="Add an optional caption..." value="${caption}" style="width: 100%; font-size: 13.5px;" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-3d btn-glass btn-cancel">Cancel</button>
            <button class="btn-3d btn-primary btn-send">
              <span>Send Attachment</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      `;
        const cleanup = (confirmed) => {
          backdrop.classList.remove("active");
          const captionVal = backdrop.querySelector(".preview-caption-input").value.trim();
          setTimeout(() => {
            if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
            resolve(confirmed ? { confirmed: true, caption: captionVal } : { confirmed: false });
          }, 250);
        };
        backdrop.querySelector(".modal-close-btn").addEventListener("click", () => cleanup(false));
        backdrop.querySelector(".btn-cancel").addEventListener("click", () => cleanup(false));
        backdrop.querySelector(".btn-send").addEventListener("click", () => cleanup(true));
        document.body.appendChild(backdrop);
      });
    }
  };
  var mediaPreview = new MediaPreviewService();

  // js/components/emojiPicker.js
  var EmojiPicker = class {
    constructor(onSelect) {
      this.onSelect = onSelect;
      this.panel = null;
      this.isOpen = false;
      this._build();
    }
    _build() {
      this.panel = document.createElement("div");
      this.panel.className = "emoji-picker-panel";
      this.panel.innerHTML = `
      <div class="emoji-search-box">
        <input type="text" placeholder="Search emojis..." class="emoji-search-input" style="width:100%; padding:8px 12px; font-size:13px;" />
      </div>
      <div class="emoji-grid"></div>
    `;
      const searchInput = this.panel.querySelector(".emoji-search-input");
      const grid = this.panel.querySelector(".emoji-grid");
      const renderEmojis = (filter = "") => {
        grid.innerHTML = "";
        const term = filter.toLowerCase().trim();
        EMOJI_CATEGORIES.forEach((cat) => {
          const matches = cat.emojis.filter((e) => !term || cat.name.toLowerCase().includes(term));
          matches.forEach((emoji) => {
            const btn = document.createElement("span");
            btn.className = "emoji-item";
            btn.textContent = emoji;
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (this.onSelect) this.onSelect(emoji);
            });
            grid.appendChild(btn);
          });
        });
      };
      searchInput.addEventListener("input", (e) => renderEmojis(e.target.value));
      renderEmojis();
      document.body.appendChild(this.panel);
      document.addEventListener("click", (e) => {
        if (this.isOpen && !this.panel.contains(e.target) && !e.target.closest(".emoji-toggle-btn")) {
          this.close();
        }
      });
    }
    toggle(anchorElement) {
      if (this.isOpen) {
        this.close();
      } else {
        this.open(anchorElement);
      }
    }
    open(anchorElement) {
      if (!anchorElement) return;
      const rect = anchorElement.getBoundingClientRect();
      this.panel.style.top = Math.max(10, rect.top - 350) + "px";
      this.panel.style.left = Math.min(window.innerWidth - 330, Math.max(10, rect.left - 140)) + "px";
      this.panel.classList.add("active");
      this.isOpen = true;
    }
    close() {
      this.panel.classList.remove("active");
      this.isOpen = false;
    }
  };

  // js/views/chatView.js
  var ChatView = class {
    constructor() {
      this.currentConvId = null;
      this.replyTargetMessage = null;
      this.activeContextMenu = null;
      this.emojiPicker = null;
      this.container = document.getElementById("chat-screen");
      this.messagesContainer = document.getElementById("chat-messages");
      this.composerTextarea = document.getElementById("composer-textarea");
      this.replyPreviewBar = document.getElementById("reply-preview-bar");
      this.typingRow = document.getElementById("chat-typing-row");
      this.searchBar = document.getElementById("chat-search-bar");
      this._initEmojiPicker();
      this._bindEvents();
    }
    _initEmojiPicker() {
      this.emojiPicker = new EmojiPicker((emoji) => {
        if (this.composerTextarea) {
          this.composerTextarea.value += emoji;
          this.composerTextarea.focus();
          this._autoGrowTextarea();
        }
      });
    }
    openConversation(convId) {
      this.currentConvId = convId;
      realtime.setActiveConversation(convId);
      chatService.markAsRead(convId);
      const conv = chatService.getConversationById(convId);
      if (!conv) return;
      const partner = userService.getUserById(conv.otherParticipantId);
      if (!partner) return;
      document.getElementById("chat-header-avatar").src = partner.profilePicture;
      document.getElementById("chat-header-name").textContent = partner.name;
      const statusEl = document.getElementById("chat-header-status");
      statusEl.textContent = partner.onlineStatus === "online" ? "Online" : `Last seen ${partner.lastSeen || "recently"}`;
      statusEl.className = `chat-header-status ${partner.onlineStatus === "online" ? "online" : ""}`;
      this.cancelReply();
      this.closeSearch();
      this.renderMessages();
      document.querySelector(".app-sidebar")?.classList.add("chat-open");
      document.querySelector(".app-main-view")?.classList.add("chat-open");
      document.querySelector(".app-dashboard")?.classList.add("in-chat");
      this.scrollToBottom();
    }
    closeConversation() {
      this.currentConvId = null;
      realtime.setActiveConversation(null);
      document.querySelector(".app-sidebar")?.classList.remove("chat-open");
      document.querySelector(".app-main-view")?.classList.remove("chat-open");
      document.querySelector(".app-dashboard")?.classList.remove("in-chat");
    }
    renderMessages(searchQuery = "") {
      if (!this.messagesContainer || !this.currentConvId) return;
      const conv = chatService.getConversationById(this.currentConvId);
      if (!conv) return;
      const current = auth.getCurrentUser();
      this.messagesContainer.innerHTML = "";
      let lastSenderId = null;
      let lastDateStr = null;
      conv.messages.forEach((msg) => {
        if (msg.deletedFor && msg.deletedFor.includes(current.userId)) {
          return;
        }
        const msgDate = new Date(msg.timestamp);
        const dateStr = this._formatDateSeparator(msgDate);
        if (dateStr !== lastDateStr) {
          const sep = document.createElement("div");
          sep.className = "date-separator";
          sep.textContent = dateStr;
          this.messagesContainer.appendChild(sep);
          lastDateStr = dateStr;
        }
        const isOutgoing = msg.senderId === current.userId;
        const isConsecutive = lastSenderId === msg.senderId;
        lastSenderId = msg.senderId;
        const row = document.createElement("div");
        row.className = `message-row ${isOutgoing ? "outgoing" : "incoming"} ${isConsecutive ? "consecutive" : ""} anim-message-enter`;
        row.dataset.msgId = msg.id;
        let contentHtml = "";
        if (msg.replyTo) {
          contentHtml += `
          <div class="quoted-message-box" data-reply-to-id="${msg.replyTo.id}">
            <div class="quoted-sender">${msg.replyTo.senderName}</div>
            <div class="quoted-text">${msg.replyTo.text}</div>
          </div>
        `;
        }
        if (msg.type === "deleted") {
          contentHtml += `<div style="font-style:italic; opacity:0.6;">\u{1F6AB} This message was deleted</div>`;
        } else if (msg.type === "image") {
          contentHtml += `
          <div class="message-image-wrap" data-img-url="${msg.mediaUrl}">
            <img src="${msg.mediaUrl}" alt="Photo message" />
          </div>
          ${msg.text ? `<div style="margin-top:6px;">${msg.text}</div>` : ""}
        `;
        } else if (msg.type === "video") {
          contentHtml += `
          <div class="message-video-wrap">
            <video src="${msg.mediaUrl}" controls></video>
          </div>
          ${msg.text ? `<div style="margin-top:6px;">${msg.text}</div>` : ""}
        `;
        } else if (msg.type === "file") {
          contentHtml += `
          <a href="${msg.mediaUrl}" download="${msg.fileName || "file"}" class="message-file-wrap" style="color:inherit; text-decoration:none;">
            <div class="message-file-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div class="message-file-details">
              <div class="message-file-name">${msg.fileName || "Document"}</div>
              <div class="message-file-size">${msg.fileSize || "File"}</div>
            </div>
          </a>
          ${msg.text ? `<div style="margin-top:4px;">${msg.text}</div>` : ""}
        `;
        } else {
          const isEmojiOnly = this._isOnlyEmojis(msg.text);
          if (isEmojiOnly) {
            row.classList.add("emoji-row");
            contentHtml += `<div class="message-bubble emoji-only">${msg.text}</div>`;
          } else {
            let text = msg.text;
            if (searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase())) {
              const regex = new RegExp(`(${searchQuery})`, "gi");
              text = text.replace(regex, `<mark style="background:var(--color-romantic-pink); color:#fff; border-radius:3px; padding:0 2px;">$1</mark>`);
            }
            contentHtml += `<div>${text}</div>`;
          }
        }
        const timeStr = msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        let statusIcon = "";
        if (isOutgoing && msg.type !== "deleted") {
          if (msg.status === "read") {
            statusIcon = `<span class="message-status-icon read" title="Read">\u2713\u2713</span>`;
          } else if (msg.status === "delivered") {
            statusIcon = `<span class="message-status-icon" title="Delivered">\u2713\u2713</span>`;
          } else {
            statusIcon = `<span class="message-status-icon" title="Sent">\u2713</span>`;
          }
        }
        const metaHtml = `
        <div class="message-meta">
          ${msg.edited ? '<span style="font-size:10px; opacity:0.8; margin-right:4px;">Edited</span>' : ""}
          <span>${timeStr}</span>
          ${statusIcon}
        </div>
      `;
        if (!row.classList.contains("emoji-row")) {
          row.innerHTML = `<div class="message-bubble">${contentHtml}${metaHtml}</div>`;
        } else {
          row.innerHTML += metaHtml;
        }
        if (msg.reactions && msg.reactions.length > 0) {
          const reactionsBar = document.createElement("div");
          reactionsBar.className = "message-reactions";
          msg.reactions.forEach((r) => {
            const isReactedByMe = r.userIds.includes(current.userId);
            const pill = document.createElement("span");
            pill.className = `reaction-pill ${isReactedByMe ? "reacted-by-me" : ""}`;
            pill.innerHTML = `${r.emoji} <span style="font-size:11px; opacity:0.85;">${r.userIds.length}</span>`;
            pill.addEventListener("click", (e) => {
              e.stopPropagation();
              this.toggleReaction(msg.id, r.emoji);
            });
            reactionsBar.appendChild(pill);
          });
          row.appendChild(reactionsBar);
        }
        const imgWrap = row.querySelector(".message-image-wrap");
        if (imgWrap) {
          imgWrap.addEventListener("click", (e) => {
            e.stopPropagation();
            mediaViewer.open(imgWrap.dataset.imgUrl, "image", msg.text || "photo");
          });
        }
        const quotedBox = row.querySelector(".quoted-message-box");
        if (quotedBox) {
          quotedBox.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetId = quotedBox.dataset.replyToId;
            const targetRow = this.messagesContainer.querySelector(`[data-msg-id="${targetId}"]`);
            if (targetRow) {
              targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
              targetRow.style.filter = "brightness(1.5)";
              setTimeout(() => targetRow.style.filter = "", 1e3);
            }
          });
        }
        const bubble = row.querySelector(".message-bubble") || row;
        bubble.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this._showContextMenu(e, msg, isOutgoing);
        });
        this.messagesContainer.appendChild(row);
      });
      if (this.typingRow) {
        this.messagesContainer.appendChild(this.typingRow);
      }
    }
    _showContextMenu(e, msg, isOutgoing) {
      this._closeContextMenu();
      const menu = document.createElement("div");
      menu.className = "message-context-menu active";
      const quickReacts = ["\u2764\uFE0F", "\u{1F602}", "\u{1F44D}", "\u{1F62E}", "\u{1F622}", "\u{1F525}", "\u{1F44F}"];
      let reactDockHtml = `<div style="display:flex; gap:6px; padding:4px 6px; border-bottom:1px solid var(--glass-border); margin-bottom:4px;">`;
      quickReacts.forEach((emoji) => {
        reactDockHtml += `<span class="quick-react-btn" data-emoji="${emoji}">${emoji}</span>`;
      });
      reactDockHtml += `</div>`;
      menu.innerHTML = `
      ${reactDockHtml}
      <div class="context-menu-item" data-action="reply">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
        Reply
      </div>
      <div class="context-menu-item" data-action="copy">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copy Text
      </div>
      <div class="context-menu-item" data-action="delete-me">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        Delete for me
      </div>
      ${isOutgoing && msg.type !== "deleted" ? `
        <div class="context-menu-item danger" data-action="delete-everyone">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete for everyone
        </div>
      ` : ""}
    `;
      const x = Math.min(window.innerWidth - 200, Math.max(10, e.clientX || 50));
      const y = Math.min(window.innerHeight - 240, Math.max(10, e.clientY || 50));
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      menu.querySelectorAll(".quick-react-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.toggleReaction(msg.id, btn.dataset.emoji);
          this._closeContextMenu();
        });
      });
      menu.querySelector('[data-action="reply"]')?.addEventListener("click", () => {
        this.startReply(msg);
        this._closeContextMenu();
      });
      menu.querySelector('[data-action="copy"]')?.addEventListener("click", () => {
        if (msg.text) {
          navigator.clipboard.writeText(msg.text);
          toast.success("Copied to clipboard!");
        }
        this._closeContextMenu();
      });
      menu.querySelector('[data-action="delete-me"]')?.addEventListener("click", async () => {
        const ok = await modal.confirm({
          title: "Delete Message?",
          message: "This will delete this message for you only.",
          confirmText: "Delete",
          isDanger: true
        });
        if (ok) {
          chatService.deleteMessage(this.currentConvId, msg.id, "me");
          this.renderMessages();
        }
        this._closeContextMenu();
      });
      menu.querySelector('[data-action="delete-everyone"]')?.addEventListener("click", async () => {
        const ok = await modal.confirm({
          title: "Delete for Everyone?",
          message: "This message will be deleted for everyone in this conversation.",
          confirmText: "Delete for Everyone",
          isDanger: true
        });
        if (ok) {
          chatService.deleteMessage(this.currentConvId, msg.id, "everyone");
          this.renderMessages();
        }
        this._closeContextMenu();
      });
      document.body.appendChild(menu);
      this.activeContextMenu = menu;
      setTimeout(() => {
        document.addEventListener("click", () => this._closeContextMenu(), { once: true });
      }, 10);
    }
    _closeContextMenu() {
      if (this.activeContextMenu) {
        if (this.activeContextMenu.parentElement) {
          this.activeContextMenu.parentElement.removeChild(this.activeContextMenu);
        }
        this.activeContextMenu = null;
      }
    }
    toggleReaction(msgId, emoji) {
      chatService.toggleReaction(this.currentConvId, msgId, emoji);
      this.renderMessages();
    }
    startReply(msg) {
      const current = auth.getCurrentUser();
      const isMe = msg.senderId === current.userId;
      const senderName = isMe ? "You" : document.getElementById("chat-header-name")?.textContent || "Friend";
      this.replyTargetMessage = {
        id: msg.id,
        senderName,
        text: msg.text || (msg.type === "image" ? "Photo" : msg.type === "video" ? "Video" : "Attachment")
      };
      document.getElementById("reply-preview-sender").textContent = `Replying to ${senderName}`;
      document.getElementById("reply-preview-text").textContent = this.replyTargetMessage.text;
      this.replyPreviewBar.classList.add("active");
      this.composerTextarea.focus();
    }
    cancelReply() {
      this.replyTargetMessage = null;
      if (this.replyPreviewBar) this.replyPreviewBar.classList.remove("active");
    }
    showTyping(userName) {
      if (!this.typingRow) return;
      this.typingRow.style.display = "flex";
      document.getElementById("typing-user-label").textContent = `${userName} is typing`;
      this.scrollToBottom();
    }
    hideTyping() {
      if (this.typingRow) this.typingRow.style.display = "none";
    }
    scrollToBottom() {
      setTimeout(() => {
        if (this.messagesContainer) {
          this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
      }, 50);
    }
    _bindEvents() {
      document.getElementById("chat-back-btn")?.addEventListener("click", () => {
        this.closeConversation();
      });
      document.getElementById("cancel-reply-btn")?.addEventListener("click", () => {
        this.cancelReply();
      });
      document.getElementById("composer-send-btn")?.addEventListener("click", () => {
        this.sendCurrentTextMessage();
      });
      if (this.composerTextarea) {
        this.composerTextarea.addEventListener("input", () => this._autoGrowTextarea());
        this.composerTextarea.addEventListener("keydown", (e) => {
          const settings = storage.get("settings") || {};
          const enterToSend = settings.enterToSend !== false;
          if (enterToSend && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            this.sendCurrentTextMessage();
          }
        });
      }
      const emojiBtn = document.getElementById("composer-emoji-btn");
      if (emojiBtn) {
        emojiBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.emojiPicker.toggle(emojiBtn);
        });
      }
      const fileInput = document.getElementById("chat-file-input");
      const attachBtn = document.getElementById("composer-attach-btn");
      if (attachBtn && fileInput) {
        attachBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          let type = "file";
          if (file.type.startsWith("image/")) type = "image";
          else if (file.type.startsWith("video/")) type = "video";
          const reader = new FileReader();
          reader.onload = async (evt) => {
            const dataUrl = evt.target.result;
            const result = await mediaPreview.show({ file, dataUrl, type });
            if (result.confirmed) {
              const sentMsg = chatService.sendMessage(this.currentConvId, {
                type,
                text: result.caption || "",
                mediaUrl: dataUrl,
                fileName: file.name,
                fileSize: `${(file.size / 1024).toFixed(1)} KB`,
                replyTo: this.replyTargetMessage
              });
              this.cancelReply();
              this.renderMessages();
              this.scrollToBottom();
              realtime.handleUserSentMessage(this.currentConvId, sentMsg);
            }
            fileInput.value = "";
          };
          reader.readAsDataURL(file);
        });
      }
      document.getElementById("chat-search-toggle-btn")?.addEventListener("click", () => {
        this.toggleSearch();
      });
      document.getElementById("chat-search-close-btn")?.addEventListener("click", () => {
        this.closeSearch();
      });
      document.getElementById("chat-search-input")?.addEventListener("input", (e) => {
        this.renderMessages(e.target.value.trim());
      });
      document.getElementById("chat-call-btn")?.addEventListener("click", () => {
        toast.info("\u{1F4DE} Secure 3D voice call feature ready for WebRTC connection!");
      });
    }
    toggleSearch() {
      if (this.searchBar) {
        const isActive = this.searchBar.classList.toggle("active");
        if (isActive) {
          document.getElementById("chat-search-input")?.focus();
        } else {
          this.renderMessages();
        }
      }
    }
    closeSearch() {
      if (this.searchBar) {
        this.searchBar.classList.remove("active");
        const input = document.getElementById("chat-search-input");
        if (input) input.value = "";
        this.renderMessages();
      }
    }
    sendCurrentTextMessage() {
      if (!this.composerTextarea || !this.currentConvId) return;
      const text = this.composerTextarea.value.trim();
      if (!text) return;
      const sentMsg = chatService.sendMessage(this.currentConvId, {
        type: "text",
        text,
        replyTo: this.replyTargetMessage
      });
      this.composerTextarea.value = "";
      this._autoGrowTextarea();
      this.cancelReply();
      this.renderMessages();
      this.scrollToBottom();
      realtime.handleUserSentMessage(this.currentConvId, sentMsg);
    }
    _autoGrowTextarea() {
      if (!this.composerTextarea) return;
      this.composerTextarea.style.height = "auto";
      this.composerTextarea.style.height = Math.min(this.composerTextarea.scrollHeight, 120) + "px";
    }
    _formatDateSeparator(date) {
      const today = /* @__PURE__ */ new Date();
      const yesterday = /* @__PURE__ */ new Date();
      yesterday.setDate(today.getDate() - 1);
      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
    }
    _isOnlyEmojis(text) {
      if (!text) return false;
      const clean = text.trim();
      if (clean.length > 8) return false;
      const emojiRegex = /^(?:[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\u{FE0F})+$/u;
      return emojiRegex.test(clean);
    }
  };

  // js/services/friend.js
  var FriendService = class {
    _getFriendships() {
      return storage.get("friendships") || [];
    }
    _saveFriendships(list) {
      storage.set("friendships", list);
    }
    _resolveId(id) {
      const current = auth.getCurrentUser();
      if (id === "CURRENT_USER" && current) return current.userId;
      return id;
    }
    getFriendshipStatus(targetUserId) {
      const current = auth.getCurrentUser();
      if (!current || !targetUserId) return "none";
      if (current.userId === targetUserId) return "self";
      const list = this._getFriendships();
      const match = list.find(
        (f2) => this._resolveId(f2.user1) === current.userId && this._resolveId(f2.user2) === targetUserId || this._resolveId(f2.user2) === current.userId && this._resolveId(f2.user1) === targetUserId
      );
      if (!match) return "none";
      if (match.status === "accepted") return "friends";
      if (match.status === "pending") {
        return this._resolveId(f.user1) === current.userId ? "request_sent" : "request_received";
      }
      return "none";
    }
    sendFriendRequest(targetUserId) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      if (current.userId === targetUserId) throw new Error("You cannot add yourself as a friend.");
      const list = this._getFriendships();
      const existing = list.find(
        (f2) => this._resolveId(f2.user1) === current.userId && this._resolveId(f2.user2) === targetUserId || this._resolveId(f2.user2) === current.userId && this._resolveId(f2.user1) === targetUserId
      );
      if (existing) {
        if (existing.status === "accepted") throw new Error("You are already friends.");
        if (existing.status === "pending") throw new Error("A request is already pending.");
      }
      const newRequest = {
        id: "fr-" + Date.now(),
        user1: current.userId,
        user2: targetUserId,
        status: "pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      list.push(newRequest);
      this._saveFriendships(list);
      return newRequest;
    }
    acceptFriendRequest(requestId) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const list = this._getFriendships();
      const request = list.find((f2) => f2.id === requestId);
      if (!request) throw new Error("Friend request not found.");
      request.status = "accepted";
      request.acceptedAt = (/* @__PURE__ */ new Date()).toISOString();
      this._saveFriendships(list);
      return request;
    }
    rejectFriendRequest(requestId) {
      const list = this._getFriendships();
      const filtered = list.filter((f2) => f2.id !== requestId);
      this._saveFriendships(filtered);
      return true;
    }
    cancelSentRequest(targetUserId) {
      const current = auth.getCurrentUser();
      if (!current) return false;
      const list = this._getFriendships();
      const filtered = list.filter((f2) => {
        const match = this._resolveId(f2.user1) === current.userId && this._resolveId(f2.user2) === targetUserId && f2.status === "pending";
        return !match;
      });
      this._saveFriendships(filtered);
      return true;
    }
    removeFriend(friendUserId) {
      const current = auth.getCurrentUser();
      if (!current) return false;
      const list = this._getFriendships();
      const filtered = list.filter((f2) => {
        const isMatch = this._resolveId(f2.user1) === current.userId && this._resolveId(f2.user2) === friendUserId || this._resolveId(f2.user2) === current.userId && this._resolveId(f2.user1) === friendUserId;
        return !isMatch;
      });
      this._saveFriendships(filtered);
      return true;
    }
    getFriendsList() {
      const current = auth.getCurrentUser();
      if (!current) return [];
      const list = this._getFriendships();
      const friendIds = [];
      list.forEach((f2) => {
        if (f2.status === "accepted") {
          const u1 = this._resolveId(f2.user1);
          const u2 = this._resolveId(f2.user2);
          if (u1 === current.userId) friendIds.push(u2);
          else if (u2 === current.userId) friendIds.push(u1);
        }
      });
      return friendIds.map((id) => userService.getUserById(id)).filter(Boolean);
    }
    getIncomingRequests() {
      const current = auth.getCurrentUser();
      if (!current) return [];
      const list = this._getFriendships();
      return list.filter((f2) => f2.status === "pending" && this._resolveId(f2.user2) === current.userId).map((f2) => ({
        requestId: f2.id,
        sender: userService.getUserById(this._resolveId(f2.user1)),
        createdAt: f2.createdAt
      })).filter((item) => item.sender !== null);
    }
    getSentRequests() {
      const current = auth.getCurrentUser();
      if (!current) return [];
      const list = this._getFriendships();
      return list.filter((f2) => f2.status === "pending" && this._resolveId(f2.user1) === current.userId).map((f2) => ({
        requestId: f2.id,
        recipient: userService.getUserById(this._resolveId(f2.user2)),
        createdAt: f2.createdAt
      })).filter((item) => item.recipient !== null);
    }
  };
  var friendService = new FriendService();

  // js/views/friendsView.js
  var FriendsView = class {
    constructor(onOpenConversation) {
      this.onOpenConversation = onOpenConversation;
      this.container = document.getElementById("friends-view");
      this.currentSubTab = "my-friends";
      this._bindEvents();
    }
    render() {
      if (!this.container) return;
      this._renderSubTabs();
      if (this.currentSubTab === "my-friends") this._renderFriendsList();
      else if (this.currentSubTab === "requests") this._renderRequestsList();
      else if (this.currentSubTab === "search") this._renderSearchTab();
    }
    _bindEvents() {
      document.querySelectorAll(".friends-subtab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentSubTab = btn.dataset.subtab;
          this.render();
        });
      });
    }
    _renderSubTabs() {
      const incoming = friendService.getIncomingRequests();
      const reqBadge = document.getElementById("requests-badge-count");
      if (reqBadge) {
        reqBadge.textContent = incoming.length;
        reqBadge.style.display = incoming.length > 0 ? "inline-flex" : "none";
      }
      document.querySelectorAll(".friends-subtab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.subtab === this.currentSubTab);
      });
    }
    _renderFriendsList() {
      const listContainer = document.getElementById("friends-subview-content");
      if (!listContainer) return;
      const friends = friendService.getFriendsList();
      if (friends.length === 0) {
        listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">\u{1F465}</div>
          <div class="empty-state-title">Build Your Circle</div>
          <div class="empty-state-text">Search for users and connect with friends to start chatting!</div>
        </div>
      `;
        return;
      }
      listContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${friends.map((friend) => `
          <div class="glass-panel card-3d" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="avatar-wrap">
                <img src="${friend.profilePicture}" class="avatar-img" alt="${friend.name}" />
                <span class="avatar-status ${friend.onlineStatus === "online" ? "online" : ""}"></span>
              </div>
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 15px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${friend.name}</div>
                <div style="font-size: 12px; color: var(--color-romantic-rose);">@${friend.username} \u2022 <span style="opacity: 0.8;">${friend.userId}</span></div>
              </div>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis;">
              ${friend.bio || "Hey there! I am using You & Me \u{1F680}"}
            </div>
            <div style="display: flex; gap: 8px; margin-top: auto;">
              <button class="btn-3d btn-primary btn-msg-friend" data-user-id="${friend.userId}" style="flex: 1; padding: 8px 12px; font-size: 13px;">
                Message
              </button>
              <button class="btn-3d btn-glass btn-remove-friend" data-user-id="${friend.userId}" data-name="${friend.name}" style="padding: 8px 12px; font-size: 13px; color: var(--color-danger);">
                Remove
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
      listContainer.querySelectorAll(".btn-msg-friend").forEach((btn) => {
        btn.addEventListener("click", () => {
          const conv = chatService.getOrCreateConversation(btn.dataset.userId);
          if (this.onOpenConversation) {
            this.onOpenConversation(conv.conversationId);
          }
        });
      });
      listContainer.querySelectorAll(".btn-remove-friend").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const ok = await modal.confirm({
            title: "Remove Friend?",
            message: `Are you sure you want to remove ${btn.dataset.name} from your friends?`,
            confirmText: "Remove",
            isDanger: true
          });
          if (ok) {
            friendService.removeFriend(btn.dataset.userId);
            toast.info("Friend removed.");
            this.render();
          }
        });
      });
    }
    _renderRequestsList() {
      const listContainer = document.getElementById("friends-subview-content");
      if (!listContainer) return;
      const incoming = friendService.getIncomingRequests();
      const sent = friendService.getSentRequests();
      if (incoming.length === 0 && sent.length === 0) {
        listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">\u{1F48C}</div>
          <div class="empty-state-title">No New Requests</div>
          <div class="empty-state-text">You have no pending friend requests at this time.</div>
        </div>
      `;
        return;
      }
      listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Incoming Section -->
        <div>
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: var(--color-romantic-rose);">
            Incoming Requests (${incoming.length})
          </h4>
          ${incoming.length === 0 ? '<div style="font-size: 13px; color: var(--text-muted);">No incoming requests.</div>' : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px;">
              ${incoming.map((req) => `
                <div class="glass-panel card-3d" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    <img src="${req.sender.profilePicture}" class="avatar-img avatar-sm" alt="" />
                    <div style="overflow: hidden;">
                      <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${req.sender.name}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">@${req.sender.username} \u2022 ${req.sender.userId}</div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    <button class="btn-3d btn-primary btn-accept-req" data-req-id="${req.requestId}" style="padding: 6px 12px; font-size: 12px;">Accept</button>
                    <button class="btn-3d btn-glass btn-reject-req" data-req-id="${req.requestId}" style="padding: 6px 10px; font-size: 12px; color: var(--color-danger);">&times;</button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <!-- Sent Section -->
        <div>
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: var(--text-secondary);">
            Sent Pending Requests (${sent.length})
          </h4>
          ${sent.length === 0 ? '<div style="font-size: 13px; color: var(--text-muted);">No sent pending requests.</div>' : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
              ${sent.map((s) => `
                <div class="glass-panel" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <img src="${s.recipient.profilePicture}" class="avatar-img avatar-sm" alt="" />
                    <div style="overflow: hidden;">
                      <div style="font-weight: 600; font-size: 13.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${s.recipient.name}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">@${s.recipient.username}</div>
                    </div>
                  </div>
                  <button class="btn-3d btn-glass btn-cancel-sent" data-user-id="${s.recipient.userId}" style="padding: 5px 10px; font-size: 11.5px;">Cancel</button>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
      listContainer.querySelectorAll(".btn-accept-req").forEach((btn) => {
        btn.addEventListener("click", () => {
          friendService.acceptFriendRequest(btn.dataset.reqId);
          toast.success("Friend request accepted! \u2728");
          this.render();
        });
      });
      listContainer.querySelectorAll(".btn-reject-req").forEach((btn) => {
        btn.addEventListener("click", () => {
          friendService.rejectFriendRequest(btn.dataset.reqId);
          toast.info("Request declined.");
          this.render();
        });
      });
      listContainer.querySelectorAll(".btn-cancel-sent").forEach((btn) => {
        btn.addEventListener("click", () => {
          friendService.cancelSentRequest(btn.dataset.userId);
          toast.info("Request canceled.");
          this.render();
        });
      });
    }
    _renderSearchTab() {
      const listContainer = document.getElementById("friends-subview-content");
      if (!listContainer) return;
      listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div class="input-with-icon" style="max-width: 500px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="user-global-search-input" placeholder="Search by name, @username, or User ID (e.g. YM-482913)..." autofocus />
        </div>
        <div id="user-search-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
          <!-- Results inserted dynamically -->
        </div>
      </div>
    `;
      const searchInput = document.getElementById("user-global-search-input");
      const resultsContainer = document.getElementById("user-search-results");
      const doSearch = (query) => {
        const results = userService.searchUsers(query);
        if (results.length === 0) {
          resultsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">\u{1F50D}</div>
            <div class="empty-state-title">No Users Found</div>
            <div class="empty-state-text">Try searching with a different name, username or User ID.</div>
          </div>
        `;
          return;
        }
        resultsContainer.innerHTML = results.map((u) => {
          const status = friendService.getFriendshipStatus(u.userId);
          let actionBtn = "";
          if (status === "friends") {
            actionBtn = `<button class="btn-3d btn-glass" disabled style="padding:6px 12px; font-size:12px; opacity:0.7;">Friends \u2713</button>`;
          } else if (status === "request_sent") {
            actionBtn = `<button class="btn-3d btn-glass btn-cancel-search-req" data-user-id="${u.userId}" style="padding:6px 12px; font-size:12px;">Pending (Cancel)</button>`;
          } else if (status === "request_received") {
            actionBtn = `<button class="btn-3d btn-primary btn-respond-search-req" style="padding:6px 12px; font-size:12px;">Respond</button>`;
          } else {
            actionBtn = `<button class="btn-3d btn-primary btn-add-user" data-user-id="${u.userId}" style="padding:6px 12px; font-size:12px;">Add Friend +</button>`;
          }
          return `
          <div class="glass-panel card-3d" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${u.profilePicture}" class="avatar-img" alt="" />
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${u.name}</div>
                <div style="font-size: 12px; color: var(--color-romantic-rose);">@${u.username} \u2022 ${u.userId}</div>
              </div>
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; height: 34px; overflow: hidden; text-overflow: ellipsis;">
              ${u.bio || "Available for conversations \u2728"}
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: auto;">
              ${actionBtn}
            </div>
          </div>
        `;
        }).join("");
        resultsContainer.querySelectorAll(".btn-add-user").forEach((btn) => {
          btn.addEventListener("click", () => {
            try {
              friendService.sendFriendRequest(btn.dataset.userId);
              toast.success("Friend request sent! \u{1F48C}");
              doSearch(searchInput.value);
            } catch (err) {
              toast.error(err.message);
            }
          });
        });
        resultsContainer.querySelectorAll(".btn-cancel-search-req").forEach((btn) => {
          btn.addEventListener("click", () => {
            friendService.cancelSentRequest(btn.dataset.userId);
            toast.info("Request canceled.");
            doSearch(searchInput.value);
          });
        });
      };
      searchInput.addEventListener("input", (e) => doSearch(e.target.value));
      doSearch("");
    }
  };

  // js/views/profileView.js
  var ProfileView = class {
    constructor() {
      this.container = document.getElementById("profile-view");
    }
    render() {
      if (!this.container) return;
      const user = auth.getCurrentUser();
      if (!user) return;
      const friends = friendService.getFriendsList();
      const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(void 0, { month: "long", year: "numeric" }) : "Recently";
      this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div class="glass-panel-elevated card-3d" style="padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
          <div class="avatar-wrap avatar-lg" style="margin-bottom: 4px;">
            <img src="${user.profilePicture}" class="avatar-img" alt="${user.name}" id="profile-display-avatar" />
            <span class="avatar-status online"></span>
          </div>

          <div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${user.name}</h2>
            <div style="font-size: 14px; color: var(--color-romantic-rose); font-weight: 600;">@${user.username}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono); background: rgba(0,0,0,0.2); padding: 3px 10px; border-radius: 8px; display: inline-block;">
              User ID: ${user.userId}
            </div>
          </div>

          <div style="max-width: 440px; font-size: 14.5px; color: var(--text-secondary); line-height: 1.5; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: 16px; border: 1px solid var(--glass-border);">
            "${user.bio || "Hey there! I am using You & Me \u{1F680}"}"
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 360px; margin: 8px 0;">
            <div class="glass-panel" style="padding: 14px; text-align: center;">
              <div style="font-size: 22px; font-weight: 800; color: var(--color-romantic-pink);">${friends.length}</div>
              <div style="font-size: 12px; color: var(--text-muted);">Friends</div>
            </div>
            <div class="glass-panel" style="padding: 14px; text-align: center;">
              <div style="font-size: 16px; font-weight: 700; color: var(--color-primary-light); margin-top: 4px;">${joinDate}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Member Since</div>
            </div>
          </div>

          <button class="btn-3d btn-primary" id="btn-open-edit-profile" style="width: 100%; max-width: 360px; padding: 12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Profile
          </button>
        </div>

        <!-- Creator Signature in Mobile/Desktop View -->
        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Sakcham</span>
            <span class="heart-icon">\u2764\uFE0F</span>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div class="modal-backdrop" id="edit-profile-modal">
        <div class="modal-3d">
          <div class="modal-header">
            <h3 style="font-size: 18px; font-weight: 700;">Edit Profile</h3>
            <button class="modal-close-btn" id="btn-close-edit-modal">&times;</button>
          </div>
          <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div class="input-group">
              <label class="input-label">Full Name</label>
              <input type="text" id="edit-name" value="${user.name}" required />
            </div>
            <div class="input-group">
              <label class="input-label">Status Tag</label>
              <input type="text" id="edit-status" value="${user.status || ""}" placeholder="e.g. Dreaming in 3D \u{1F30C}" />
            </div>
            <div class="input-group">
              <label class="input-label">Bio</label>
              <textarea id="edit-bio" rows="3">${user.bio || ""}</textarea>
            </div>
            <div class="input-group">
              <label class="input-label">Change Profile Picture</label>
              <input type="file" id="edit-avatar-input" accept="image/*" />
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
              <button type="button" class="btn-3d btn-glass" id="btn-cancel-edit">Cancel</button>
              <button type="submit" class="btn-3d btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
      this._bindEvents();
    }
    _bindEvents() {
      const editModal = document.getElementById("edit-profile-modal");
      const openBtn = document.getElementById("btn-open-edit-profile");
      const closeBtn = document.getElementById("btn-close-edit-modal");
      const cancelBtn = document.getElementById("btn-cancel-edit");
      const editForm = document.getElementById("edit-profile-form");
      const avatarInput = document.getElementById("edit-avatar-input");
      let newAvatarData = null;
      if (openBtn && editModal) {
        openBtn.addEventListener("click", () => editModal.classList.add("active"));
      }
      const closeModal = () => {
        if (editModal) editModal.classList.remove("active");
      };
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
      if (avatarInput) {
        avatarInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              newAvatarData = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      if (editForm) {
        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = document.getElementById("edit-name").value.trim();
          const status = document.getElementById("edit-status").value.trim();
          const bio = document.getElementById("edit-bio").value.trim();
          const updates = { name, status, bio };
          if (newAvatarData) updates.profilePicture = newAvatarData;
          auth.updateCurrentUser(updates);
          toast.success("Profile updated successfully! \u2728");
          closeModal();
          this.render();
        });
      }
    }
  };

  // js/views/settingsView.js
  var SettingsView = class {
    constructor(onLogout) {
      this.onLogout = onLogout;
      this.container = document.getElementById("settings-view");
    }
    render() {
      if (!this.container) return;
      const settings = storage.get("settings") || {};
      const isDark = settings.theme !== "light";
      this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">Settings</h2>

        <!-- Appearance Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-rose); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            3D Appearance & Visuals
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Theme Mode</div>
              <div style="font-size: 12px; color: var(--text-muted);">Switch between futuristic Dark 3D and Light 3D</div>
            </div>
            <div style="display: flex; background: rgba(0,0,0,0.25); border-radius: 12px; padding: 4px;">
              <button class="btn-theme-select ${isDark ? "active" : ""}" data-theme="dark" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${isDark ? "#fff" : "var(--text-muted)"}; background: ${isDark ? "var(--color-primary)" : "transparent"};">Dark 3D</button>
              <button class="btn-theme-select ${!isDark ? "active" : ""}" data-theme="light" style="padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: ${!isDark ? "#121426" : "var(--text-muted)"}; background: ${!isDark ? "#fff" : "transparent"};">Light 3D</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 600;">
              <span>3D Parallax & Depth Intensity</span>
              <span id="depth-val-label">${(settings.depthIntensity || 1) * 100}%</span>
            </div>
            <input type="range" id="depth-slider" min="0" max="1.5" step="0.1" value="${settings.depthIntensity || 1}" style="width: 100%; accent-color: var(--color-romantic-pink);" />
          </div>
        </div>

        <!-- Audio & Notifications -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-primary-light); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            Audio & Messages
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Sound Effects</div>
              <div style="font-size: 12px; color: var(--text-muted);">Futuristic synthesized audio chimes</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-sound" ${settings.soundEnabled !== false ? "checked" : ""} />
            </label>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Press Enter to Send</div>
              <div style="font-size: 12px; color: var(--text-muted);">Use Shift + Enter for new lines</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-enter-send" ${settings.enterToSend !== false ? "checked" : ""} />
            </label>
          </div>
        </div>

        <!-- Privacy Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-cyan-accent); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Privacy
          </h3>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Online Status Visibility</div>
              <div style="font-size: 12px; color: var(--text-muted);">Show others when you are active</div>
            </div>
            <label class="remember-label">
              <input type="checkbox" id="toggle-privacy-online" ${settings.privacyOnline !== false ? "checked" : ""} />
            </label>
          </div>
        </div>

        <!-- Danger & Account Actions -->
        <div class="glass-panel" style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; font-size: 14px;">Log Out</div>
            <div style="font-size: 12px; color: var(--text-muted);">Sign out of your active session</div>
          </div>
          <button class="btn-3d btn-danger" id="btn-logout" style="padding: 8px 18px; font-size: 13px;">
            Log Out
          </button>
        </div>

        <!-- Creator Signature in Natural View Scroll -->
        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Sakcham</span>
            <span class="heart-icon">\u2764\uFE0F</span>
          </div>
        </div>
      </div>
    `;
      this._bindEvents();
    }
    _bindEvents() {
      const settings = storage.get("settings") || {};
      document.querySelectorAll(".btn-theme-select").forEach((btn) => {
        btn.addEventListener("click", () => {
          const theme = btn.dataset.theme;
          settings.theme = theme;
          storage.set("settings", settings);
          document.documentElement.setAttribute("data-theme", theme);
          toast.info(`Switched to ${theme === "dark" ? "Dark 3D" : "Light 3D"} theme!`);
          this.render();
        });
      });
      const depthSlider = document.getElementById("depth-slider");
      const depthLabel = document.getElementById("depth-val-label");
      if (depthSlider) {
        depthSlider.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          settings.depthIntensity = val;
          storage.set("settings", settings);
          if (depthLabel) depthLabel.textContent = `${Math.round(val * 100)}%`;
        });
      }
      const soundToggle = document.getElementById("toggle-sound");
      if (soundToggle) {
        soundToggle.addEventListener("change", (e) => {
          settings.soundEnabled = e.target.checked;
          storage.set("settings", settings);
          if (e.target.checked) {
            sound.playNotification();
            toast.success("Sound effects enabled! \u{1F514}");
          } else {
            toast.info("Sound effects muted.");
          }
        });
      }
      const enterToggle = document.getElementById("toggle-enter-send");
      if (enterToggle) {
        enterToggle.addEventListener("change", (e) => {
          settings.enterToSend = e.target.checked;
          storage.set("settings", settings);
        });
      }
      const logoutBtn = document.getElementById("btn-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
          const ok = await modal.confirm({
            title: "Log Out?",
            message: "Are you sure you want to log out of You & Me?",
            confirmText: "Log Out",
            isDanger: true
          });
          if (ok) {
            auth.logout();
            toast.info("Logged out safely.");
            if (this.onLogout) this.onLogout();
          }
        });
      }
    }
  };

  // js/views/notificationsView.js
  var NotificationsView = class {
    constructor(onOpenConversation) {
      this.onOpenConversation = onOpenConversation;
      this.container = document.getElementById("notifications-view");
    }
    render() {
      if (!this.container) return;
      const notifs = notificationService.getNotifications();
      this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h2 style="font-size: 22px; font-weight: 800;">Notifications</h2>
          <div style="display: flex; gap: 8px;">
            <button class="btn-3d btn-glass" id="btn-mark-all-notifs-read" style="padding: 6px 12px; font-size: 12px;">Mark All Read</button>
            <button class="btn-3d btn-glass" id="btn-clear-all-notifs" style="padding: 6px 12px; font-size: 12px; color: var(--color-danger);">Clear</button>
          </div>
        </div>

        ${notifs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">\u{1F514}</div>
            <div class="empty-state-title">All Caught Up!</div>
            <div class="empty-state-text">You have no unread notifications right now.</div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${notifs.map((n) => {
        const timeStr = new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return `
                <div class="glass-panel card-3d" style="padding: 14px 18px; display: flex; align-items: center; gap: 14px; border-left: 4px solid ${n.read ? "transparent" : "var(--color-romantic-pink)"};">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--glass-surface-2); display: flex; align-items: center; justify-content: center; color: var(--color-romantic-rose);">
                    ${n.type === "message" ? "\u{1F4AC}" : n.type === "reaction" ? "\u2764\uFE0F" : "\u{1F48C}"}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="font-weight: 700; font-size: 14px;">${n.title}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${timeStr}</div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        `}

        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Sakcham</span>
            <span class="heart-icon">\u2764\uFE0F</span>
          </div>
        </div>
      </div>
    `;
      this._bindEvents();
    }
    _bindEvents() {
      document.getElementById("btn-mark-all-notifs-read")?.addEventListener("click", () => {
        notificationService.markAllAsRead();
        toast.success("All marked as read.");
        this.render();
      });
      document.getElementById("btn-clear-all-notifs")?.addEventListener("click", () => {
        notificationService.clearAll();
        toast.info("Notifications cleared.");
        this.render();
      });
    }
  };

  // js/app.js
  var App = class {
    constructor() {
      this.currentView = "chats";
      this.bg3D = null;
      this.authView = null;
      this.chatListView = null;
      this.chatView = null;
      this.friendsView = null;
      this.profileView = null;
      this.settingsView = null;
      this.notificationsView = null;
      this.init();
    }
    init() {
      this._applyStoredTheme();
      this.bg3D = new Background3D("bg-canvas");
      this.authView = new AuthView((user) => this._handleAuthSuccess(user));
      this.chatListView = new ChatListView("sidebar-conversations-list", (convId) => this.openConversation(convId));
      this.chatView = new ChatView();
      this.friendsView = new FriendsView((convId) => this.openConversation(convId));
      this.profileView = new ProfileView();
      this.settingsView = new SettingsView(() => this._handleLogout());
      this.notificationsView = new NotificationsView((convId) => this.openConversation(convId));
      this._bindGlobalEvents();
      this._bindRealtimeEvents();
      this._runLoadingSequence();
    }
    _applyStoredTheme() {
      const settings = storage.get("settings") || {};
      const theme = settings.theme || "dark";
      document.documentElement.setAttribute("data-theme", theme);
    }
    _runLoadingSequence() {
      const loadingScreen = document.getElementById("loading-screen");
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.opacity = "0";
          setTimeout(() => {
            loadingScreen.style.display = "none";
            this._checkSessionAndRoute();
          }, 500);
        } else {
          this._checkSessionAndRoute();
        }
      }, 1100);
    }
    _checkSessionAndRoute() {
      if (auth.isAuthenticated()) {
        this._showDashboard();
      } else {
        this._showAuth();
      }
    }
    _showAuth() {
      document.getElementById("app-dashboard").style.display = "none";
      this.authView.show();
    }
    _showDashboard() {
      this.authView.hide();
      const dashboard = document.getElementById("app-dashboard");
      dashboard.style.display = "flex";
      this._updateGreeting();
      this.chatListView.render();
      this.switchView("chats");
    }
    _handleAuthSuccess(user) {
      this._showDashboard();
    }
    _handleLogout() {
      this.chatView.closeConversation();
      this._showAuth();
    }
    _updateGreeting() {
      const user = auth.getCurrentUser();
      if (!user) return;
      const hour = (/* @__PURE__ */ new Date()).getHours();
      let greet = "Good morning";
      let icon = "\u2600\uFE0F";
      if (hour >= 12 && hour < 17) {
        greet = "Good afternoon";
        icon = "\u2600\uFE0F";
      } else if (hour >= 17 && hour < 22) {
        greet = "Good evening";
        icon = "\u{1F319}";
      } else if (hour >= 22 || hour < 5) {
        greet = "Good night";
        icon = "\u2728";
      }
      const banner = document.getElementById("greeting-text");
      if (banner) {
        banner.innerHTML = `${greet}, <span class="greeting-highlight">${user.name.split(" ")[0]}</span> ${icon}`;
      }
    }
    openConversation(convId) {
      this.switchView("chats");
      this.chatListView.setActive(convId);
      this.chatView.openConversation(convId);
    }
    switchView(viewName) {
      this.currentView = viewName;
      document.querySelectorAll(".subview-container").forEach((el) => el.classList.remove("active"));
      document.querySelectorAll(".nav-tab-btn, .mobile-nav-item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === viewName);
      });
      const chatScreen = document.getElementById("chat-screen");
      const sidebarList = document.getElementById("sidebar-conversations-list");
      const sidebarSearch = document.querySelector(".sidebar-search-box");
      if (viewName === "chats") {
        if (chatScreen) chatScreen.style.display = "flex";
        if (sidebarList) sidebarList.style.display = "flex";
        if (sidebarSearch) sidebarSearch.style.display = "block";
        this.chatListView.render();
      } else {
        if (chatScreen) chatScreen.style.display = "none";
        const targetSubview = document.getElementById(`${viewName}-view`);
        if (targetSubview) targetSubview.classList.add("active");
        if (viewName === "friends") this.friendsView.render();
        else if (viewName === "profile") this.profileView.render();
        else if (viewName === "settings") this.settingsView.render();
        else if (viewName === "notifications") this.notificationsView.render();
        this.chatView.closeConversation();
      }
      this._updateBadges();
    }
    _updateBadges() {
      const incomingReqs = friendService.getIncomingRequests();
      document.querySelectorAll(".friends-badge").forEach((b) => {
        b.textContent = incomingReqs.length;
        b.style.display = incomingReqs.length > 0 ? "inline-flex" : "none";
      });
    }
    _bindGlobalEvents() {
      document.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.switchView(btn.dataset.view);
        });
      });
      const searchInput = document.getElementById("sidebar-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.chatListView.render(e.target.value);
        });
      }
      window.addEventListener("ym:notification_added", () => {
        this._updateBadges();
      });
      window.addEventListener("ym:notifications_updated", () => {
        this._updateBadges();
      });
    }
    _bindRealtimeEvents() {
      realtime.on("message:received", ({ conversationId, message }) => {
        this.chatListView.render();
        if (this.chatView.currentConvId === conversationId) {
          this.chatView.renderMessages();
          this.chatView.scrollToBottom();
        }
      });
      realtime.on("typing:start", ({ conversationId, userId, userName }) => {
        this.chatListView.setTyping(conversationId, userName);
        if (this.chatView.currentConvId === conversationId) {
          this.chatView.showTyping(userName);
        }
      });
      realtime.on("typing:stop", ({ conversationId }) => {
        this.chatListView.setTyping(conversationId, null);
        if (this.chatView.currentConvId === conversationId) {
          this.chatView.hideTyping();
        }
      });
      realtime.on("message:status_update", () => {
        if (this.chatView.currentConvId) {
          this.chatView.renderMessages();
        }
      });
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    window.ymApp = new App();
  });
})();
