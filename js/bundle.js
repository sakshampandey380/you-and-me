(() => {
  // js/config.js
  var APP_CONFIG = {
    name: "You & Me",
    tagline: "Connect. Chat. Share. Together.",
    creatorSignature: "Made by Saksham \u2764\uFE0F",
    version: "2.0.0",
    dataVersion: "2.0",
    storagePrefix: "ym_3d_v2_",
    uniqueIdPrefix: "SK-",
    defaultAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238a3ffc'/><stop offset='100%' stop-color='%23ff3366'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23g)'/><circle cx='50' cy='38' r='18' fill='%23ffffff' opacity='0.9'/><path d='M20,84 C20,64 35,58 50,58 C65,58 80,64 80,84 Z' fill='%23ffffff' opacity='0.9'/></svg>"
  };
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
  var APP_DATA_VERSION = "2.0";
  var StorageService = class {
    constructor() {
      this.prefix = APP_CONFIG.storagePrefix;
      this.memoryStore = {};
      this.dataVersion = APP_DATA_VERSION;
      this.init();
    }
    init() {
      this._runDataMigration();
      if (!this.get("app_users")) {
        this.set("app_users", []);
      }
      if (!this.get("app_friendships")) {
        this.set("app_friendships", []);
      }
      if (!this.get("app_friend_requests")) {
        this.set("app_friend_requests", []);
      }
      if (!this.get("app_conversations")) {
        this.set("app_conversations", []);
      }
      if (!this.get("app_notifications")) {
        this.set("app_notifications", []);
      }
      if (!this.get("app_settings")) {
        this.set("app_settings", {
          theme: "dark",
          depthIntensity: 1,
          soundEnabled: true,
          enterToSend: true,
          privacyLastSeen: true,
          privacyOnline: true,
          language: "English"
        });
      }
      if (typeof window !== "undefined") {
        window.addEventListener("storage", (e) => {
          if (e.key) {
            const rawKey = e.key.startsWith(this.prefix) ? e.key.replace(this.prefix, "") : e.key;
            const canonical = this._normalizeKey(rawKey);
            window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: canonical } }));
            if (canonical === "app_users" || canonical === "app_friendships" || canonical === "app_friend_requests") {
              window.dispatchEvent(new CustomEvent("ym:friends_updated"));
            }
          }
        });
      }
      if (typeof BroadcastChannel !== "undefined") {
        try {
          this.broadcastBus = new BroadcastChannel("ym_storage_bus");
          this.broadcastBus.onmessage = (e) => {
            if (e.data && e.data.type === "STORAGE_SET") {
              const { key, value } = e.data;
              const canonical = this._normalizeKey(key);
              this.memoryStore[canonical] = value;
              try {
                if (typeof localStorage !== "undefined") {
                  localStorage.setItem(canonical, JSON.stringify(value));
                }
              } catch (err) {
              }
              window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: canonical } }));
              if (canonical === "app_users" || canonical === "app_friendships" || canonical === "app_friend_requests") {
                window.dispatchEvent(new CustomEvent("ym:friends_updated"));
              }
            }
          };
        } catch (e) {
        }
      }
    }
    _runDataMigration() {
      try {
        if (typeof localStorage === "undefined") return;
        const storedVersion = localStorage.getItem("app_data_version") || localStorage.getItem(this.prefix + "data_version");
        if (storedVersion !== APP_DATA_VERSION) {
          const legacyKeys = [
            "ym_3d_conversations",
            "ym_3d_friendships",
            "ym_3d_notifications",
            "ym_temp_session",
            this.prefix + "active_session",
            this.prefix + "conversations",
            this.prefix + "friendships",
            this.prefix + "notifications",
            this.prefix + "users",
            "active_session",
            "app_current_user"
          ];
          legacyKeys.forEach((k) => {
            try {
              localStorage.removeItem(k);
            } catch (e) {
            }
          });
          localStorage.setItem("app_data_version", APP_DATA_VERSION);
          localStorage.setItem("app_users", JSON.stringify([]));
          localStorage.setItem("app_friendships", JSON.stringify([]));
          localStorage.setItem("app_friend_requests", JSON.stringify([]));
          localStorage.setItem("app_conversations", JSON.stringify([]));
          localStorage.setItem("app_notifications", JSON.stringify([]));
          return;
        }
        const DEMO_USER_IDS = ["YM-482913", "YM-773104", "YM-519280", "YM-628491", "YM-304918"];
        const DEMO_USERNAMES = ["alex", "emma", "arjun", "sophia", "daniel"];
        const rawUsers = localStorage.getItem("app_users") || localStorage.getItem(this.prefix + "users");
        if (rawUsers) {
          try {
            const parsedUsers = JSON.parse(rawUsers);
            if (Array.isArray(parsedUsers)) {
              const cleanUsers = parsedUsers.filter((u) => {
                if (!u) return false;
                const uid = String(u.uid || u.userId || "").toUpperCase();
                const uname = String(u.username || "").toLowerCase();
                if (DEMO_USER_IDS.includes(uid)) return false;
                if (DEMO_USERNAMES.includes(uname)) return false;
                if (String(u.name || "").toLowerCase().startsWith("member (ym-")) return false;
                return true;
              });
              if (cleanUsers.length !== parsedUsers.length) {
                localStorage.setItem("app_users", JSON.stringify(cleanUsers));
              }
            }
          } catch (e) {
          }
        }
      } catch (e) {
        console.warn("[Storage] Migration warning:", e);
      }
    }
    _normalizeKey(key) {
      const map = {
        "users": "app_users",
        "friendships": "app_friendships",
        "friend_requests": "app_friend_requests",
        "conversations": "app_conversations",
        "notifications": "app_notifications",
        "active_session": "app_current_user",
        "current_user": "app_current_user",
        "settings": "app_settings",
        "data_version": "app_data_version"
      };
      return map[key] || key;
    }
    get(key) {
      const canonical = this._normalizeKey(key);
      try {
        if (typeof localStorage !== "undefined") {
          let raw = localStorage.getItem(canonical);
          if (raw === null && this.prefix) {
            raw = localStorage.getItem(this.prefix + key);
          }
          if (raw !== null) {
            const parsed = JSON.parse(raw);
            this.memoryStore[canonical] = parsed;
            return parsed;
          }
        }
      } catch (e) {
        console.warn(`[Storage] Read error for ${key}:`, e);
      }
      return this.memoryStore[canonical] ? JSON.parse(JSON.stringify(this.memoryStore[canonical])) : null;
    }
    set(key, value) {
      const canonical = this._normalizeKey(key);
      this.memoryStore[canonical] = value;
      const serialized = JSON.stringify(value);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(canonical, serialized);
          if (this.prefix && canonical !== key) {
            try {
              localStorage.setItem(this.prefix + key, serialized);
            } catch (e) {
            }
          }
        }
      } catch (e) {
        console.error(`[Storage] Write error for ${key}:`, e);
        if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
          throw new Error("This file is too large to store locally.");
        }
        throw e;
      }
      if (this.broadcastBus) {
        try {
          this.broadcastBus.postMessage({ type: "STORAGE_SET", key: canonical, value });
        } catch (e) {
        }
      }
      return true;
    }
    remove(key) {
      const canonical = this._normalizeKey(key);
      delete this.memoryStore[canonical];
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(canonical);
          if (this.prefix) {
            localStorage.removeItem(this.prefix + key);
          }
        }
      } catch (e) {
      }
      return true;
    }
    // High-level User Database helper methods
    getUsers() {
      return this.get("app_users") || [];
    }
    saveUsers(users) {
      return this.set("app_users", users);
    }
    getCurrentUser() {
      return this.get("app_current_user");
    }
    getUserByUid(uid) {
      if (!uid) return null;
      const clean = String(uid).trim().toUpperCase();
      const cleanDigits = clean.replace(/[^0-9]/g, "");
      const users = this.getUsers();
      return users.find((u) => {
        if (!u) return false;
        const targetUid = String(u.uid || u.userId || "").toUpperCase();
        const targetDigits = targetUid.replace(/[^0-9]/g, "");
        return targetUid === clean || targetUid === "SK-" + clean || targetUid === "YM-" + clean || cleanDigits.length >= 6 && targetDigits === cleanDigits;
      }) || null;
    }
    getFriends(uid) {
      const targetUid = uid || (this.getCurrentUser() ? this.getCurrentUser().uid || this.getCurrentUser().userId : null);
      if (!targetUid) return [];
      const friendships = this.get("app_friendships") || [];
      const friendUids = [];
      friendships.forEach((f) => {
        if (f.status === "accepted") {
          const u1 = f.user1 || f.user1Id;
          const u2 = f.user2 || f.user2Id;
          if (u1 === targetUid) friendUids.push(u2);
          else if (u2 === targetUid) friendUids.push(u1);
        }
      });
      return friendUids.map((id) => this.getUserByUid(id)).filter(Boolean);
    }
    getFriendRequests(uid) {
      const targetUid = uid || (this.getCurrentUser() ? this.getCurrentUser().uid || this.getCurrentUser().userId : null);
      if (!targetUid) return [];
      const requests = this.get("app_friend_requests") || [];
      return requests.filter((r) => (r.to === targetUid || r.receiverId === targetUid) && r.status === "pending");
    }
    clearAll() {
      this.memoryStore = {};
      try {
        if (typeof localStorage !== "undefined") {
          ["app_users", "app_friendships", "app_friend_requests", "app_conversations", "app_notifications", "app_current_user", "app_settings"].forEach((k) => {
            localStorage.removeItem(k);
            localStorage.removeItem(this.prefix + k);
          });
        }
      } catch (e) {
      }
      this.init();
      return true;
    }
  };
  var storage = new StorageService();

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

  // js/services/cloudSync.js
  var CloudSyncService = class {
    constructor() {
      this.isSyncing = false;
      this.lastSyncTime = null;
      this.pollInterval = null;
      this.activeConvId = null;
      this.syncEndpoint = this._resolveSyncEndpoint();
      this.knownIncomingReqIds = /* @__PURE__ */ new Set();
      this.knownAcceptedReqIds = /* @__PURE__ */ new Set();
      this.knownMessageIds = /* @__PURE__ */ new Set();
      this.init();
    }
    _resolveSyncEndpoint() {
      if (APP_CONFIG.cloudSyncUrl) {
        return APP_CONFIG.cloudSyncUrl;
      }
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        if (window.location.origin.includes("vercel.app")) {
          return `${window.location.origin}/api/sync`;
        }
      }
      return "https://you-and-me-zeta.vercel.app/api/sync";
    }
    init() {
      if (typeof window === "undefined") return;
      this._handleUrlConnect();
      this._primeKnownState();
      setTimeout(() => {
        this.syncAll();
        const current = auth.getCurrentUser();
        if (current) {
          this.pushUser(current);
        }
      }, 600);
      window.addEventListener("focus", () => this.syncAll());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.syncAll();
        }
      });
      this.pollInterval = setInterval(() => {
        if (document.visibilityState === "visible") {
          this.syncAll();
        }
      }, 1800);
    }
    _primeKnownState() {
      try {
        const reqs = storage.get("app_friend_requests") || [];
        reqs.forEach((r) => {
          const id = r.id || r.requestId;
          if (id) {
            this.knownIncomingReqIds.add(id);
            if (r.status === "accepted") this.knownAcceptedReqIds.add(id);
          }
        });
        const convs = storage.get("app_conversations") || [];
        convs.forEach((c) => {
          if (c.messages) {
            c.messages.forEach((m) => {
              if (m.id) this.knownMessageIds.add(m.id);
            });
          }
        });
      } catch (e) {
      }
    }
    setActiveConversation(convId) {
      this.activeConvId = convId;
      if (convId) {
        this.syncAll();
      }
    }
    // --------------------------------------------------------------------------
    // MASTER SYNC PULL (Zero-Refresh Real-Time Sync)
    // --------------------------------------------------------------------------
    async syncAll() {
      if (this.isSyncing) return;
      this.isSyncing = true;
      try {
        const current = auth.getCurrentUser();
        const currentUid = current ? String(current.uid || current.userId || "").toUpperCase() : "";
        const endpoint = this._resolveSyncEndpoint();
        const url = new URL(endpoint);
        if (currentUid) url.searchParams.set("uid", currentUid);
        if (this.activeConvId) url.searchParams.set("convId", this.activeConvId);
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;
        let hasFriendChanges = false;
        let hasNotifChanges = false;
        let hasConvChanges = false;
        let messageStatusChanged = false;
        if (Array.isArray(data.users)) {
          this._mergeUsers(data.users);
        }
        if (currentUid) {
          if (Array.isArray(data.friendRequests)) {
            const localReqs = storage.get("app_friend_requests") || [];
            const reqMap = /* @__PURE__ */ new Map();
            localReqs.forEach((r) => {
              const id = r.id || r.requestId;
              if (id) reqMap.set(id, r);
            });
            data.friendRequests.forEach((cr) => {
              const id = cr.id || cr.requestId;
              if (!id) return;
              const existing = reqMap.get(id);
              const isToMe = String(cr.to || cr.receiverId).toUpperCase() === currentUid;
              const isFromMe = String(cr.from || cr.senderId).toUpperCase() === currentUid;
              if (!existing && isToMe && cr.status === "pending" && !this.knownIncomingReqIds.has(id)) {
                this.knownIncomingReqIds.add(id);
                hasFriendChanges = true;
                hasNotifChanges = true;
                try {
                  sound.playNotification();
                  const senderName = cr.sender ? cr.sender.name || cr.sender.displayName : "Someone";
                  toast.info(`New Friend Request from ${senderName}! \u{1F48C}`);
                } catch (e) {
                }
              }
              if (isFromMe && cr.status === "accepted" && (!existing || existing.status !== "accepted") && !this.knownAcceptedReqIds.has(id)) {
                this.knownAcceptedReqIds.add(id);
                hasFriendChanges = true;
                hasNotifChanges = true;
                hasConvChanges = true;
                try {
                  sound.playNotification();
                  const receiverName = cr.receiver ? cr.receiver.name || cr.receiver.displayName : "Your friend";
                  toast.success(`${receiverName} accepted your friend request! \u2728 You can now chat.`);
                } catch (e) {
                }
              }
              if (!existing || existing.status !== cr.status || existing.updatedAt !== cr.updatedAt) {
                reqMap.set(id, cr);
                hasFriendChanges = true;
              }
            });
            if (hasFriendChanges) {
              storage.set("app_friend_requests", Array.from(reqMap.values()));
            }
          }
          if (Array.isArray(data.friendships)) {
            const localFriendships = storage.get("app_friendships") || [];
            const fsMap = /* @__PURE__ */ new Map();
            localFriendships.forEach((f) => fsMap.set(f.id, f));
            data.friendships.forEach((cf) => {
              if (cf && cf.id && !fsMap.has(cf.id)) {
                fsMap.set(cf.id, cf);
                hasFriendChanges = true;
                hasConvChanges = true;
              }
            });
            if (hasFriendChanges) {
              storage.set("app_friendships", Array.from(fsMap.values()));
            }
          }
          if (Array.isArray(data.notifications)) {
            const localNotifs = storage.get("app_notifications") || [];
            const notifMap = /* @__PURE__ */ new Map();
            localNotifs.forEach((n) => notifMap.set(n.id || n.notificationId, n));
            data.notifications.forEach((cn) => {
              const id = cn.id || cn.notificationId;
              if (id && !notifMap.has(id)) {
                notifMap.set(id, cn);
                hasNotifChanges = true;
              }
            });
            if (hasNotifChanges) {
              storage.set("app_notifications", Array.from(notifMap.values()));
            }
          }
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            const convs = storage.get("app_conversations") || [];
            const pendingDeliveredIds = [];
            const pendingReadIds = [];
            data.messages.forEach((cm) => {
              if (!cm || !cm.id || !cm.conversationId) return;
              const isFromOther = String(cm.senderId).toUpperCase() !== currentUid;
              let conv = convs.find((c) => c.conversationId === cm.conversationId);
              if (!conv) {
                conv = {
                  conversationId: cm.conversationId,
                  participants: [currentUid, isFromOther ? cm.senderId : cm.receiverId],
                  createdAt: cm.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
                  unreadCount: 0,
                  messages: []
                };
                convs.unshift(conv);
                hasConvChanges = true;
              }
              conv.messages = conv.messages || [];
              let localMsg = conv.messages.find((m) => m.id === cm.id);
              if (!localMsg) {
                conv.messages.push(cm);
                this.knownMessageIds.add(cm.id);
                hasConvChanges = true;
                if (isFromOther) {
                  pendingDeliveredIds.push(cm.id);
                  if (this.activeConvId === cm.conversationId) {
                    cm.status = "read";
                    pendingReadIds.push(cm.id);
                  } else {
                    cm.status = "delivered";
                    conv.unreadCount = (conv.unreadCount || 0) + 1;
                  }
                  try {
                    sound.playMessageReceived();
                  } catch (e) {
                  }
                  window.dispatchEvent(new CustomEvent("ym:message_received", {
                    detail: { conversationId: cm.conversationId, message: cm }
                  }));
                }
              } else {
                if (localMsg.status !== cm.status) {
                  localMsg.status = cm.status;
                  messageStatusChanged = true;
                  hasConvChanges = true;
                }
                if (isFromOther && this.activeConvId === cm.conversationId && localMsg.status !== "read") {
                  localMsg.status = "read";
                  pendingReadIds.push(cm.id);
                  messageStatusChanged = true;
                  hasConvChanges = true;
                }
              }
            });
            if (hasConvChanges) {
              storage.set("app_conversations", convs);
            }
            if (pendingDeliveredIds.length > 0) {
              this.markMessagesDelivered(pendingDeliveredIds);
            }
            if (pendingReadIds.length > 0) {
              this.markMessagesRead(pendingReadIds, this.activeConvId);
            }
          }
        }
        if (hasFriendChanges) {
          window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        }
        if (hasNotifChanges) {
          window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        }
        if (hasConvChanges || messageStatusChanged) {
          window.dispatchEvent(new CustomEvent("ym:conversations_updated"));
          window.dispatchEvent(new CustomEvent("ym:message_status_update"));
        }
        this.lastSyncTime = Date.now();
      } catch (err) {
        console.warn("[CloudSync] syncAll failed:", err.message);
      } finally {
        this.isSyncing = false;
      }
    }
    // --------------------------------------------------------------------------
    // USER SYNC
    // --------------------------------------------------------------------------
    async pushUser(user) {
      if (!user || !user.uid && !user.userId) return;
      try {
        const endpoint = this._resolveSyncEndpoint();
        const payload = {
          action: "sync_user",
          uid: user.uid || user.userId,
          userId: user.uid || user.userId,
          name: user.name || user.displayName,
          username: user.username,
          email: user.email,
          dob: user.dob || user.birthday || "",
          language: user.language || "English",
          bio: user.bio,
          status: user.status,
          avatar: user.avatar || user.profilePicture || APP_CONFIG.defaultAvatar
        };
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
      }
    }
    _mergeUsers(cloudUsers) {
      if (!cloudUsers || cloudUsers.length === 0) return;
      const localUsers = storage.getUsers();
      let hasChanges = false;
      cloudUsers.forEach((cu) => {
        if (!cu) return;
        const cUid = String(cu.uid || cu.userId || "").toUpperCase();
        const cUser = String(cu.username || "").toLowerCase();
        if (!cUid) return;
        const existingIndex = localUsers.findIndex((lu) => {
          const lUid = String(lu.uid || lu.userId || "").toUpperCase();
          const lUser = String(lu.username || "").toLowerCase();
          return lUid && lUid === cUid || lUser && lUser === cUser;
        });
        if (existingIndex === -1) {
          localUsers.push({
            uid: cUid,
            userId: cUid,
            name: cu.name || "User",
            displayName: cu.displayName || cu.name || "User",
            username: cu.username,
            email: cu.email || "",
            avatar: cu.avatar || cu.profilePicture || APP_CONFIG.defaultAvatar,
            profilePicture: cu.profilePicture || cu.avatar || APP_CONFIG.defaultAvatar,
            dob: cu.dob || cu.birthday || "",
            birthday: cu.birthday || cu.dob || "",
            language: cu.language || "English",
            bio: cu.bio || "Hey there! I am using You & Me \u{1F680}",
            status: cu.status || "Available for conversations \u2728",
            onlineStatus: cu.onlineStatus || "online",
            lastSeen: cu.lastSeen || "Just now"
          });
          hasChanges = true;
        }
      });
      if (hasChanges) {
        storage.saveUsers(localUsers);
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
      }
    }
    // --------------------------------------------------------------------------
    // FRIEND REQUEST ACTIONS (Instant Cloud Push)
    // --------------------------------------------------------------------------
    async sendFriendRequest(request) {
      if (!request) return;
      try {
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_friend_request",
            request
          })
        });
        this.syncAll();
      } catch (e) {
        console.warn("[CloudSync] sendFriendRequest push failed:", e.message);
      }
    }
    async acceptFriendRequest(requestId) {
      if (!requestId) return;
      try {
        const current = auth.getCurrentUser();
        const currentUid = current ? current.uid || current.userId : "";
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "accept_friend_request",
            requestId,
            accepterUid: currentUid
          })
        });
        this.syncAll();
      } catch (e) {
        console.warn("[CloudSync] acceptFriendRequest push failed:", e.message);
      }
    }
    async declineFriendRequest(requestId) {
      if (!requestId) return;
      try {
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "decline_friend_request",
            requestId
          })
        });
        this.syncAll();
      } catch (e) {
        console.warn("[CloudSync] declineFriendRequest push failed:", e.message);
      }
    }
    async cancelFriendRequest(requestId, toUid = null) {
      try {
        const current = auth.getCurrentUser();
        const currentUid = current ? current.uid || current.userId : "";
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cancel_friend_request",
            requestId,
            fromUid: currentUid,
            toUid
          })
        });
        this.syncAll();
      } catch (e) {
        console.warn("[CloudSync] cancelFriendRequest push failed:", e.message);
      }
    }
    // --------------------------------------------------------------------------
    // CHAT MESSAGE ACTIONS (Instant Cloud Push & Delivery Tracking)
    // --------------------------------------------------------------------------
    async sendMessage(message, receiverId) {
      if (!message) return;
      try {
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_message",
            message,
            receiverId
          })
        });
        setTimeout(() => this.syncAll(), 400);
      } catch (e) {
        console.warn("[CloudSync] sendMessage push failed:", e.message);
      }
    }
    async markMessagesDelivered(messageIds) {
      if (!messageIds || messageIds.length === 0) return;
      try {
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mark_delivered",
            messageIds
          })
        });
      } catch (e) {
      }
    }
    async markMessagesRead(messageIds, convId = null) {
      try {
        const current = auth.getCurrentUser();
        const currentUid = current ? current.uid || current.userId : "";
        const endpoint = this._resolveSyncEndpoint();
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mark_read",
            messageIds,
            conversationId: convId,
            readerUid: currentUid
          })
        });
      } catch (e) {
      }
    }
    pullUsers() {
      return this.syncAll();
    }
    _handleUrlConnect() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const targetId = urlParams.get("connect") || urlParams.get("user") || urlParams.get("u");
        if (targetId) {
          setTimeout(async () => {
            await this.syncAll();
            const users = storage.getUsers();
            const cleanId = targetId.toLowerCase().trim();
            const matched = users.find((u) => {
              const uId = String(u.uid || u.userId || "").toLowerCase();
              const uUser = String(u.username || "").toLowerCase();
              return uId === cleanId || uUser === cleanId;
            });
            if (matched) {
              toast.info(`Found user @${matched.username} from connect link! \u2728`);
              if (window.ymApp) {
                window.ymApp.switchView("friends");
                if (window.ymApp.friendsView) {
                  window.ymApp.friendsView.currentSubTab = "search";
                  window.ymApp.friendsView.render(matched.username);
                }
              }
            }
          }, 1200);
        }
      } catch (e) {
      }
    }
    getShareableLink() {
      const user = auth.getCurrentUser();
      if (!user) return null;
      const base = typeof window !== "undefined" && window.location.origin.includes("vercel.app") ? window.location.origin : "https://you-and-me-zeta.vercel.app";
      const uid = user.uid || user.userId;
      return `${base}/?connect=${encodeURIComponent(uid)}`;
    }
  };
  var cloudSync = new CloudSyncService();

  // js/services/auth.js
  var AuthService = class {
    constructor() {
      this.currentUser = null;
      this._loadSession();
    }
    _loadSession() {
      let sessionUserId = null;
      try {
        if (typeof sessionStorage !== "undefined") {
          const temp = sessionStorage.getItem("ym_temp_session");
          if (temp) {
            const parsed = JSON.parse(temp);
            if (parsed && (parsed.uid || parsed.userId)) {
              sessionUserId = parsed.uid || parsed.userId;
            }
          }
        }
      } catch (e) {
      }
      if (!sessionUserId) {
        const active = storage.get("app_current_user");
        if (active && (active.uid || active.userId)) {
          sessionUserId = active.uid || active.userId;
        }
      }
      if (sessionUserId) {
        const user = storage.getUserByUid(sessionUserId);
        if (user) {
          this.currentUser = user;
        }
      }
    }
    generateUserId() {
      const users = storage.getUsers();
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let newId = "";
      let isUnique = false;
      while (!isUnique) {
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newId = `${APP_CONFIG.uniqueIdPrefix}${code}`;
        const exists = users.some((u) => {
          if (!u) return false;
          const existing = String(u.uid || u.userId || "").toUpperCase();
          return existing === newId.toUpperCase();
        });
        if (!exists) {
          isUnique = true;
        }
      }
      return newId;
    }
    registerUser({ name, username, email, password, dob = "", phone = "", language = "English", profilePicture }) {
      const users = storage.getUsers();
      const cleanUsername = String(username || "").trim().toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "");
      const cleanEmail = String(email || "").trim().toLowerCase();
      if (!cleanUsername) {
        throw new Error("Please enter a valid username.");
      }
      if (users.some((u) => String(u.username || "").toLowerCase() === cleanUsername)) {
        throw new Error("Username is already taken. Please choose another.");
      }
      if (users.some((u) => String(u.email || "").toLowerCase() === cleanEmail)) {
        throw new Error("An account with this email already exists.");
      }
      const trimmedName = String(name || "").trim();
      const cleanDob = String(dob || "").trim();
      const cleanPhone = String(phone || "").trim();
      const uid = this.generateUserId();
      const avatar = profilePicture || APP_CONFIG.defaultAvatar;
      const newUser = {
        uid,
        userId: uid,
        // Alias for backward compatibility
        name: trimmedName,
        displayName: trimmedName,
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        dob: cleanDob,
        birthday: cleanDob,
        avatar,
        profilePicture: avatar,
        language: language || "English",
        bio: "Hey there! I am using You & Me \u{1F680}",
        status: "Available for conversations \u2728",
        onlineStatus: "online",
        lastSeen: "Just now",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      users.push(newUser);
      storage.saveUsers(users);
      this._setSession(newUser, true);
      cloudSync.pushUser(newUser);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:user_registered", { detail: newUser }));
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_users" } }));
      }
      return newUser;
    }
    loginUser(identifier, password, rememberMe = true) {
      const users = storage.getUsers();
      const raw = String(identifier || "").trim();
      const cleanLower = raw.toLowerCase();
      const cleanUser = cleanLower.replace(/^@+/, "");
      const cleanDigits = cleanLower.replace(/[^0-9]/g, "");
      const user = users.find((u) => {
        if (!u) return false;
        const uEmail = String(u.email || "").toLowerCase();
        const uUser = String(u.username || "").toLowerCase();
        const uId = String(u.uid || u.userId || "").toLowerCase();
        const uDigits = uId.replace(/[^0-9]/g, "");
        const uPhone = String(u.phone || "").toLowerCase();
        return uEmail === cleanLower || uUser === cleanUser || uId === cleanLower || uId === "sk-" + cleanLower || uId === "ym-" + cleanLower || cleanDigits.length >= 6 && uDigits === cleanDigits || cleanDigits.length >= 6 && uPhone && uPhone.replace(/[^0-9]/g, "") === cleanDigits;
      });
      if (!user) {
        throw new Error("No account found with this username, email or ID.");
      }
      if (user.password !== password) {
        throw new Error("Incorrect password. Please try again.");
      }
      user.onlineStatus = "online";
      user.lastSeen = "Just now";
      storage.saveUsers(users);
      this._setSession(user, rememberMe);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:auth_changed", { detail: user }));
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
      }
      return user;
    }
    _setSession(user, remember = true) {
      this.currentUser = user;
      const sessionPayload = {
        uid: user.uid || user.userId,
        userId: user.uid || user.userId,
        token: "ym_auth_" + Date.now()
      };
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("ym_temp_session", JSON.stringify(sessionPayload));
        }
      } catch (e) {
      }
      if (remember) {
        storage.set("app_current_user", sessionPayload);
      }
    }
    setCurrentUser(user) {
      if (!user) return;
      this._setSession(user, true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:auth_changed", { detail: user }));
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
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
      const users = storage.getUsers();
      const currentUid = this.currentUser.uid || this.currentUser.userId;
      const index = users.findIndex((u) => (u.uid || u.userId) === currentUid);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        this.currentUser = users[index];
        storage.saveUsers(users);
        cloudSync.pushUser(this.currentUser);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ym:profile_updated", { detail: this.currentUser }));
          window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_users" } }));
        }
        return this.currentUser;
      }
      return null;
    }
    logout() {
      if (this.currentUser) {
        const users = storage.getUsers();
        const currentUid = this.currentUser.uid || this.currentUser.userId;
        const user = users.find((u) => (u.uid || u.userId) === currentUid);
        if (user) {
          user.onlineStatus = "offline";
          user.lastSeen = "Just now";
          storage.saveUsers(users);
        }
      }
      this.currentUser = null;
      storage.remove("app_current_user");
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem("ym_temp_session");
        }
      } catch (e) {
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:auth_changed", { detail: null }));
      }
    }
    isAuthenticated() {
      return !!this.getCurrentUser();
    }
  };
  var auth = new AuthService();

  // js/services/notification.js
  var NotificationService = class {
    _getNotifications() {
      return storage.get("app_notifications") || [];
    }
    _saveNotifications(list) {
      storage.set("app_notifications", list);
    }
    _getCurrentUid() {
      const current = auth.getCurrentUser();
      return current ? String(current.uid || current.userId || "") : null;
    }
    getNotifications(targetUserId = null) {
      const currentId = targetUserId ? String(targetUserId) : this._getCurrentUid();
      const list = this._getNotifications();
      const scoped = list.filter((n) => {
        if (!currentId) return false;
        const to = String(n.toUserId || n.recipientUid || "");
        return to.toUpperCase() === currentId.toUpperCase();
      });
      return scoped.sort((a, b) => new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime());
    }
    getUnreadCount(targetUserId = null) {
      const currentId = targetUserId ? String(targetUserId) : this._getCurrentUid();
      if (!currentId) return 0;
      const list = this._getNotifications();
      return list.filter((n) => {
        const to = String(n.toUserId || n.recipientUid || "");
        return to.toUpperCase() === currentId.toUpperCase() && !n.read;
      }).length;
    }
    addNotification({ type, title, message, fromUserId = null, toUserId = null, requestId = null }) {
      if (!toUserId) return null;
      const list = this._getNotifications();
      const notifId = "notif-" + Date.now() + "-" + Math.floor(Math.random() * 1e3);
      const newNotif = {
        id: notifId,
        notificationId: notifId,
        type,
        // 'message' | 'friend_request' | 'friend_accepted' | 'reaction'
        title,
        message,
        fromUserId,
        senderUid: fromUserId,
        toUserId,
        recipientUid: toUserId,
        requestId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        read: false
      };
      list.unshift(newNotif);
      this._saveNotifications(list);
      try {
        sound.playNotification();
      } catch (e) {
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:notification_added", { detail: newNotif }));
        window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_notifications" } }));
      }
      return newNotif;
    }
    removeNotification(notifId) {
      const list = this._getNotifications();
      const filtered = list.filter((n) => n.id !== notifId && n.notificationId !== notifId);
      this._saveNotifications(filtered);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_notifications" } }));
      }
      return true;
    }
    removeNotificationByRequestId(requestId) {
      if (!requestId) return false;
      const list = this._getNotifications();
      const filtered = list.filter((n) => n.requestId !== requestId);
      this._saveNotifications(filtered);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_notifications" } }));
      }
      return true;
    }
    markAllAsRead() {
      const currentId = this._getCurrentUid();
      if (!currentId) return;
      const list = this._getNotifications();
      list.forEach((n) => {
        const to = String(n.toUserId || n.recipientUid || "");
        if (to.toUpperCase() === currentId.toUpperCase()) {
          n.read = true;
        }
      });
      this._saveNotifications(list);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_notifications" } }));
      }
    }
    clearAll() {
      const currentId = this._getCurrentUid();
      if (!currentId) return;
      const list = this._getNotifications();
      const remaining = list.filter((n) => {
        const to = String(n.toUserId || n.recipientUid || "");
        return to.toUpperCase() !== currentId.toUpperCase();
      });
      this._saveNotifications(remaining);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:notifications_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_notifications" } }));
      }
    }
  };
  var notificationService = new NotificationService();

  // js/services/chat.js
  var ChatService = class {
    _getConversations() {
      return storage.get("app_conversations") || [];
    }
    _saveConversations(convs) {
      return storage.set("app_conversations", convs);
    }
    _getCurrentUid() {
      const current = auth.getCurrentUser();
      return current ? String(current.uid || current.userId || "") : null;
    }
    getConversations() {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return [];
      const convs = this._getConversations();
      const me = currentUid.toUpperCase();
      const friendships = storage.get("app_friendships") || [];
      const isFriend = (targetId) => {
        const target = String(targetId).toUpperCase();
        return friendships.some((f) => {
          if (f.status !== "accepted") return false;
          const u1 = String(f.user1 || f.user1Id || "").toUpperCase();
          const u2 = String(f.user2 || f.user2Id || "").toUpperCase();
          return u1 === me && u2 === target || u2 === me && u1 === target;
        });
      };
      return convs.filter((c) => {
        if (!c || !Array.isArray(c.participants)) return false;
        const otherId = c.participants.find((p) => String(p).toUpperCase() !== me);
        if (!otherId) return false;
        return isFriend(otherId);
      }).map((c) => {
        const otherId = c.participants.find((p) => String(p).toUpperCase() !== me);
        const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
        return {
          ...c,
          otherParticipantId: otherId,
          lastMessage: lastMsg
        };
      }).sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.createdAt || 0).getTime();
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    }
    getConversationById(convId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid || !convId) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const me = currentUid.toUpperCase();
      const otherId = conv.participants.find((p) => String(p).toUpperCase() !== me);
      return {
        ...conv,
        otherParticipantId: otherId
      };
    }
    getOrCreateConversation(targetUserId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid) throw new Error("Please log in first.");
      const convs = this._getConversations();
      const me = currentUid.toUpperCase();
      const target = String(targetUserId).toUpperCase();
      let conv = convs.find((c) => {
        if (!c || !Array.isArray(c.participants)) return false;
        const parts = c.participants.map((p) => String(p).toUpperCase());
        return parts.includes(me) && parts.includes(target);
      });
      if (!conv) {
        const sortedUids = [currentUid, String(targetUserId)].sort();
        const stableConvId = `conv-${sortedUids[0]}_${sortedUids[1]}`;
        conv = convs.find((c) => c.conversationId === stableConvId);
        if (!conv) {
          conv = {
            conversationId: stableConvId,
            participants: [currentUid, String(targetUserId)],
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            unreadCount: 0,
            messages: []
          };
          convs.unshift(conv);
          this._saveConversations(convs);
        }
      }
      return {
        ...conv,
        otherParticipantId: String(targetUserId)
      };
    }
    sendMessage(convId, { type = "text", text = "", mediaUrl = null, fileName = null, fileSize = null, replyTo = null }) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const currentUid = current.uid || current.userId;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) throw new Error("Conversation not found.");
      const otherParticipantId = conv.participants.find((p) => String(p).toUpperCase() !== String(currentUid).toUpperCase());
      if (otherParticipantId) {
        const friendships = storage.get("app_friendships") || [];
        const me = String(currentUid).toUpperCase();
        const them = String(otherParticipantId).toUpperCase();
        const isFriend = friendships.some((f) => {
          if (f.status !== "accepted") return false;
          const u1 = String(f.user1 || f.user1Id || "").toUpperCase();
          const u2 = String(f.user2 || f.user2Id || "").toUpperCase();
          return u1 === me && u2 === them || u2 === me && u1 === them;
        });
        if (!isFriend) {
          throw new Error("Chat is locked until your friend request is accepted.");
        }
      }
      const messageId = "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
      const newMsg = {
        id: messageId,
        conversationId: convId,
        senderId: currentUid,
        receiverId: otherParticipantId || null,
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
      try {
        this._saveConversations(convs);
      } catch (err) {
        conv.messages.pop();
        throw new Error("This file is too large to store locally.");
      }
      try {
        sound.playMessageSent();
      } catch (e) {
      }
      if (otherParticipantId) {
        cloudSync.sendMessage(newMsg, otherParticipantId);
      }
      if (otherParticipantId) {
        let previewText = newMsg.text;
        if (type === "image") previewText = "Sent a photo \u{1F4F7}";
        else if (type === "video") previewText = "Sent a video \u{1F3A5}";
        else if (type === "file") previewText = `Sent a file: ${fileName || "document"} \u{1F4CE}`;
        notificationService.addNotification({
          type: "message",
          title: current.displayName || current.name,
          message: previewText || "Sent you a message",
          fromUserId: currentUid,
          toUserId: otherParticipantId
        });
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_conversations" } }));
      }
      return newMsg;
    }
    editMessage(convId, messageId, newText) {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg && String(msg.senderId).toUpperCase() === currentUid.toUpperCase()) {
        msg.text = newText.trim();
        msg.edited = true;
        msg.editedAt = (/* @__PURE__ */ new Date()).toISOString();
        this._saveConversations(convs);
        return msg;
      }
      return null;
    }
    deleteMessage(convId, messageId, mode = "everyone") {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return false;
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
        if (!msg.deletedFor.includes(currentUid)) {
          msg.deletedFor.push(currentUid);
        }
      }
      this._saveConversations(convs);
      return true;
    }
    toggleReaction(convId, messageId, emoji) {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return null;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return null;
      const msg = conv.messages.find((m) => m.id === messageId);
      if (!msg) return null;
      msg.reactions = msg.reactions || [];
      let existingReaction = msg.reactions.find((r) => r.emoji === emoji);
      if (existingReaction) {
        const userIndex = existingReaction.userIds.map((id) => String(id).toUpperCase()).indexOf(currentUid.toUpperCase());
        if (userIndex !== -1) {
          existingReaction.userIds.splice(userIndex, 1);
          if (existingReaction.userIds.length === 0) {
            msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
          }
        } else {
          existingReaction.userIds.push(currentUid);
        }
      } else {
        msg.reactions.push({
          emoji,
          userIds: [currentUid]
        });
      }
      this._saveConversations(convs);
      return msg.reactions;
    }
    markAsRead(convId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return;
      const convs = this._getConversations();
      const conv = convs.find((c) => c.conversationId === convId);
      if (!conv) return;
      conv.unreadCount = 0;
      const me = currentUid.toUpperCase();
      let changed = false;
      const readMsgIds = [];
      conv.messages.forEach((m) => {
        if (String(m.senderId).toUpperCase() !== me && m.status !== "read") {
          m.status = "read";
          readMsgIds.push(m.id);
          changed = true;
        }
      });
      if (changed) {
        this._saveConversations(convs);
        cloudSync.markMessagesRead(readMsgIds, convId);
      }
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

  // js/services/realtime.js
  var RealtimeService = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
      this.activeConversationId = null;
      this._initStorageListeners();
    }
    _initStorageListeners() {
      if (typeof window !== "undefined") {
        window.addEventListener("ym:storage_changed", (e) => {
          if (e.detail && e.detail.key === "app_conversations") {
            this._handleExternalConversationsUpdate();
          }
        });
      }
    }
    _handleExternalConversationsUpdate() {
      if (!this.activeConversationId) return;
      const conv = chatService.getConversationById(this.activeConversationId);
      if (!conv || !conv.messages) return;
      const current = auth.getCurrentUser();
      const currentUid = current ? String(current.uid || current.userId || "").toUpperCase() : "";
      const lastMsg = conv.messages[conv.messages.length - 1];
      if (lastMsg && String(lastMsg.senderId).toUpperCase() !== currentUid) {
        this.emit("message:received", { conversationId: this.activeConversationId, message: lastMsg });
      }
    }
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
    handleUserSentMessage(convId, sentMessage) {
      if (!convId || !sentMessage) return;
      setTimeout(() => {
        sentMessage.status = "delivered";
        this.emit("message:status_update", { messageId: sentMessage.id, status: "delivered" });
      }, 600);
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
      this._createFloatingHearts(24);
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
      const hues = [335, 345, 320, 275, 355];
      const w = this.width || window.innerWidth;
      const h = this.height || window.innerHeight;
      for (let i = 0; i < count; i++) {
        this.floatingHearts.push({
          baseX: Math.random() * w,
          baseY: Math.random() * h,
          baseZ: Math.random() * 380 + 120,
          // 3D spatial depth
          size: Math.random() * 10 + 11,
          // Size 11 to 21
          radiusX: Math.random() * 34 + 18,
          // Omnidirectional drift bounds in X
          radiusY: Math.random() * 30 + 16,
          // Omnidirectional drift bounds in Y
          radiusZ: Math.random() * 42 + 20,
          // Depth oscillation
          speedX: Math.random() * 0.012 + 7e-3,
          speedY: Math.random() * 0.014 + 8e-3,
          speedZ: Math.random() * 9e-3 + 5e-3,
          speedRot: Math.random() * 0.015 + 8e-3,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          phaseZ: Math.random() * Math.PI * 2,
          phaseRot: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.035 + 0.02,
          hue: hues[i % hues.length],
          alpha: Math.random() * 0.35 + 0.45
          // 0.45 to 0.8
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
      for (let h of this.floatingHearts) {
        const currentX = h.baseX + Math.sin(this.time * h.speedX + h.phaseX) * h.radiusX + Math.cos(this.time * (h.speedX * 0.6) + h.phaseY) * (h.radiusX * 0.4);
        const currentY = h.baseY + Math.cos(this.time * h.speedY + h.phaseY) * h.radiusY + Math.sin(this.time * (h.speedY * 0.7) + h.phaseX) * (h.radiusY * 0.35);
        const currentZ = h.baseZ + Math.sin(this.time * h.speedZ + h.phaseZ) * h.radiusZ;
        const depthFactor = 300 / (currentZ || 300);
        const px = currentX + this.mouseX * depthFactor;
        const py = currentY + this.mouseY * depthFactor;
        const pulse = 1 + Math.sin(this.time * h.pulseSpeed + h.phaseX) * 0.15;
        const r = h.size * depthFactor * pulse;
        const rot = Math.sin(this.time * h.speedRot + h.phaseRot) * 0.26;
        const alpha = isLight ? h.alpha * 0.75 : h.alpha;
        this.ctx.save();
        this.ctx.translate(px, py);
        this.ctx.rotate(rot);
        const halo = this.ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.8);
        halo.addColorStop(0, `hsla(${h.hue}, 100%, 70%, ${alpha * 0.55})`);
        halo.addColorStop(0.45, `hsla(${h.hue}, 100%, 60%, ${alpha * 0.2})`);
        halo.addColorStop(1, "transparent");
        this.ctx.fillStyle = halo;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowColor = `hsla(${h.hue}, 100%, 72%, ${alpha})`;
        this.ctx.shadowBlur = r * 1.8;
        const grad = this.ctx.createLinearGradient(0, -r, 0, r);
        grad.addColorStop(0, `hsla(${h.hue}, 100%, 82%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${h.hue}, 100%, 65%, ${alpha * 0.95})`);
        grad.addColorStop(1, `hsla(${h.hue}, 95%, 48%, ${alpha * 0.9})`);
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        const d = r * 0.65;
        this.ctx.moveTo(0, -d * 0.4);
        this.ctx.bezierCurveTo(-d * 0.8, -d * 1.2, -d * 1.6, -d * 0.2, 0, d * 1.25);
        this.ctx.bezierCurveTo(d * 1.6, -d * 0.2, d * 0.8, -d * 1.2, 0, -d * 0.4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        this.ctx.beginPath();
        this.ctx.arc(-d * 0.42, -d * 0.52, d * 0.26, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  };

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
    _generateHeart(randomY = true) {
      const depth = Math.random() * 0.7 + 0.5;
      const w = this.width || window.innerWidth;
      const h = this.height || window.innerHeight;
      return {
        baseX: Math.random() * w,
        baseY: Math.random() * (h * 0.85),
        size: (Math.random() * 12 + 10) * depth,
        radiusX: Math.random() * 32 + 16,
        radiusY: Math.random() * 28 + 14,
        speedX: Math.random() * 0.012 + 6e-3,
        speedY: Math.random() * 0.014 + 7e-3,
        speedRot: Math.random() * 0.016 + 8e-3,
        pulseSpeed: Math.random() * 0.035 + 0.02,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseRot: Math.random() * Math.PI * 2,
        depth,
        alpha: Math.random() * 0.35 + 0.45,
        hue: Math.random() > 0.35 ? 335 + Math.random() * 25 : 275 + Math.random() * 25
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
      for (let f of this.fireflies) {
        f.x += f.speedX + Math.sin(this.time * 2 + f.y) * 0.4;
        f.y += f.speedY + Math.cos(this.time * 2 + f.x) * 0.4;
        if (f.x < 0) f.x = this.width;
        if (f.x > this.width) f.x = 0;
        if (f.y < this.height * 0.3) f.y = this.height * 0.85;
        if (f.y > this.height * 0.9) f.y = this.height * 0.4;
        const alpha = (Math.sin(this.time * 4 + f.x) * 0.4 + 0.6) * f.alpha;
        const glow = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 4);
        glow.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
        glow.addColorStop(0.5, `rgba(255, 105, 180, ${alpha * 0.4})`);
        glow.addColorStop(1, "transparent");
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, f.radius * 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
    _draw3DHearts() {
      for (let h of this.hearts) {
        const currentX = h.baseX + Math.sin(this.time * h.speedX + h.phaseX) * h.radiusX + Math.cos(this.time * (h.speedX * 0.5) + h.phaseY) * (h.radiusX * 0.4);
        const currentY = h.baseY + Math.cos(this.time * h.speedY + h.phaseY) * h.radiusY + Math.sin(this.time * (h.speedY * 0.6) + h.phaseX) * (h.radiusY * 0.35);
        const px = currentX + this.mouseX * h.depth;
        const py = currentY + this.mouseY * h.depth;
        const pulse = 1 + Math.sin(this.time * h.pulseSpeed + h.phaseX) * 0.16;
        const r = h.size * pulse;
        const rot = Math.sin(this.time * h.speedRot + h.phaseRot) * 0.28;
        this._drawSingleHeart(px, py, r, rot, h.alpha * h.depth, h.hue);
      }
    }
    _drawSingleHeart(x, y, size, rotation, alpha, hue) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      const halo = this.ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 2.6);
      halo.addColorStop(0, `hsla(${hue}, 100%, 70%, ${alpha * 0.6})`);
      halo.addColorStop(0.5, `hsla(${hue}, 100%, 60%, ${alpha * 0.2})`);
      halo.addColorStop(1, "transparent");
      this.ctx.fillStyle = halo;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size * 2.6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowColor = `hsla(${hue}, 100%, 72%, ${alpha})`;
      this.ctx.shadowBlur = size * 1.8;
      const grad = this.ctx.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, `hsla(${hue}, 100%, 82%, ${alpha})`);
      grad.addColorStop(0.5, `hsla(${hue}, 100%, 66%, ${alpha * 0.95})`);
      grad.addColorStop(1, `hsla(${hue}, 95%, 48%, ${alpha * 0.9})`);
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      const d = size * 0.65;
      this.ctx.moveTo(0, -d * 0.4);
      this.ctx.bezierCurveTo(-d * 0.8, -d * 1.2, -d * 1.6, -d * 0.2, 0, d * 1.25);
      this.ctx.bezierCurveTo(d * 1.6, -d * 0.2, d * 0.8, -d * 1.2, 0, -d * 0.4);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(-d * 0.42, -d * 0.52, d * 0.26, 0, Math.PI * 2);
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
      const romanticCanvas = document.getElementById("romantic-canvas");
      if (romanticCanvas) {
        romanticCanvas.classList.remove("hidden");
        romanticCanvas.style.display = "block";
      }
      if (this.scene) this.scene.start();
    }
    hide() {
      const authScreen = document.getElementById("auth-screen");
      if (authScreen) authScreen.style.display = "none";
      const romanticCanvas = document.getElementById("romantic-canvas");
      if (romanticCanvas) {
        romanticCanvas.classList.add("hidden");
        romanticCanvas.style.display = "none";
      }
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
              const rawData = evt.target.result;
              const img = new Image();
              img.onload = () => {
                try {
                  const canvas = document.createElement("canvas");
                  const maxDim = 128;
                  let w = img.width;
                  let h = img.height;
                  if (w > h) {
                    if (w > maxDim) {
                      h = Math.round(h * maxDim / w);
                      w = maxDim;
                    }
                  } else {
                    if (h > maxDim) {
                      w = Math.round(w * maxDim / h);
                      h = maxDim;
                    }
                  }
                  canvas.width = w;
                  canvas.height = h;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, w, h);
                  this.uploadedAvatarData = canvas.toDataURL("image/jpeg", 0.82);
                } catch (canvasErr) {
                  this.uploadedAvatarData = rawData;
                }
                const previewImg = document.getElementById("signup-avatar-preview");
                if (previewImg) previewImg.src = this.uploadedAvatarData;
              };
              img.src = rawData;
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
          const dobInput = document.getElementById("signup-dob");
          const dob = dobInput ? dobInput.value : "";
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
              dob,
              profilePicture: this.uploadedAvatarData
            });
            toast.success(`Account created! Your ID is ${user.uid || user.userId} \u{1F389}`);
            this.onAuthSuccess(user);
          } catch (err) {
            toast.error(err.message);
          }
        });
      }
      if (forgotPassBtn) {
        forgotPassBtn.addEventListener("click", (e) => {
          e.preventDefault();
          toast.info("Log in with your registered username, email, or User ID, or click Create Account to sign up!");
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

  // js/services/user.js
  var UserService = class {
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
      const currentUid = current ? current.uid || current.userId : null;
      let users = this.getAllUsers();
      if (options.excludeSelf !== false && currentUid) {
        users = users.filter((u) => (u.uid || u.userId) !== currentUid);
      }
      return users.map((u) => ({
        ...u,
        uid: u.uid || u.userId,
        userId: u.uid || u.userId,
        displayName: u.displayName || u.name,
        isSelf: Boolean(currentUid && (u.uid || u.userId) === currentUid),
        matchType: "all",
        matchReason: currentUid && (u.uid || u.userId) === currentUid ? "Your Profile" : "Registered Member"
      }));
    }
    getSuggestedUsers(limit = 20, includeSelf = false) {
      const current = auth.getCurrentUser();
      const currentUid = current ? current.uid || current.userId : null;
      const users = this.getAllUsers();
      const others = users.filter((u) => !currentUid || (u.uid || u.userId) !== currentUid).map((u) => ({
        ...u,
        uid: u.uid || u.userId,
        userId: u.uid || u.userId,
        displayName: u.displayName || u.name,
        isSelf: false,
        matchType: "suggestion",
        matchReason: "Registered Member"
      }));
      const list = [...others];
      if (includeSelf && currentUid && current) {
        list.push({
          ...current,
          uid: current.uid || current.userId,
          userId: current.uid || current.userId,
          displayName: current.displayName || current.name,
          isSelf: true,
          matchType: "suggestion",
          matchReason: "Your Account"
        });
      }
      if (limit && limit > 0) {
        return list.slice(0, limit);
      }
      return list;
    }
    searchUsers(query, options = {}) {
      const rawQ = String(query || "").trim();
      const shouldExcludeSelf = options.excludeSelf !== false;
      if (!rawQ) {
        if (options.includeSuggestions) {
          return this.getSuggestedUsers(options.limit || 20, !shouldExcludeSelf);
        }
        return [];
      }
      const q = rawQ.toLowerCase();
      const cleanUserQuery = q.replace(/^@+/, "");
      const cleanUserQueryAlphanum = cleanUserQuery.replace(/[^a-z0-9]/g, "");
      const cleanIdQuery = q.replace(/[^a-z0-9]/g, "");
      const queryDigits = q.replace(/[^0-9]/g, "");
      const nameTokens = q.split(/\s+/).filter(Boolean);
      const current = auth.getCurrentUser();
      const currentUid = current ? String(current.uid || current.userId || "").toUpperCase() : null;
      const users = this.getAllUsers();
      const results = [];
      for (const u of users) {
        if (!u) continue;
        const targetUid = String(u.uid || u.userId || "").toUpperCase();
        if (!targetUid) continue;
        const isSelf = Boolean(currentUid && targetUid === currentUid);
        if (shouldExcludeSelf && isSelf) continue;
        const targetRawId = targetUid.toLowerCase();
        const targetCleanId = targetRawId.replace(/[^a-z0-9]/g, "");
        const targetNumId = targetRawId.replace(/[^0-9]/g, "");
        const targetUser = String(u.username || "").toLowerCase();
        const targetUserClean = targetUser.replace(/[^a-z0-9]/g, "");
        const targetName = String(u.displayName || u.name || "").toLowerCase();
        const targetEmail = String(u.email || "").toLowerCase();
        const targetDob = String(u.dob || u.birthday || "").toLowerCase();
        let score = 0;
        let matchType = "";
        let matchReason = "";
        if (cleanIdQuery.length >= 2 || queryDigits.length >= 2) {
          if (targetRawId === q || targetCleanId === cleanIdQuery || queryDigits.length >= 4 && targetNumId === queryDigits) {
            score = 100;
            matchType = "id";
            matchReason = isSelf ? `Your User ID (${targetUid})` : `Exact User ID (${targetUid})`;
          } else if (targetCleanId.startsWith(cleanIdQuery) || queryDigits.length >= 2 && targetNumId.startsWith(queryDigits) || targetRawId.startsWith(q)) {
            score = 85;
            matchType = "id";
            matchReason = `ID starts with ${rawQ}`;
          } else if (targetCleanId.includes(cleanIdQuery) || queryDigits.length >= 3 && targetNumId.includes(queryDigits) || targetRawId.includes(q)) {
            score = 70;
            matchType = "id";
            matchReason = `ID contains ${rawQ}`;
          }
        }
        if (cleanUserQuery.length >= 1) {
          if (targetUser === cleanUserQuery || cleanUserQueryAlphanum.length >= 2 && targetUserClean === cleanUserQueryAlphanum) {
            const userScore = 95;
            if (userScore > score) {
              score = userScore;
              matchType = "username";
              matchReason = isSelf ? `Your Username (@${u.username})` : `Exact @${u.username}`;
            }
          } else if (targetUser.startsWith(cleanUserQuery) || cleanUserQueryAlphanum.length >= 2 && targetUserClean.startsWith(cleanUserQueryAlphanum)) {
            const userScore = 80;
            if (userScore > score) {
              score = userScore;
              matchType = "username";
              matchReason = `@${u.username}`;
            }
          } else if (targetUser.includes(cleanUserQuery) || cleanUserQueryAlphanum.length >= 2 && targetUserClean.includes(cleanUserQueryAlphanum)) {
            const userScore = 65;
            if (userScore > score) {
              score = userScore;
              matchType = "username";
              matchReason = `@${u.username}`;
            }
          }
        }
        if (targetName === q) {
          const nameScore = 92;
          if (nameScore > score) {
            score = nameScore;
            matchType = "name";
            matchReason = isSelf ? "Your Name" : "Exact name match";
          }
        } else if (targetName.startsWith(q)) {
          const nameScore = 78;
          if (nameScore > score) {
            score = nameScore;
            matchType = "name";
            matchReason = "Name starts with";
          }
        } else if (nameTokens.length > 0 && nameTokens.every((tok) => targetName.includes(tok))) {
          const nameScore = 62;
          if (nameScore > score) {
            score = nameScore;
            matchType = "name";
            matchReason = "Name match";
          }
        } else if (targetName.includes(q)) {
          const nameScore = 50;
          if (nameScore > score) {
            score = nameScore;
            matchType = "name";
            matchReason = "Name contains";
          }
        }
        if (targetDob && q.length >= 2) {
          const cleanDobDigits = targetDob.replace(/[^0-9]/g, "");
          const cleanQDigits = q.replace(/[^0-9]/g, "");
          if (targetDob === q) {
            const dobScore = 90;
            if (dobScore > score) {
              score = dobScore;
              matchType = "dob";
              matchReason = `Birthday: ${u.dob || u.birthday}`;
            }
          } else if (targetDob.includes(q)) {
            const dobScore = 75;
            if (dobScore > score) {
              score = dobScore;
              matchType = "dob";
              matchReason = `Birthday matches ${rawQ}`;
            }
          } else if (cleanQDigits.length >= 2 && cleanDobDigits.includes(cleanQDigits)) {
            const dobScore = 68;
            if (dobScore > score) {
              score = dobScore;
              matchType = "dob";
              matchReason = `Birthday (${u.dob || u.birthday})`;
            }
          }
        }
        if (targetEmail) {
          if (targetEmail === q) {
            const emailScore = 80;
            if (emailScore > score) {
              score = emailScore;
              matchType = "email";
              matchReason = `Email (${u.email})`;
            }
          } else if (targetEmail.includes(q) && q.length >= 3) {
            const emailScore = 35;
            if (emailScore > score) {
              score = emailScore;
              matchType = "email";
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
  };
  var userService = new UserService();

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
      const q = filter.toLowerCase().trim();
      if (convs.length === 0 && !q) {
        this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">\u2728</div>
          <div class="empty-state-title">No Chats Yet</div>
          <div class="empty-state-text">Your conversations will appear here. Find friends to start chatting in 3D!</div>
          <button class="btn-3d btn-primary" id="btn-empty-find-friends" style="margin-top: 10px; font-size: 13px; padding: 8px 18px;">
            Find Friends
          </button>
        </div>
      `;
        return;
      }
      this.container.innerHTML = "";
      let renderedCount = 0;
      convs.forEach((conv) => {
        const partner = userService.getUserById(conv.otherParticipantId);
        if (!partner) return;
        if (q) {
          const cleanUserQ = q.replace(/^@+/, "");
          const cleanIdQ = q.replace(/[^a-z0-9]/gi, "");
          const partnerName = (partner.name || "").toLowerCase();
          const partnerUser = (partner.username || "").toLowerCase();
          const partnerRawId = (partner.userId || "").toLowerCase();
          const partnerCleanId = partnerRawId.replace(/[^a-z0-9]/gi, "");
          const partnerNumId = partnerRawId.replace(/^[^\d]+/, "");
          const matchName = partnerName.includes(q);
          const matchUser = cleanUserQ ? partnerUser.includes(cleanUserQ) : false;
          const matchId = cleanIdQ.length >= 2 && (partnerCleanId.includes(cleanIdQ) || partnerNumId.includes(cleanIdQ) || partnerRawId.includes(q));
          if (!matchName && !matchUser && !matchId) {
            return;
          }
        }
        renderedCount++;
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
          <div class="chat-item-sub">
            <span class="chat-item-user">@${partner.username}</span>
            <span class="chat-item-id-pill" title="User ID: ${partner.userId}">${partner.userId}</span>
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
      if (q) {
        const current2 = auth.getCurrentUser();
        const currentUid = current2 ? String(current2.uid || current2.userId || "").toUpperCase() : "";
        const matchedUsers = userService.searchUsers(q, { limit: 10, excludeSelf: true });
        const convPartnerIds = convs.map((c) => String(c.otherParticipantId || "").toUpperCase());
        const otherMatchedUsers = matchedUsers.filter((u) => !convPartnerIds.includes(String(u.uid || u.userId || "").toUpperCase()));
        if (otherMatchedUsers.length > 0) {
          const divider = document.createElement("div");
          divider.style.cssText = "font-size: 11px; font-weight: 700; color: var(--color-romantic-rose); padding: 12px 6px 4px 6px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: space-between;";
          divider.innerHTML = `<span>Registered Users (${otherMatchedUsers.length})</span><span style="font-size: 10px; color: var(--text-muted);">Click to chat</span>`;
          this.container.appendChild(divider);
          otherMatchedUsers.forEach((u) => {
            const isSelf = current2 && current2.userId === u.userId;
            const userItem = document.createElement("div");
            userItem.className = "chat-list-item card-3d";
            const avatar = u.profilePicture || APP_CONFIG.defaultAvatar;
            const isOnline = u.onlineStatus === "online";
            userItem.innerHTML = `
            <div class="avatar-wrap">
              <img src="${avatar}" class="avatar-img" alt="${u.name}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
              <span class="avatar-status ${isOnline ? "online" : ""}"></span>
            </div>
            <div class="chat-item-info">
              <div class="chat-item-header">
                <span class="chat-item-name">${u.name} ${isSelf ? '<span style="font-size: 10px; padding: 1px 6px; border-radius: 6px; background: rgba(0, 230, 118, 0.2); color: var(--color-success);">You</span>' : ""}</span>
              </div>
              <div class="chat-item-sub">
                <span class="chat-item-user">@${u.username}</span>
                <span class="chat-item-id-pill" title="User ID: ${u.userId}">\u{1F194} ${u.userId}</span>
              </div>
            </div>
            <div style="margin-left: auto;">
              ${isSelf ? '<span style="font-size: 11px; color: var(--text-muted);">Profile</span>' : '<button type="button" class="btn-3d btn-primary" style="padding: 5px 12px; font-size: 11.5px;">\u{1F4AC} Chat</button>'}
            </div>
          `;
            userItem.addEventListener("click", () => {
              if (isSelf) {
                if (window.ymApp) window.ymApp.switchView("profile");
                return;
              }
              const conv = chatService.getOrCreateConversation(u.userId);
              if (this.onSelectConversation) {
                this.onSelectConversation(conv.conversationId);
              }
            });
            this.container.appendChild(userItem);
          });
        }
        if (renderedCount === 0 && otherMatchedUsers.length === 0) {
          this.container.innerHTML = `
          <div class="empty-state" style="padding: 24px 14px;">
            <div class="empty-state-icon" style="width: 48px; height: 48px; font-size: 22px;">\u{1F50D}</div>
            <div class="empty-state-title" style="font-size: 15px;">No user found</div>
            <div class="empty-state-text" style="font-size: 12.5px;">
              No registered user found for "<strong>${q}</strong>". Check the spelling of username, name, or User ID.
            </div>
          </div>
        `;
        }
      }
    }
  };

  // js/services/translation.js
  var SUPPORTED_LANGUAGES = [
    { code: "en", name: "English", native: "English", flag: "\u{1F310}" },
    { code: "hi", name: "Hindi", native: "\u0939\u093F\u0928\u094D\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "es", name: "Spanish", native: "Espa\xF1ol", flag: "\u{1F1EA}\u{1F1F8}" },
    { code: "fr", name: "French", native: "Fran\xE7ais", flag: "\u{1F1EB}\u{1F1F7}" },
    { code: "de", name: "German", native: "Deutsch", flag: "\u{1F1E9}\u{1F1EA}" },
    { code: "ja", name: "Japanese", native: "\u65E5\u672C\u8A9E", flag: "\u{1F1EF}\u{1F1F5}" },
    { code: "ko", name: "Korean", native: "\uD55C\uAD6D\uC5B4", flag: "\u{1F1F0}\u{1F1F7}" },
    { code: "ar", name: "Arabic", native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", flag: "\u{1F1F8}\u{1F1E6}" },
    { code: "ru", name: "Russian", native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", flag: "\u{1F1F7}\u{1F1FA}" },
    { code: "pt", name: "Portuguese", native: "Portugu\xEAs", flag: "\u{1F1F5}\u{1F1F9}" },
    { code: "it", name: "Italian", native: "Italiano", flag: "\u{1F1EE}\u{1F1F9}" },
    { code: "zh", name: "Chinese", native: "\u4E2D\u6587", flag: "\u{1F1E8}\u{1F1F3}" },
    { code: "bn", name: "Bengali", native: "\u09AC\u09BE\u0982\u09B2\u09BE", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "mr", name: "Marathi", native: "\u092E\u0930\u093E\u0920\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "te", name: "Telugu", native: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "ta", name: "Tamil", native: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "gu", name: "Gujarati", native: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "ur", name: "Urdu", native: "\u0627\u0631\u062F\u0648", flag: "\u{1F1F5}\u{1F1F0}" },
    { code: "pa", name: "Punjabi", native: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40", flag: "\u{1F1EE}\u{1F1F3}" }
  ];
  var TranslationService = class {
    constructor() {
      this.customEndpoint = null;
      this.cache = /* @__PURE__ */ new Map();
      this._initDictionary();
    }
    _initDictionary() {
      this.phraseMapEnToHi = {
        "hello": "\u0928\u092E\u0938\u094D\u0924\u0947",
        "hi": "\u0928\u092E\u0938\u094D\u0924\u0947",
        "hey": "\u0905\u0930\u0947 \u0938\u0941\u0928\u094B",
        "good morning": "\u0936\u0941\u092D \u092A\u094D\u0930\u092D\u093E\u0924 \u2600\uFE0F",
        "good afternoon": "\u0936\u0941\u092D \u0926\u094B\u092A\u0939\u0930 \u2600\uFE0F",
        "good evening": "\u0936\u0941\u092D \u0938\u0902\u0927\u094D\u092F\u093E \u{1F319}",
        "good night": "\u0936\u0941\u092D \u0930\u093E\u0924\u094D\u0930\u093F \u2728",
        "how are you": "\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?",
        "how are you?": "\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?",
        "how r u": "\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?",
        "how r u?": "\u0906\u092A \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?",
        "i am good": "\u092E\u0948\u0902 \u0920\u0940\u0915 \u0939\u0942\u0901",
        "i am fine": "\u092E\u0948\u0902 \u092C\u093F\u0932\u094D\u0915\u0941\u0932 \u0920\u0940\u0915 \u0939\u0942\u0901",
        "i am doing great": "\u092E\u0948\u0902 \u092C\u0939\u0941\u0924 \u0905\u091A\u094D\u091B\u093E \u0915\u0930 \u0930\u0939\u093E \u0939\u0942\u0901",
        "what are you doing": "\u0906\u092A \u0915\u094D\u092F\u093E \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?",
        "what are you doing?": "\u0906\u092A \u0915\u094D\u092F\u093E \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902?",
        "where are you": "\u0906\u092A \u0915\u0939\u093E\u0901 \u0939\u0948\u0902?",
        "where are you?": "\u0906\u092A \u0915\u0939\u093E\u0901 \u0939\u0948\u0902?",
        "thank you": "\u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u{1F64F}",
        "thanks": "\u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u{1F64F}",
        "thank you so much": "\u092C\u0939\u0941\u0924-\u092C\u0939\u0941\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926 \u{1F64F}",
        "welcome": "\u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948",
        "you are welcome": "\u0915\u094B\u0908 \u092C\u093E\u0924 \u0928\u0939\u0940\u0902, \u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948",
        "yes": "\u0939\u093E\u0901",
        "no": "\u0928\u0939\u0940\u0902",
        "ok": "\u0920\u0940\u0915 \u0939\u0948",
        "okay": "\u0920\u0940\u0915 \u0939\u0948",
        "sure": "\u091C\u093C\u0930\u0942\u0930",
        "of course": "\u092C\u093F\u0932\u094D\u0915\u0941\u0932",
        "please": "\u0915\u0943\u092A\u092F\u093E",
        "sorry": "\u092E\u093E\u092B\u093C \u0915\u0940\u091C\u093F\u090F",
        "bye": "\u0905\u0932\u0935\u093F\u0926\u093E",
        "goodbye": "\u0905\u0932\u0935\u093F\u0926\u093E",
        "see you": "\u092B\u093F\u0930 \u092E\u093F\u0932\u0947\u0902\u0917\u0947",
        "see you soon": "\u091C\u0932\u094D\u0926 \u092E\u093F\u0932\u0947\u0902\u0917\u0947 \u2728",
        "take care": "\u0905\u092A\u0928\u093E \u0916\u094D\u092F\u093E\u0932 \u0930\u0916\u0928\u093E",
        "love you": "\u092A\u094D\u092F\u093E\u0930 \u0915\u0930\u0924\u093E \u0939\u0942\u0901 \u2764\uFE0F",
        "i love you": "\u092E\u0948\u0902 \u0906\u092A\u0938\u0947 \u092A\u094D\u092F\u093E\u0930 \u0915\u0930\u0924\u093E \u0939\u0942\u0901 \u2764\uFE0F",
        "happy birthday": "\u091C\u0928\u094D\u092E\u0926\u093F\u0928 \u092E\u0941\u092C\u093E\u0930\u0915 \u0939\u094B \u{1F382}",
        "congratulations": "\u092C\u0927\u093E\u0908 \u0939\u094B \u{1F389}",
        "awesome": "\u092C\u0939\u0941\u0924 \u092C\u0922\u093C\u093F\u092F\u093E!",
        "nice": "\u0905\u091A\u094D\u091B\u093E \u0939\u0948",
        "great": "\u0936\u093E\u0928\u0926\u093E\u0930",
        "cool": "\u092C\u0939\u0941\u0924 \u0916\u0942\u092C",
        "beautiful": "\u0938\u0941\u0902\u0926\u0930",
        "let's chat": "\u091A\u0932\u094B \u092C\u093E\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902",
        "call me": "\u092E\u0941\u091D\u0947 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902",
        "message me": "\u092E\u0941\u091D\u0947 \u092E\u0948\u0938\u0947\u091C \u0915\u0930\u0947\u0902",
        "are you free": "\u0915\u094D\u092F\u093E \u0906\u092A \u0916\u093E\u0932\u0940 \u0939\u0948\u0902?",
        "are you free?": "\u0915\u094D\u092F\u093E \u0906\u092A \u092B\u094D\u0930\u0940 \u0939\u0948\u0902?",
        "what happened": "\u0915\u094D\u092F\u093E \u0939\u0941\u0906?",
        "what happened?": "\u0915\u094D\u092F\u093E \u0939\u0941\u0906?",
        "all good": "\u0938\u092C \u0920\u0940\u0915 \u0939\u0948",
        "no problem": "\u0915\u094B\u0908 \u092C\u093E\u0924 \u0928\u0939\u0940\u0902",
        "i am happy": "\u092E\u0948\u0902 \u0916\u0941\u0936 \u0939\u0942\u0901",
        "nice to meet you": "\u0906\u092A\u0938\u0947 \u092E\u093F\u0932\u0915\u0930 \u0905\u091A\u094D\u091B\u093E \u0932\u0917\u093E"
      };
      this.phraseMapHiToEn = {};
      Object.entries(this.phraseMapEnToHi).forEach(([en, hi]) => {
        const cleanHi = hi.replace(/[?☀️🌙✨🙏❤️🎂🎉!]/g, "").trim();
        this.phraseMapHiToEn[cleanHi.toLowerCase()] = en;
        this.phraseMapHiToEn[hi.toLowerCase()] = en;
      });
      this.wordsEnToHi = {
        "friend": "\u0926\u094B\u0938\u094D\u0924",
        "friends": "\u0926\u094B\u0938\u094D\u0924",
        "love": "\u092A\u094D\u092F\u093E\u0930",
        "happy": "\u0916\u0941\u0936",
        "today": "\u0906\u091C",
        "tomorrow": "\u0915\u0932",
        "yesterday": "\u0915\u0932",
        "now": "\u0905\u092D\u0940",
        "chat": "\u092C\u093E\u0924\u091A\u0940\u0924",
        "message": "\u0938\u0902\u0926\u0947\u0936",
        "photo": "\u0924\u0938\u094D\u0935\u0940\u0930",
        "image": "\u0924\u0938\u094D\u0935\u0940\u0930",
        "video": "\u0935\u0940\u0921\u093F\u092F\u094B",
        "file": "\u092B\u093C\u093E\u0907\u0932",
        "together": "\u0938\u093E\u0925 \u092E\u0947\u0902",
        "work": "\u0915\u093E\u092E",
        "home": "\u0918\u0930",
        "good": "\u0905\u091A\u094D\u091B\u093E",
        "bad": "\u092C\u0941\u0930\u093E",
        "beautiful": "\u0916\u0942\u092C\u0938\u0942\u0930\u0924",
        "life": "\u091C\u093F\u0902\u0926\u0917\u0940",
        "time": "\u0938\u092E\u092F",
        "day": "\u0926\u093F\u0928",
        "night": "\u0930\u093E\u0924",
        "sun": "\u0938\u0942\u0930\u091C",
        "moon": "\u091A\u093E\u0901\u0926",
        "star": "\u0924\u093E\u0930\u093E",
        "heart": "\u0926\u093F\u0932",
        "music": "\u0938\u0902\u0917\u0940\u0924"
      };
      this.wordsHiToEn = {};
      Object.entries(this.wordsEnToHi).forEach(([en, hi]) => {
        this.wordsHiToEn[hi] = en;
      });
    }
    isHindi(text) {
      if (!text) return false;
      return /[\u0900-\u097F]/.test(text);
    }
    getUserPreferredLanguage() {
      const user = auth.getCurrentUser();
      if (user && user.language) {
        return user.language;
      }
      return "English";
    }
    getLanguageMeta(langNameOrCode) {
      if (!langNameOrCode) return SUPPORTED_LANGUAGES[0];
      const needle = String(langNameOrCode).toLowerCase().trim();
      return SUPPORTED_LANGUAGES.find(
        (l) => l.code.toLowerCase() === needle || l.name.toLowerCase() === needle || l.native.toLowerCase() === needle
      ) || SUPPORTED_LANGUAGES[0];
    }
    async translate(text, targetLang = null) {
      if (!text || typeof text !== "string") {
        return { text: "", isTranslated: false };
      }
      const trimmed = text.trim();
      if (!trimmed) return { text: "", isTranslated: false };
      let target = targetLang;
      if (!target) {
        const preferred = this.getUserPreferredLanguage();
        const isSourceHindi2 = this.isHindi(trimmed);
        target = preferred === "Hindi" || isSourceHindi2 ? isSourceHindi2 ? "English" : "Hindi" : preferred;
      }
      const targetMeta = this.getLanguageMeta(target);
      const targetCode = targetMeta.code;
      const targetName = targetMeta.name;
      const isSourceHindi = this.isHindi(trimmed);
      if (targetCode === "hi" && isSourceHindi) {
        return { text: trimmed, isTranslated: false, targetLang: targetName };
      }
      if (targetCode === "en" && !isSourceHindi && !/[^\x00-\x7F]/.test(trimmed)) {
        return { text: trimmed, isTranslated: false, targetLang: targetName };
      }
      const cacheKey = `${targetCode}:${trimmed}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      try {
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=autodetect|${targetCode}`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.responseData && data.responseData.translatedText) {
            let translated = data.responseData.translatedText;
            translated = translated.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            if (translated && translated.toLowerCase() !== trimmed.toLowerCase()) {
              const result = {
                text: translated,
                originalText: trimmed,
                isTranslated: true,
                targetLang: targetName
              };
              this.cache.set(cacheKey, result);
              return result;
            }
          }
        }
      } catch (e) {
        console.warn("[TranslationService] Live API request failed, trying local fallback:", e);
      }
      const lower = trimmed.toLowerCase();
      if (targetCode === "hi") {
        if (this.phraseMapEnToHi[lower]) {
          const result = {
            text: this.phraseMapEnToHi[lower],
            originalText: trimmed,
            isTranslated: true,
            targetLang: "Hindi"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        const cleanLower = lower.replace(/[!?.,]/g, "").trim();
        if (this.phraseMapEnToHi[cleanLower]) {
          const result = {
            text: this.phraseMapEnToHi[cleanLower],
            originalText: trimmed,
            isTranslated: true,
            targetLang: "Hindi"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        const words = trimmed.split(/(\s+|[.,!?])/);
        let translatedAny = false;
        const translatedWords = words.map((word) => {
          const wLower = word.toLowerCase();
          if (this.wordsEnToHi[wLower]) {
            translatedAny = true;
            return this.wordsEnToHi[wLower];
          }
          return word;
        });
        if (translatedAny) {
          const result = {
            text: translatedWords.join(""),
            originalText: trimmed,
            isTranslated: true,
            targetLang: "Hindi"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        const fallbackResult = {
          text: `[\u0905\u0928\u0941\u0935\u093E\u0926] ${trimmed}`,
          originalText: trimmed,
          isTranslated: true,
          targetLang: "Hindi"
        };
        return fallbackResult;
      } else if (targetCode === "en") {
        if (this.phraseMapHiToEn[lower]) {
          const result = {
            text: this.phraseMapHiToEn[lower],
            originalText: trimmed,
            isTranslated: true,
            targetLang: "English"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        const cleanLower = lower.replace(/[!?.,|।]/g, "").trim();
        if (this.phraseMapHiToEn[cleanLower]) {
          const result = {
            text: this.phraseMapHiToEn[cleanLower],
            originalText: trimmed,
            isTranslated: true,
            targetLang: "English"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        const words = trimmed.split(/(\s+|[.,!?|।])/);
        let translatedAny = false;
        const translatedWords = words.map((word) => {
          if (this.wordsHiToEn[word]) {
            translatedAny = true;
            return this.wordsHiToEn[word];
          }
          return word;
        });
        if (translatedAny) {
          const result = {
            text: translatedWords.join(""),
            originalText: trimmed,
            isTranslated: true,
            targetLang: "English"
          };
          this.cache.set(cacheKey, result);
          return result;
        }
        return {
          text: `[Translated] ${trimmed}`,
          originalText: trimmed,
          isTranslated: true,
          targetLang: "English"
        };
      }
      return {
        text: `[${targetName}] ${trimmed}`,
        originalText: trimmed,
        isTranslated: true,
        targetLang: targetName
      };
    }
  };
  var translationService = new TranslationService();

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

  // js/services/friend.js
  var FriendService = class {
    _getFriendships() {
      return storage.get("app_friendships") || [];
    }
    _saveFriendships(list) {
      storage.set("app_friendships", list);
    }
    _getRequests() {
      return storage.get("app_friend_requests") || [];
    }
    _saveRequests(list) {
      storage.set("app_friend_requests", list);
    }
    _getCurrentUid() {
      const current = auth.getCurrentUser();
      return current ? current.uid || current.userId : null;
    }
    getFriendshipStatus(targetUserId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid || !targetUserId) return "none";
      if (currentUid.toUpperCase() === String(targetUserId).toUpperCase()) return "self";
      const friendships = this._getFriendships();
      const isFriend = friendships.some((f) => {
        if (f.status !== "accepted") return false;
        const u1 = String(f.user1 || f.user1Id || "").toUpperCase();
        const u2 = String(f.user2 || f.user2Id || "").toUpperCase();
        const target2 = String(targetUserId).toUpperCase();
        const me2 = currentUid.toUpperCase();
        return u1 === me2 && u2 === target2 || u2 === me2 && u1 === target2;
      });
      if (isFriend) return "friends";
      const requests = this._getRequests();
      const target = String(targetUserId).toUpperCase();
      const me = currentUid.toUpperCase();
      const req = requests.find((r) => {
        if (r.status !== "pending") return false;
        const from = String(r.from || r.senderId || "").toUpperCase();
        const to = String(r.to || r.receiverId || "").toUpperCase();
        return from === me && to === target || from === target && to === me;
      });
      if (req) {
        const from = String(req.from || req.senderId || "").toUpperCase();
        return from === me ? "request_sent" : "request_received";
      }
      return "none";
    }
    sendFriendRequest(targetUserId) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const currentUid = current.uid || current.userId;
      if (String(currentUid).toUpperCase() === String(targetUserId).toUpperCase()) {
        throw new Error("You cannot add yourself as a friend.");
      }
      const targetUser = userService.getUserById(targetUserId);
      if (!targetUser) throw new Error("User not found.");
      const status = this.getFriendshipStatus(targetUserId);
      if (status === "friends") throw new Error("You are already friends.");
      if (status === "request_sent") throw new Error("A request has already been sent.");
      if (status === "request_received") {
        const requests2 = this._getRequests();
        const incoming = requests2.find(
          (r) => String(r.from || r.senderId || "").toUpperCase() === String(targetUserId).toUpperCase() && String(r.to || r.receiverId || "").toUpperCase() === String(currentUid).toUpperCase()
        );
        if (incoming) {
          return this.acceptFriendRequest(incoming.id || incoming.requestId);
        }
      }
      const requests = this._getRequests();
      const reqId = "fr-" + Date.now() + "-" + Math.floor(Math.random() * 1e3);
      const targetUid = targetUser.uid || targetUser.userId;
      const newRequest = {
        id: reqId,
        requestId: reqId,
        from: currentUid,
        to: targetUid,
        senderId: currentUid,
        receiverId: targetUid,
        sender: {
          uid: currentUid,
          userId: currentUid,
          name: current.name || current.displayName,
          displayName: current.displayName || current.name,
          username: current.username,
          avatar: current.avatar || current.profilePicture
        },
        receiver: {
          uid: targetUid,
          userId: targetUid,
          name: targetUser.name || targetUser.displayName,
          displayName: targetUser.displayName || targetUser.name,
          username: targetUser.username,
          avatar: targetUser.avatar || targetUser.profilePicture
        },
        status: "pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      requests.push(newRequest);
      this._saveRequests(requests);
      cloudSync.sendFriendRequest(newRequest);
      notificationService.addNotification({
        type: "friend_request",
        title: "New Friend Request \u{1F48C}",
        message: `${current.displayName || current.name} (@${current.username}) sent you a friend request.`,
        fromUserId: currentUid,
        toUserId: targetUid,
        requestId: reqId
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_friend_requests" } }));
      }
      return newRequest;
    }
    acceptFriendRequest(requestId) {
      const current = auth.getCurrentUser();
      if (!current) throw new Error("Please log in first.");
      const currentUid = current.uid || current.userId;
      const requests = this._getRequests();
      const reqIndex = requests.findIndex((r) => r.id === requestId || r.requestId === requestId);
      if (reqIndex === -1) {
        throw new Error("Friend request not found.");
      }
      const request = requests[reqIndex];
      const senderId = request.from || request.senderId;
      const receiverId = request.to || request.receiverId;
      const otherUserId = String(senderId).toUpperCase() === String(currentUid).toUpperCase() ? receiverId : senderId;
      requests.splice(reqIndex, 1);
      this._saveRequests(requests);
      const friendships = this._getFriendships();
      const exists = friendships.some((f) => {
        const u1 = String(f.user1 || f.user1Id || "").toUpperCase();
        const u2 = String(f.user2 || f.user2Id || "").toUpperCase();
        const me = String(currentUid).toUpperCase();
        const them = String(otherUserId).toUpperCase();
        return u1 === me && u2 === them || u2 === me && u1 === them;
      });
      let newFriendship = null;
      if (!exists) {
        newFriendship = {
          id: "fs-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
          user1: currentUid,
          user2: otherUserId,
          user1Id: currentUid,
          user2Id: otherUserId,
          status: "accepted",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        friendships.push(newFriendship);
        this._saveFriendships(friendships);
      }
      notificationService.removeNotificationByRequestId(requestId);
      notificationService.addNotification({
        type: "friend_accepted",
        title: "Friend Request Accepted! \u2728",
        message: `${current.displayName || current.name} accepted your friend request! You can now chat in 3D.`,
        fromUserId: currentUid,
        toUserId: otherUserId,
        requestId
      });
      const conv = chatService.getOrCreateConversation(otherUserId);
      cloudSync.acceptFriendRequest(requestId);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:conversation_unlocked", { detail: { conversationId: conv.conversationId, partnerId: otherUserId } }));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_friendships" } }));
      }
      return { success: true, conversation: conv };
    }
    rejectFriendRequest(requestId) {
      const requests = this._getRequests();
      const filtered = requests.filter((r) => r.id !== requestId && r.requestId !== requestId);
      this._saveRequests(filtered);
      notificationService.removeNotificationByRequestId(requestId);
      cloudSync.declineFriendRequest(requestId);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_friend_requests" } }));
      }
      return true;
    }
    cancelSentRequest(targetUserId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid || !targetUserId) return false;
      const requests = this._getRequests();
      let canceledReqId = null;
      const me = String(currentUid).toUpperCase();
      const target = String(targetUserId).toUpperCase();
      const filtered = requests.filter((r) => {
        const from = String(r.from || r.senderId || "").toUpperCase();
        const to = String(r.to || r.receiverId || "").toUpperCase();
        const match = from === me && to === target && r.status === "pending";
        if (match) canceledReqId = r.id || r.requestId;
        return !match;
      });
      this._saveRequests(filtered);
      if (canceledReqId) {
        notificationService.removeNotificationByRequestId(canceledReqId);
        cloudSync.cancelFriendRequest(canceledReqId, targetUserId);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_friend_requests" } }));
      }
      return true;
    }
    removeFriend(friendUserId) {
      const currentUid = this._getCurrentUid();
      if (!currentUid || !friendUserId) return false;
      const friendships = this._getFriendships();
      const me = String(currentUid).toUpperCase();
      const target = String(friendUserId).toUpperCase();
      const filtered = friendships.filter((f) => {
        const u1 = String(f.user1 || f.user1Id || "").toUpperCase();
        const u2 = String(f.user2 || f.user2Id || "").toUpperCase();
        return !(u1 === me && u2 === target || u2 === me && u1 === target);
      });
      this._saveFriendships(filtered);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ym:friends_updated"));
        window.dispatchEvent(new CustomEvent("ym:storage_changed", { detail: { key: "app_friendships" } }));
      }
      return true;
    }
    getFriendsList() {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return [];
      const friendships = this._getFriendships();
      const me = String(currentUid).toUpperCase();
      const friendUids = [];
      friendships.forEach((f) => {
        if (f.status === "accepted") {
          const u1 = String(f.user1 || f.user1Id || "");
          const u2 = String(f.user2 || f.user2Id || "");
          if (u1.toUpperCase() === me && u2) friendUids.push(u2);
          else if (u2.toUpperCase() === me && u1) friendUids.push(u1);
        }
      });
      return friendUids.map((id) => userService.getUserById(id)).filter(Boolean);
    }
    getIncomingRequests() {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return [];
      const requests = this._getRequests();
      const me = String(currentUid).toUpperCase();
      return requests.filter((r) => r.status === "pending" && String(r.to || r.receiverId || "").toUpperCase() === me).map((r) => ({
        requestId: r.id || r.requestId,
        sender: userService.getUserById(r.from || r.senderId),
        createdAt: r.createdAt
      })).filter((item) => item.sender !== null);
    }
    getSentRequests() {
      const currentUid = this._getCurrentUid();
      if (!currentUid) return [];
      const requests = this._getRequests();
      const me = String(currentUid).toUpperCase();
      return requests.filter((r) => r.status === "pending" && String(r.from || r.senderId || "").toUpperCase() === me).map((r) => ({
        requestId: r.id || r.requestId,
        recipient: userService.getUserById(r.to || r.receiverId),
        createdAt: r.createdAt
      })).filter((item) => item.recipient !== null);
    }
  };
  var friendService = new FriendService();

  // js/views/chatView.js
  var ChatView = class {
    constructor() {
      this.currentConvId = null;
      this.replyTargetMessage = null;
      this.activeContextMenu = null;
      this.emojiPicker = null;
      this.translatedMessages = /* @__PURE__ */ new Map();
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
      cloudSync.setActiveConversation(convId);
      realtime.setActiveConversation(convId);
      chatService.markAsRead(convId);
      const conv = chatService.getConversationById(convId);
      if (!conv) return;
      const partner = userService.getUserById(conv.otherParticipantId);
      if (!partner) return;
      const avatarEl = document.getElementById("chat-header-avatar");
      if (avatarEl) avatarEl.src = partner.profilePicture || partner.avatar;
      const nameEl = document.getElementById("chat-header-name");
      if (nameEl) nameEl.textContent = partner.name;
      const statusEl = document.getElementById("chat-header-status");
      if (statusEl) {
        statusEl.textContent = partner.onlineStatus === "online" ? "Online" : `Last seen ${partner.lastSeen || "recently"}`;
        statusEl.className = `chat-header-status ${partner.onlineStatus === "online" ? "online" : ""}`;
      }
      const isFriend = friendService.getFriendshipStatus(partner.uid || partner.userId) === "friends";
      const composerArea = document.querySelector(".chat-composer-area");
      let lockedNotice = document.getElementById("chat-locked-notice");
      if (!isFriend) {
        if (!lockedNotice && composerArea) {
          lockedNotice = document.createElement("div");
          lockedNotice.id = "chat-locked-notice";
          lockedNotice.style.cssText = "background: rgba(255, 51, 102, 0.12); border: 1px solid rgba(255, 51, 102, 0.3); border-radius: 12px; padding: 12px 16px; margin: 8px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; z-index: 5;";
          lockedNotice.innerHTML = `
          <div style="font-size: 13px; color: var(--color-romantic-rose); display: flex; align-items: center; gap: 8px;">
            <span>\u{1F512}</span>
            <span>Chat is locked until <strong>@${partner.username}</strong> accepts your friend request.</span>
          </div>
          <button type="button" class="btn-3d btn-primary btn-goto-requests-locked" style="font-size: 11.5px; padding: 5px 12px;">View Requests</button>
        `;
          composerArea.parentElement.insertBefore(lockedNotice, composerArea);
          lockedNotice.querySelector(".btn-goto-requests-locked")?.addEventListener("click", () => {
            if (window.ymApp) {
              window.ymApp.switchView("friends");
              if (window.ymApp.friendsView) {
                window.ymApp.friendsView.currentSubTab = "requests";
                window.ymApp.friendsView.render();
              }
            }
          });
        }
        if (composerArea) composerArea.style.opacity = "0.4";
        if (this.composerTextarea) {
          this.composerTextarea.disabled = true;
          this.composerTextarea.placeholder = "Chat locked until friend request is accepted...";
        }
        const sendBtn = document.getElementById("composer-send-btn");
        if (sendBtn) sendBtn.style.pointerEvents = "none";
      } else {
        if (lockedNotice) lockedNotice.remove();
        if (composerArea) composerArea.style.opacity = "1";
        if (this.composerTextarea) {
          this.composerTextarea.disabled = false;
          this.composerTextarea.placeholder = "Type a message...";
        }
        const sendBtn = document.getElementById("composer-send-btn");
        if (sendBtn) sendBtn.style.pointerEvents = "auto";
      }
      this.cancelReply();
      this.closeSearch();
      this.renderMessages();
      document.querySelector(".app-sidebar")?.classList.add("chat-open");
      document.querySelector(".app-main-view")?.classList.add("chat-open");
      document.querySelector(".app-dashboard")?.classList.add("in-chat");
      this.scrollToBottom();
    }
    closeSearch() {
      if (this.searchBar) {
        this.searchBar.classList.remove("active");
        this.searchBar.style.display = "none";
      }
      const searchInput = document.getElementById("chat-search-input");
      if (searchInput) {
        searchInput.value = "";
      }
    }
    toggleSearch() {
      if (!this.searchBar) return;
      const isVisible = this.searchBar.classList.contains("active") || this.searchBar.style.display === "flex";
      const searchInput = document.getElementById("chat-search-input");
      if (isVisible) {
        this.closeSearch();
        this.renderMessages("");
      } else {
        this.searchBar.classList.add("active");
        this.searchBar.style.display = "flex";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
      }
    }
    closeConversation() {
      this.currentConvId = null;
      cloudSync.setActiveConversation(null);
      realtime.setActiveConversation(null);
      const lockedNotice = document.getElementById("chat-locked-notice");
      if (lockedNotice) lockedNotice.remove();
      const composerArea = document.querySelector(".chat-composer-area");
      if (composerArea) composerArea.style.opacity = "1";
      if (this.composerTextarea) {
        this.composerTextarea.disabled = false;
        this.composerTextarea.placeholder = "Type a message...";
      }
      const sendBtn = document.getElementById("composer-send-btn");
      if (sendBtn) sendBtn.style.pointerEvents = "auto";
      document.querySelector(".app-sidebar")?.classList.remove("chat-open");
      document.querySelector(".app-main-view")?.classList.remove("chat-open");
      document.querySelector(".app-dashboard")?.classList.remove("in-chat");
      const chatScreen = document.getElementById("chat-screen");
      const welcomePlaceholder = document.getElementById("chat-welcome-placeholder");
      if (chatScreen) chatScreen.style.display = "none";
      if (welcomePlaceholder && window.ymApp && window.ymApp.currentView === "chats") {
        welcomePlaceholder.style.display = "flex";
      }
    }
    renderMessages(searchQuery = "") {
      if (!this.messagesContainer || !this.currentConvId) return;
      const conv = chatService.getConversationById(this.currentConvId);
      if (!conv) return;
      const current = auth.getCurrentUser();
      const currentUid = current ? String(current.uid || current.userId || "").toUpperCase() : "";
      this.messagesContainer.innerHTML = "";
      let lastSenderId = null;
      let lastDateStr = null;
      conv.messages.forEach((msg) => {
        if (msg.deletedFor && msg.deletedFor.map((id) => String(id).toUpperCase()).includes(currentUid)) {
          return;
        }
        if (searchQuery) {
          const textToMatch = String(msg.text || "").toLowerCase();
          const fileNameToMatch = String(msg.fileName || "").toLowerCase();
          const q = searchQuery.toLowerCase();
          if (!textToMatch.includes(q) && !fileNameToMatch.includes(q)) {
            return;
          }
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
        const isOutgoing = String(msg.senderId).toUpperCase() === currentUid;
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
            <div class="quoted-text">${this._escapeHtml(msg.replyTo.text)}</div>
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
          ${msg.text ? `<div style="margin-top:6px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ""}
        `;
        } else if (msg.type === "video") {
          contentHtml += `
          <div class="message-video-wrap">
            <video src="${msg.mediaUrl}" controls style="max-width: 100%; border-radius: 12px;"></video>
          </div>
          ${msg.text ? `<div style="margin-top:6px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ""}
        `;
        } else if (msg.type === "file") {
          contentHtml += `
          <a href="${msg.mediaUrl}" download="${msg.fileName || "file"}" class="message-file-wrap" style="color:inherit; text-decoration:none;">
            <div class="message-file-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div class="message-file-details">
              <div class="message-file-name">${this._escapeHtml(msg.fileName || "Document")}</div>
              <div class="message-file-size">${this._escapeHtml(msg.fileSize || "File")}</div>
            </div>
          </a>
          ${msg.text ? `<div style="margin-top:4px;">${this._formatFormattedText(msg.text, searchQuery)}</div>` : ""}
        `;
        } else {
          const isEmojiOnly = this._isOnlyEmojis(msg.text);
          if (isEmojiOnly) {
            row.classList.add("emoji-row");
            contentHtml += `<div class="message-bubble emoji-only">${msg.text}</div>`;
          } else {
            const translation = this.translatedMessages.get(msg.id);
            const activeText = translation ? translation.text : msg.text;
            const formatted = this._formatFormattedText(activeText, searchQuery);
            contentHtml += `<div>${formatted}</div>`;
            if (translation) {
              contentHtml += `
              <div class="translation-toggle-bar" data-msg-id="${msg.id}" style="font-size: 11px; color: var(--color-cyan-accent); margin-top: 5px; cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none;">
                <span>\u{1F310} Translated to ${translation.targetLang}</span>
                <span style="opacity: 0.8; text-decoration: underline;">(Show Original)</span>
              </div>
            `;
            } else if (!isOutgoing && msg.text && msg.text.length > 1) {
              contentHtml += `
              <div class="quick-translate-btn" data-msg-id="${msg.id}" style="font-size: 10.5px; opacity: 0.6; margin-top: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; user-select: none;">
                <span>\u{1F310} Translate</span>
              </div>
            `;
            }
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
            const isReactedByMe = r.userIds.map((id) => String(id).toUpperCase()).includes(currentUid);
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
              targetRow.classList.add("highlight-pulse");
              setTimeout(() => targetRow.classList.remove("highlight-pulse"), 1200);
            }
          });
        }
        const quickTransBtn = row.querySelector(".quick-translate-btn");
        if (quickTransBtn) {
          quickTransBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.translateMessage(msg.id, msg.text);
          });
        }
        const transToggleBar = row.querySelector(".translation-toggle-bar");
        if (transToggleBar) {
          transToggleBar.addEventListener("click", (e) => {
            e.stopPropagation();
            this.translatedMessages.delete(msg.id);
            this.renderMessages(searchQuery);
          });
        }
        const bubble = row.querySelector(".message-bubble");
        if (bubble) {
          bubble.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this._showContextMenu(e, msg, isOutgoing);
          });
          let pressTimer;
          bubble.addEventListener("touchstart", (e) => {
            pressTimer = setTimeout(() => {
              const touch = e.touches[0];
              this._showContextMenu({ clientX: touch.clientX, clientY: touch.clientY }, msg, isOutgoing);
            }, 500);
          }, { passive: true });
          bubble.addEventListener("touchend", () => clearTimeout(pressTimer));
          bubble.addEventListener("touchmove", () => clearTimeout(pressTimer));
        }
        this.messagesContainer.appendChild(row);
      });
      if (searchQuery && this.messagesContainer.children.length === 0) {
        this.messagesContainer.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px;">
          <div class="empty-state-icon">\u{1F50D}</div>
          <div class="empty-state-title">No messages found</div>
          <div class="empty-state-text">No messages matching "<strong>${this._escapeHtml(searchQuery)}</strong>" in this chat.</div>
        </div>
      `;
      }
    }
    async translateMessage(msgId, text) {
      if (!msgId || !text) return;
      try {
        const userLang = translationService.getUserPreferredLanguage();
        const targetLang = userLang || "English";
        const result = await translationService.translate(text, targetLang);
        if (result.isTranslated) {
          this.translatedMessages.set(msgId, {
            text: result.text,
            originalText: text,
            targetLang: result.targetLang
          });
          this.renderMessages();
          toast.info(`Translated to ${result.targetLang} \u{1F310}`);
        } else {
          toast.info("Message is already in the preferred language.");
        }
      } catch (e) {
        toast.error("Translation unavailable.");
      }
    }
    _formatFormattedText(text, searchQuery = "") {
      if (!text) return "";
      let escaped = this._escapeHtml(text);
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      escaped = escaped.replace(/(^|[^*])\*(?!\s)([^*]+)(?!\s)\*(?=[^*]|$)/g, "$1<strong>$2</strong>");
      escaped = escaped.replace(/(^|[^_])_(?!\s)([^_]+)(?!\s)_(?=[^_]|$)/g, "$1<em>$2</em>");
      escaped = escaped.replace(/(^|[^~])~(?!\s)([^~]+)(?!\s)~(?=[^~]|$)/g, "$1<del>$2</del>");
      escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.25); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:0.9em;">$1</code>');
      escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--color-cyan-accent); text-decoration:underline;">$1</a>');
      if (searchQuery) {
        const cleanQ = this._escapeHtml(searchQuery);
        try {
          const regex = new RegExp(`(${cleanQ})`, "gi");
          escaped = escaped.replace(regex, `<mark style="background:var(--color-romantic-pink); color:#fff; border-radius:3px; padding:0 2px;">$1</mark>`);
        } catch (e) {
        }
      }
      return escaped;
    }
    _showContextMenu(e, msg, isOutgoing) {
      this._closeContextMenu();
      const menu = document.createElement("div");
      menu.className = "message-context-menu card-3d";
      const reactions = ["\u2764\uFE0F", "\u{1F602}", "\u{1F44D}", "\u{1F62E}", "\u{1F622}", "\u{1F525}", "\u{1F44F}"];
      menu.innerHTML = `
      <div class="quick-reactions-dock">
        ${reactions.map((r) => `<button class="quick-react-btn" data-emoji="${r}">${r}</button>`).join("")}
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="reply">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
        Reply
      </div>
      ${msg.text ? `
        <div class="context-menu-item" data-action="translate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          Translate (Hindi/English)
        </div>
        <div class="context-menu-item" data-action="copy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Text
        </div>
      ` : ""}
      <div class="context-menu-item danger" data-action="delete-me">
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
      const y = Math.min(window.innerHeight - 260, Math.max(10, e.clientY || 50));
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
      menu.querySelector('[data-action="translate"]')?.addEventListener("click", () => {
        this.translateMessage(msg.id, msg.text);
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
      const currentUid = current ? String(current.uid || current.userId || "") : "";
      const isMe = String(msg.senderId).toUpperCase() === currentUid.toUpperCase();
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
        if (window.ymApp) {
          window.ymApp.switchView("chats");
        }
      });
      document.getElementById("cancel-reply-btn")?.addEventListener("click", () => {
        this.cancelReply();
      });
      const searchToggleBtn = document.getElementById("chat-search-toggle-btn");
      const searchInput = document.getElementById("chat-search-input");
      const searchCloseBtn = document.getElementById("chat-search-close-btn");
      if (searchToggleBtn) {
        searchToggleBtn.addEventListener("click", () => {
          this.toggleSearch();
        });
      }
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.renderMessages(e.target.value.trim());
        });
        searchInput.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            this.closeSearch();
            this.renderMessages("");
          }
        });
      }
      if (searchCloseBtn) {
        searchCloseBtn.addEventListener("click", () => {
          this.closeSearch();
          this.renderMessages("");
        });
      }
      document.getElementById("composer-send-btn")?.addEventListener("click", () => {
        this.sendCurrentTextMessage();
      });
      if (this.composerTextarea) {
        this.composerTextarea.addEventListener("input", () => this._autoGrowTextarea());
        this.composerTextarea.addEventListener("keydown", (e) => {
          const settings = storage.get("app_settings") || {};
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
          if (file.size > 1.8 * 1024 * 1024) {
            toast.error("This file is too large to store locally.");
            fileInput.value = "";
            return;
          }
          let type = "file";
          if (file.type.startsWith("image/")) type = "image";
          else if (file.type.startsWith("video/")) type = "video";
          const reader = new FileReader();
          reader.onload = async (evt) => {
            const dataUrl = evt.target.result;
            const result = await mediaPreview.show({ file, dataUrl, type });
            if (result.confirmed) {
              try {
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
              } catch (err) {
                toast.error(err.message || "This file is too large to store locally.");
              }
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
      window.addEventListener("ym:message_received", (e) => {
        if (this.currentConvId && e.detail && e.detail.conversationId === this.currentConvId) {
          chatService.markAsRead(this.currentConvId);
          this.renderMessages();
          this.scrollToBottom();
        }
      });
      window.addEventListener("ym:message_status_update", (e) => {
        if (this.currentConvId && (!e.detail || !e.detail.conversationId || e.detail.conversationId === this.currentConvId)) {
          this.renderMessages();
        }
      });
      window.addEventListener("ym:conversations_updated", (e) => {
        if (this.currentConvId) {
          this.renderMessages();
        }
      });
      window.addEventListener("ym:friends_updated", () => {
        if (this.currentConvId) {
          const conv = chatService.getConversationById(this.currentConvId);
          if (conv) {
            const partner = userService.getUserById(conv.otherParticipantId);
            if (partner) {
              const isFriend = friendService.getFriendshipStatus(partner.uid || partner.userId) === "friends";
              const lockedNotice = document.getElementById("chat-locked-notice");
              const composerArea = document.querySelector(".chat-composer-area");
              const sendBtn = document.getElementById("composer-send-btn");
              if (isFriend) {
                if (lockedNotice) lockedNotice.remove();
                if (composerArea) composerArea.style.opacity = "1";
                if (this.composerTextarea) {
                  this.composerTextarea.disabled = false;
                  this.composerTextarea.placeholder = "Type a message...";
                }
                if (sendBtn) sendBtn.style.pointerEvents = "auto";
              }
            }
          }
        }
      });
    }
    sendCurrentTextMessage() {
      if (!this.composerTextarea || !this.currentConvId) return;
      const text = this.composerTextarea.value.trim();
      if (!text) return;
      try {
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
      } catch (err) {
        toast.error(err.message || "Failed to send message.");
      }
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
    _escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
  };

  // js/views/friendsView.js
  var FriendsView = class {
    constructor(onOpenConversation) {
      this.onOpenConversation = onOpenConversation;
      this.container = document.getElementById("friends-view");
      this.currentSubTab = "my-friends";
      this.searchDebounceTimer = null;
      this._bindEvents();
    }
    render(searchQuery = "") {
      if (!this.container) return;
      this._renderSubTabs();
      if (this.currentSubTab === "my-friends") this._renderFriendsList();
      else if (this.currentSubTab === "requests") this._renderRequestsList();
      else if (this.currentSubTab === "search") {
        this._renderSearchTab(searchQuery);
        cloudSync.pullUsers();
      }
    }
    _bindEvents() {
      document.querySelectorAll(".friends-subtab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentSubTab = btn.dataset.subtab;
          this.render();
        });
      });
      window.addEventListener("ym:friends_updated", () => {
        this._renderSubTabs();
        if (this.container && this.container.classList.contains("active")) {
          this.render();
        }
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
          <div class="empty-state-text">Search for users by Name, Username, User ID, or Birthday to connect and chat!</div>
          <button class="btn-3d btn-primary btn-goto-find-friends" style="margin-top: 10px; font-size: 13px; padding: 8px 18px;">
            Find Friends
          </button>
        </div>
      `;
        listContainer.querySelector(".btn-goto-find-friends")?.addEventListener("click", () => {
          this.currentSubTab = "search";
          this.render();
        });
        return;
      }
      listContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${friends.map((friend) => {
        const uid = friend.uid || friend.userId;
        const avatar = friend.profilePicture || friend.avatar || APP_CONFIG.defaultAvatar;
        return `
            <div class="glass-panel card-3d" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div class="avatar-wrap">
                  <img src="${avatar}" class="avatar-img" alt="${friend.name}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                  <span class="avatar-status ${friend.onlineStatus === "online" ? "online" : ""}"></span>
                </div>
                <div style="overflow: hidden;">
                  <div style="font-weight: 700; font-size: 15px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${friend.name}</div>
                  <div style="font-size: 12px; color: var(--color-romantic-rose);">@${friend.username} \u2022 <span style="opacity: 0.85; font-family: var(--font-mono);">${uid}</span></div>
                </div>
              </div>
              <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis;">
                ${friend.bio || "Hey there! I am using You & Me \u{1F680}"}
              </div>
              <div style="display: flex; gap: 8px; margin-top: auto;">
                <button class="btn-3d btn-primary btn-msg-friend" data-user-id="${uid}" style="flex: 1; padding: 8px 12px; font-size: 13px;">
                  Message
                </button>
                <button class="btn-3d btn-glass btn-remove-friend" data-user-id="${uid}" data-name="${friend.name}" style="padding: 8px 12px; font-size: 13px; color: var(--color-danger);">
                  Remove
                </button>
              </div>
            </div>
          `;
      }).join("")}
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
            message: `Are you sure you want to remove ${btn.dataset.name} from your friends list?`,
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
          <div class="empty-state-title">No Pending Requests</div>
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
              ${incoming.map((req) => {
        const s = req.sender;
        const avatar = s.profilePicture || s.avatar || APP_CONFIG.defaultAvatar;
        const uid = s.uid || s.userId;
        return `
                  <div class="glass-panel card-3d" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                      <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                      <div style="overflow: hidden;">
                        <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${s.name}</div>
                        <div style="font-size: 11.5px; color: var(--text-muted);">@${s.username} \u2022 <span style="font-family: var(--font-mono);">${uid}</span></div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-shrink: 0;">
                      <button class="btn-3d btn-primary btn-accept-req" data-req-id="${req.requestId}" style="padding: 6px 14px; font-size: 12px;">Accept</button>
                      <button class="btn-3d btn-glass btn-reject-req" data-req-id="${req.requestId}" style="padding: 6px 10px; font-size: 12px; color: var(--color-danger);">&times;</button>
                    </div>
                  </div>
                `;
      }).join("")}
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
              ${sent.map((s) => {
        const r = s.recipient;
        const avatar = r.profilePicture || r.avatar || APP_CONFIG.defaultAvatar;
        const uid = r.uid || r.userId;
        return `
                  <div class="glass-panel" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                      <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                      <div style="overflow: hidden;">
                        <div style="font-weight: 600; font-size: 13.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${r.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">@${r.username} \u2022 <span style="font-family: var(--font-mono);">${uid}</span></div>
                      </div>
                    </div>
                    <button class="btn-3d btn-glass btn-cancel-sent" data-user-id="${uid}" style="padding: 5px 12px; font-size: 11.5px;">Cancel</button>
                  </div>
                `;
      }).join("")}
            </div>
          `}
        </div>
      </div>
    `;
      listContainer.querySelectorAll(".btn-accept-req").forEach((btn) => {
        btn.addEventListener("click", () => {
          friendService.acceptFriendRequest(btn.dataset.reqId);
          toast.success("Friend request accepted! You can now chat \u2728");
          this.render();
        });
      });
      listContainer.querySelectorAll(".btn-reject-req").forEach((btn) => {
        btn.addEventListener("click", () => {
          friendService.rejectFriendRequest(btn.dataset.reqId);
          toast.info("Friend request declined.");
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
    _renderSearchTab(initialQuery = "") {
      const listContainer = document.getElementById("friends-subview-content");
      if (!listContainer) return;
      const allEnrolled = userService.getAllEnrolledUsers({ excludeSelf: true });
      const dynamicChipsHtml = allEnrolled.slice(0, 8).map((u) => `
      <button type="button" class="search-chip" data-query="@${u.username}">@${u.username}</button>
    `).join("");
      listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="search-tab-header">
          <div class="input-with-icon" style="max-width: 540px; width: 100%;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="user-global-search-input" placeholder="Search by name, @username, User ID (SK-XXXXXX), or DOB..." value="${initialQuery ? this._escapeHtml(initialQuery) : ""}" autofocus />
            <button id="user-global-search-clear" class="search-clear-btn" style="${initialQuery ? "display: flex;" : "display: none;"}" title="Clear search">&times;</button>
          </div>
          <div class="search-helper-chips" id="search-helper-chips-container">
            <span class="chip-label">Quick Search:</span>
            ${dynamicChipsHtml || '<span style="font-size: 11.5px; color: var(--text-muted);">No other users registered yet</span>'}
          </div>
        </div>

        <div id="user-search-status-bar" style="font-size: 13.5px; font-weight: 600; color: var(--text-secondary); margin-top: 4px;"></div>

        <div id="user-search-results" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px;">
          <!-- Results inserted dynamically -->
        </div>
      </div>
    `;
      const searchInput = document.getElementById("user-global-search-input");
      const clearBtn = document.getElementById("user-global-search-clear");
      const resultsContainer = document.getElementById("user-search-results");
      const statusBar = document.getElementById("user-search-status-bar");
      const updateChips = () => {
        const chipsContainer = document.getElementById("search-helper-chips-container");
        if (!chipsContainer) return;
        const enrolled = userService.getAllEnrolledUsers({ excludeSelf: true });
        const chips = enrolled.slice(0, 8).map((u) => `
        <button type="button" class="search-chip" data-query="@${u.username}">@${u.username}</button>
      `).join("");
        chipsContainer.innerHTML = `<span class="chip-label">Quick Search:</span>` + (chips || '<span style="font-size: 11.5px; color: var(--text-muted);">No other users registered yet</span>');
        chipsContainer.querySelectorAll(".search-chip").forEach((chip) => {
          chip.addEventListener("click", () => {
            if (searchInput) {
              searchInput.value = chip.dataset.query;
              doSearch(chip.dataset.query);
              searchInput.focus();
            }
          });
        });
      };
      const doSearch = async (query) => {
        const q = String(query || "").trim();
        if (clearBtn) {
          clearBtn.style.display = q ? "flex" : "none";
        }
        const isDefault = !q;
        let results = isDefault ? userService.getAllEnrolledUsers({ excludeSelf: true }) : userService.searchUsers(q, { excludeSelf: false });
        if (!isDefault && results.length === 0) {
          if (statusBar) {
            statusBar.innerHTML = `\u{1F50D} <span>Searching cloud registry for "<strong>${this._escapeHtml(q)}</strong>"...</span>`;
          }
          await cloudSync.pullUsers();
          results = userService.searchUsers(q, { excludeSelf: false });
          updateChips();
        }
        if (statusBar) {
          if (isDefault) {
            statusBar.innerHTML = `\u{1F465} <span>Registered Community Members (${results.length} total)</span>`;
          } else {
            statusBar.innerHTML = `\u{1F50D} <span>Found ${results.length} ${results.length === 1 ? "user" : "users"} matching "<strong>${this._escapeHtml(q)}</strong>"</span>`;
          }
        }
        if (results.length === 0) {
          resultsContainer.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 20px;">
            <div class="empty-state-icon">\u{1F50D}</div>
            <div class="empty-state-title">No Users Found</div>
            <div class="empty-state-text" style="max-width: 440px; line-height: 1.6;">
              No matches found for "<strong>${this._escapeHtml(q)}</strong>".<br/>
              <strong>Search by:</strong><br/>
              \u2022 <strong>Full Name</strong> (e.g. <em>Rahul Sharma</em>)<br/>
              \u2022 <strong>Username</strong> (e.g. <em>@rahul</em> or <em>rahul</em>)<br/>
              \u2022 <strong>User ID / UID</strong> (e.g. <em>SK-A82K92</em>)<br/>
              \u2022 <strong>Date of Birth</strong> (e.g. <em>YYYY-MM-DD</em> or <em>12/05/2006</em>)
            </div>
          </div>
        `;
          return;
        }
        resultsContainer.innerHTML = results.map((u) => {
          const uid = u.uid || u.userId;
          const status = friendService.getFriendshipStatus(uid);
          let actionBtn = "";
          if (u.isSelf) {
            actionBtn = `
            <button class="btn-3d btn-glass btn-view-self-profile" style="padding:6px 14px; font-size:12px;" title="View Your Profile">
              \u{1F464} Your Profile
            </button>
          `;
          } else if (status === "friends") {
            actionBtn = `
            <button class="btn-3d btn-primary btn-msg-user" data-user-id="${uid}" style="padding:6px 14px; font-size:12px;" title="Open Chat">
              \u{1F4AC} Friends
            </button>
          `;
          } else if (status === "request_sent") {
            actionBtn = `
            <button class="btn-3d btn-glass btn-cancel-search-req" data-user-id="${uid}" style="padding:6px 12px; font-size:12px;" title="Click to cancel request">
              Request Sent \u2715
            </button>
          `;
          } else if (status === "request_received") {
            actionBtn = `
            <button class="btn-3d btn-primary btn-accept-search-req" data-user-id="${uid}" style="padding:6px 12px; font-size:12px;">
              Accept Request \u2713
            </button>
          `;
          } else {
            actionBtn = `
            <button class="btn-3d btn-primary btn-add-user" data-user-id="${uid}" style="padding:6px 14px; font-size:12px;" title="Send friend request">
              \u2795 Add Friend
            </button>
          `;
          }
          const avatar = u.profilePicture || u.avatar || APP_CONFIG.defaultAvatar;
          const dobText = u.dob || u.birthday ? ` \u2022 \u{1F382} ${u.dob || u.birthday}` : "";
          return `
          <div class="glass-panel card-3d" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                <div class="avatar-wrap">
                  <img src="${avatar}" class="avatar-img avatar-sm" alt="" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                  <span class="avatar-status ${u.onlineStatus === "online" ? "online" : ""}"></span>
                </div>
                <div style="overflow: hidden;">
                  <div style="font-weight: 700; font-size: 14.5px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${u.name}</div>
                  <div style="font-size: 11.5px; color: var(--color-romantic-rose);">@${u.username} \u2022 <span style="font-family: var(--font-mono);">${uid}</span>${dobText}</div>
                </div>
              </div>
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4; height: 34px; overflow: hidden; text-overflow: ellipsis;">
              ${u.bio || "Hey there! I am using You & Me \u{1F680}"}
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
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
              doSearch(searchInput ? searchInput.value : "");
            } catch (err) {
              toast.error(err.message);
            }
          });
        });
        resultsContainer.querySelectorAll(".btn-cancel-search-req").forEach((btn) => {
          btn.addEventListener("click", () => {
            friendService.cancelSentRequest(btn.dataset.userId);
            toast.info("Request canceled.");
            doSearch(searchInput ? searchInput.value : "");
          });
        });
        resultsContainer.querySelectorAll(".btn-accept-search-req").forEach((btn) => {
          btn.addEventListener("click", () => {
            const incoming = friendService.getIncomingRequests();
            const found = incoming.find((r) => r.sender && (r.sender.uid === btn.dataset.userId || r.sender.userId === btn.dataset.userId));
            if (found) {
              friendService.acceptFriendRequest(found.requestId);
              toast.success("Friend request accepted! \u2728");
              doSearch(searchInput ? searchInput.value : "");
            }
          });
        });
        resultsContainer.querySelectorAll(".btn-msg-user").forEach((btn) => {
          btn.addEventListener("click", () => {
            const conv = chatService.getOrCreateConversation(btn.dataset.userId);
            if (this.onOpenConversation) {
              this.onOpenConversation(conv.conversationId);
            }
          });
        });
        resultsContainer.querySelectorAll(".btn-view-self-profile").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (window.ymApp) window.ymApp.switchView("profile");
          });
        });
      };
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          clearTimeout(this.searchDebounceTimer);
          this.searchDebounceTimer = setTimeout(() => {
            doSearch(e.target.value);
          }, 120);
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          if (searchInput) {
            searchInput.value = "";
            clearBtn.style.display = "none";
            doSearch("");
            searchInput.focus();
          }
        });
      }
      listContainer.querySelectorAll(".search-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          if (searchInput) {
            searchInput.value = chip.dataset.query;
            doSearch(chip.dataset.query);
            searchInput.focus();
          }
        });
      });
      doSearch(initialQuery);
    }
    _escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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
      const uid = user.uid || user.userId;
      const friends = friendService.getFriendsList();
      const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString(void 0, { month: "long", year: "numeric" }) : "Recently";
      this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">My Profile</h2>
          <button class="btn-icon notif-bell-btn" data-view="notifications" title="Notifications" style="position: relative;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge-count notif-badge" style="position: absolute; top: -2px; right: -2px; display: none;">0</span>
          </button>
        </div>
        <div class="glass-panel-elevated card-3d" style="padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
          <div class="avatar-wrap avatar-lg" style="margin-bottom: 4px;">
            <img src="${user.profilePicture || user.avatar}" class="avatar-img" alt="${user.name}" id="profile-display-avatar" />
            <span class="avatar-status online"></span>
          </div>

          <div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 4px;">${user.name}</h2>
            <div style="font-size: 14px; color: var(--color-romantic-rose); font-weight: 600;">@${user.username}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono); background: rgba(0,0,0,0.2); padding: 3px 10px; border-radius: 8px; display: inline-block;">
              User ID: ${uid}
            </div>
            ${user.dob || user.birthday ? `
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                \u{1F382} Birthday: ${user.dob || user.birthday}
              </div>
            ` : ""}
            <div style="font-size: 12px; color: var(--color-cyan-accent); margin-top: 4px; font-weight: 600;">
              \u{1F310} Language: ${user.language || "English"}
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
            <span>Made by Saksham</span>
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
              <label class="input-label">Preferred Chat Language</label>
              <select id="edit-language" style="width: 100%; padding: 10px 14px; border-radius: 12px; background: var(--glass-surface-2); color: var(--text-primary); border: 1px solid var(--glass-border); font-family: inherit;">
                ${SUPPORTED_LANGUAGES.map((l) => `
                  <option value="${l.name}" ${(user.language || "English").toLowerCase() === l.name.toLowerCase() ? "selected" : ""}>${l.flag} ${l.name} (${l.native})</option>
                `).join("")}
              </select>
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
          const language = document.getElementById("edit-language").value;
          const updates = { name, displayName: name, status, bio, language };
          if (newAvatarData) {
            updates.profilePicture = newAvatarData;
            updates.avatar = newAvatarData;
          }
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
      const settings = storage.get("app_settings") || {};
      const isDark = settings.theme !== "light";
      const allUsers = userService.getAllUsers();
      const current = auth.getCurrentUser();
      const currentUid = current ? current.uid || current.userId : null;
      const currentLang = current?.language || settings.language || "English";
      this.container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px;">
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">Settings</h2>
          <button class="btn-icon notif-bell-btn" data-view="notifications" title="Notifications" style="position: relative;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span class="badge-count notif-badge" style="position: absolute; top: -2px; right: -2px; display: none;">0</span>
          </button>
        </div>

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

        <!-- Language & Translation Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 15px; font-weight: 700; color: var(--color-cyan-accent); display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Chat Language & Translation
            </h3>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(0, 242, 254, 0.15); color: var(--color-cyan-accent); font-weight: 600;">19+ Languages</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
            <div>
              <div style="font-weight: 600; font-size: 14px;">Preferred Translation Language</div>
              <div style="font-size: 12px; color: var(--text-muted);">Incoming chat messages translate to this language with 1 click</div>
            </div>
            <select id="select-settings-lang" style="min-width: 170px; padding: 8px 14px; font-size: 13px; font-weight: 600; border-radius: 10px; background: var(--glass-surface-2); color: var(--text-primary); border: 1px solid var(--glass-border); cursor: pointer; outline: none;">
              ${SUPPORTED_LANGUAGES.map((l) => `
                <option value="${l.name}" ${currentLang.toLowerCase() === l.name.toLowerCase() ? "selected" : ""}>${l.flag} ${l.name} (${l.native})</option>
              `).join("")}
            </select>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${SUPPORTED_LANGUAGES.slice(0, 6).map((l) => `
              <button type="button" class="btn-lang-quick-chip" data-lang="${l.name}" style="padding: 5px 12px; border-radius: 14px; font-size: 11.5px; font-weight: 600; background: ${currentLang.toLowerCase() === l.name.toLowerCase() ? "var(--color-primary)" : "rgba(255,255,255,0.06)"}; color: ${currentLang.toLowerCase() === l.name.toLowerCase() ? "#fff" : "var(--text-secondary)"}; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                ${l.flag} ${l.name}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Audio & Messages -->
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
          <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-pink); display: flex; align-items: center; gap: 8px;">
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

        <!-- Account Switcher Section (Testing Multi-Account locally) -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 15px; font-weight: 700; color: var(--color-romantic-pink); display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Account Switcher (Instant 1-Click)
            </h3>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(255, 51, 102, 0.15); color: var(--color-romantic-pink); font-weight: 600;">Test & Chat</span>
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Easily switch between registered profiles on this browser to test messaging, friend requests, and chatting between User A and User B.
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
            ${allUsers.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No other users registered yet.</div>' : allUsers.map((u) => {
        const uUid = u.uid || u.userId;
        const isCurrent = currentUid && currentUid === uUid;
        const avatar = u.profilePicture || u.avatar || APP_CONFIG.defaultAvatar;
        return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 10px; background: ${isCurrent ? "rgba(138, 63, 252, 0.15)" : "rgba(255, 255, 255, 0.04)"}; border: 1px solid ${isCurrent ? "var(--color-primary)" : "rgba(255, 255, 255, 0.08)"};">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
                    <div style="overflow: hidden;">
                      <div style="font-size: 13.5px; font-weight: 700; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${u.name} ${isCurrent ? '<span style="color: var(--color-primary-light); font-size: 11px;">(Active)</span>' : ""}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">@${u.username} \u2022 <span style="font-family: var(--font-mono);">${uUid}</span></div>
                    </div>
                  </div>
                  ${isCurrent ? '<span style="font-size: 12px; color: var(--color-success); font-weight: 600; padding: 4px 10px;">\u2713 Active</span>' : `<button type="button" class="btn-3d btn-primary btn-switch-account" data-user-id="${uUid}" style="padding: 5px 12px; font-size: 12px;">Switch</button>`}
                </div>
              `;
      }).join("")}
          </div>
        </div>

        <!-- Cross-Device Cloud Sync Section -->
        <div class="glass-panel card-3d" style="padding: 22px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 15px; font-weight: 700; color: var(--color-primary-light); display: flex; align-items: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
              Cross-Device Cloud Sync
            </h3>
            <span id="cloud-sync-status-badge" style="font-size: 11px; padding: 2px 8px; border-radius: 12px; background: rgba(0, 255, 170, 0.15); color: #00ffaa; font-weight: 600;">\u25CF Active</span>
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
            Sync your profile and discover community members across your phone, laptop, and live web app instantly.
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="btn-sync-cloud-now" class="btn-3d btn-primary" style="padding: 7px 16px; font-size: 12.5px;">
              \u{1F504} Sync Cloud Now
            </button>
            <button type="button" id="btn-copy-connect-link" class="btn-3d btn-glass" style="padding: 7px 16px; font-size: 12.5px;">
              \u{1F517} Copy My Connect Link
            </button>
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
            <span>Made by Saksham</span>
            <span class="heart-icon">\u2764\uFE0F</span>
          </div>
        </div>
      </div>
    `;
      this._bindEvents();
    }
    _bindEvents() {
      const settings = storage.get("app_settings") || {};
      document.querySelectorAll(".btn-theme-select").forEach((btn) => {
        btn.addEventListener("click", () => {
          const theme = btn.dataset.theme;
          settings.theme = theme;
          storage.set("app_settings", settings);
          document.documentElement.setAttribute("data-theme", theme);
          toast.info(`Switched to ${theme === "dark" ? "Dark 3D" : "Light 3D"} theme!`);
          this.render();
        });
      });
      const langSelect = document.getElementById("select-settings-lang");
      if (langSelect) {
        langSelect.addEventListener("change", (e) => {
          const lang = e.target.value;
          settings.language = lang;
          storage.set("app_settings", settings);
          auth.updateCurrentUser({ language: lang });
          toast.success(`Chat translation language set to ${lang}! \u{1F310}`);
          this.render();
        });
      }
      document.querySelectorAll(".btn-lang-quick-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lang = btn.dataset.lang;
          settings.language = lang;
          storage.set("app_settings", settings);
          auth.updateCurrentUser({ language: lang });
          toast.success(`Chat translation language set to ${lang}! \u{1F310}`);
          this.render();
        });
      });
      const syncNowBtn = document.getElementById("btn-sync-cloud-now");
      if (syncNowBtn) {
        syncNowBtn.addEventListener("click", async () => {
          syncNowBtn.disabled = true;
          syncNowBtn.textContent = "\u{1F504} Syncing...";
          await cloudSync.pullUsers();
          const current = auth.getCurrentUser();
          if (current) await cloudSync.pushUser(current);
          toast.success("Synced with cloud registry! All users updated \u2728");
          this.render();
        });
      }
      const copyLinkBtn = document.getElementById("btn-copy-connect-link");
      if (copyLinkBtn) {
        copyLinkBtn.addEventListener("click", () => {
          const link = cloudSync.getShareableLink();
          if (link && navigator.clipboard) {
            navigator.clipboard.writeText(link).then(() => {
              toast.success("Connect link copied to clipboard! Send to your phone \u{1F4F2}");
            }).catch(() => {
              prompt("Copy your connect link:", link);
            });
          } else if (link) {
            prompt("Copy your connect link:", link);
          }
        });
      }
      const depthSlider = document.getElementById("depth-slider");
      const depthLabel = document.getElementById("depth-val-label");
      if (depthSlider) {
        depthSlider.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          settings.depthIntensity = val;
          storage.set("app_settings", settings);
          if (depthLabel) depthLabel.textContent = `${Math.round(val * 100)}%`;
        });
      }
      const soundToggle = document.getElementById("toggle-sound");
      if (soundToggle) {
        soundToggle.addEventListener("change", (e) => {
          settings.soundEnabled = e.target.checked;
          storage.set("app_settings", settings);
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
          storage.set("app_settings", settings);
        });
      }
      this.container.querySelectorAll(".btn-switch-account").forEach((btn) => {
        btn.addEventListener("click", () => {
          const userId = btn.dataset.userId;
          const target = userService.getUserById(userId);
          if (target) {
            auth.setCurrentUser(target);
            toast.success(`Switched account to ${target.name} (@${target.username})! \u{1F680}`);
            setTimeout(() => {
              window.location.reload();
            }, 350);
          }
        });
      });
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
        <div class="subview-top-bar">
          <button class="btn-icon mobile-subview-back-btn" data-view="chats" title="Back to Chats">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h2 class="subview-header-title">Notifications</h2>
          <div style="display: flex; gap: 8px;">
            <button class="btn-3d btn-glass" id="btn-mark-all-notifs-read" style="padding: 6px 12px; font-size: 12px;">Mark Read</button>
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
        const isFriendReq = n.type === "friend_request";
        const isFriendAccepted = n.type === "friend_accepted";
        return `
                <div class="glass-panel card-3d" style="padding: 14px 18px; display: flex; align-items: flex-start; gap: 14px; border-left: 4px solid ${n.read ? "transparent" : "var(--color-romantic-pink)"};">
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--glass-surface-2); display: flex; align-items: center; justify-content: center; color: var(--color-romantic-rose); font-size: 18px; flex-shrink: 0; margin-top: 2px;">
                    ${n.type === "message" ? "\u{1F4AC}" : n.type === "reaction" ? "\u2764\uFE0F" : isFriendAccepted ? "\u{1F389}" : "\u{1F48C}"}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div style="font-weight: 700; font-size: 14px;">${n.title}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${timeStr}</div>
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 3px;">${n.message}</div>

                    ${isFriendReq ? `
                      <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button type="button" class="btn-3d btn-primary btn-notif-accept" data-req-id="${n.requestId || ""}" data-sender-id="${n.fromUserId || ""}" data-notif-id="${n.id}" style="padding: 6px 14px; font-size: 12px;">
                          Accept Request \u2713
                        </button>
                        <button type="button" class="btn-3d btn-glass btn-notif-decline" data-req-id="${n.requestId || ""}" data-notif-id="${n.id}" style="padding: 6px 12px; font-size: 12px; color: var(--color-danger);">
                          Decline
                        </button>
                      </div>
                    ` : ""}

                    ${isFriendAccepted ? `
                      <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button type="button" class="btn-3d btn-primary btn-notif-chat" data-user-id="${n.fromUserId || ""}" style="padding: 6px 14px; font-size: 12px;">
                          \u{1F4AC} Open Chat
                        </button>
                      </div>
                    ` : ""}
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        `}

        <div class="mobile-view-footer">
          <div class="creator-signature">
            <span>Made by Saksham</span>
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
      this.container.querySelectorAll(".btn-notif-accept").forEach((btn) => {
        btn.addEventListener("click", () => {
          const reqId = btn.dataset.reqId;
          const senderId = btn.dataset.senderId;
          const notifId = btn.dataset.notifId;
          try {
            let resolvedReqId = reqId;
            if (!resolvedReqId && senderId) {
              const incoming = friendService.getIncomingRequests();
              const found = incoming.find((r) => r.sender && r.sender.userId === senderId);
              if (found) resolvedReqId = found.requestId;
            }
            if (resolvedReqId) {
              const res = friendService.acceptFriendRequest(resolvedReqId);
              toast.success("Friend request accepted! Chat unlocked \u2728");
              this.render();
              if (this.onOpenConversation && res.conversation) {
                this.onOpenConversation(res.conversation.conversationId);
              }
            } else {
              notificationService.removeNotification(notifId);
              toast.info("Request resolved.");
              this.render();
            }
          } catch (err) {
            toast.error(err.message);
            this.render();
          }
        });
      });
      this.container.querySelectorAll(".btn-notif-decline").forEach((btn) => {
        btn.addEventListener("click", () => {
          const reqId = btn.dataset.reqId;
          const notifId = btn.dataset.notifId;
          try {
            if (reqId) {
              friendService.rejectFriendRequest(reqId);
            } else if (notifId) {
              notificationService.removeNotification(notifId);
            }
            toast.info("Friend request declined.");
            this.render();
          } catch (err) {
            toast.error(err.message);
          }
        });
      });
      this.container.querySelectorAll(".btn-notif-chat").forEach((btn) => {
        btn.addEventListener("click", () => {
          const userId = btn.dataset.userId;
          if (userId) {
            const conv = chatService.getOrCreateConversation(userId);
            if (this.onOpenConversation) {
              this.onOpenConversation(conv.conversationId);
            }
          }
        });
      });
    }
  };

  // js/components/searchSuggestions.js
  var SearchSuggestions = class {
    constructor({ inputId, containerId, onOpenConversation, onOpenFriendsView, onOpenProfileView }) {
      this.inputId = inputId;
      this.containerId = containerId;
      this.input = document.getElementById(inputId);
      this.container = document.getElementById(containerId);
      this.onOpenConversation = onOpenConversation;
      this.onOpenFriendsView = onOpenFriendsView;
      this.onOpenProfileView = onOpenProfileView;
      this.isOpen = false;
      this.selectedIndex = -1;
      this.currentResults = [];
      this.debounceTimer = null;
      this._ensureElements();
      this._init();
    }
    _ensureElements() {
      if (!this.input && this.inputId) {
        this.input = document.getElementById(this.inputId);
      }
      if (!this.container && this.containerId) {
        this.container = document.getElementById(this.containerId);
      }
    }
    _init() {
      this._ensureElements();
      if (!this.input) return;
      this.input.addEventListener("input", (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.search(e.target.value);
        }, 150);
      });
      this.input.addEventListener("focus", () => {
        this.search(this.input.value);
      });
      this.input.addEventListener("keydown", (e) => {
        if (!this.isOpen) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.navigate(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.navigate(-1);
        } else if (e.key === "Enter") {
          if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
            e.preventDefault();
            this.selectUser(this.currentResults[this.selectedIndex]);
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.close();
        }
      });
      document.addEventListener("click", (e) => {
        if (!this.isOpen) return;
        this._ensureElements();
        const clickedInside = this.container && this.container.contains(e.target) || this.input && this.input.contains(e.target);
        if (!clickedInside) {
          this.close();
        }
      });
    }
    search(query) {
      this._ensureElements();
      if (!this.container) return;
      const q = (query || "").trim();
      if (!q) {
        this.currentResults = userService.getSuggestedUsers(12, false).filter((u) => !u.isSelf);
        this.render(this.currentResults, "", true);
        cloudSync.pullUsers();
        return;
      }
      this.currentResults = userService.searchUsers(q, { limit: 12, excludeSelf: false });
      this.render(this.currentResults, q, false);
      if (this.currentResults.length === 0) {
        cloudSync.pullUsers().then(() => {
          if (this.input && this.input.value.trim() === q) {
            const fresh = userService.searchUsers(q, { limit: 12, excludeSelf: false });
            if (fresh.length > 0) {
              this.currentResults = fresh;
              this.render(fresh, q, false);
            }
          }
        });
      }
    }
    navigate(dir) {
      if (!this.currentResults || this.currentResults.length === 0) return;
      this.selectedIndex = Math.max(-1, Math.min(this.currentResults.length - 1, this.selectedIndex + dir));
      this._highlightSelected();
    }
    _highlightSelected() {
      this._ensureElements();
      if (!this.container) return;
      const items = this.container.querySelectorAll(".suggestion-item");
      items.forEach((el, idx) => {
        el.classList.toggle("selected", idx === this.selectedIndex);
        if (idx === this.selectedIndex) {
          el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    }
    render(results, query, isSuggestions = false) {
      this.selectedIndex = -1;
      this._ensureElements();
      if (!this.container) return;
      if (!results || results.length === 0) {
        this.container.innerHTML = `
        <div class="suggestions-empty-state">
          <div class="suggestions-empty-icon">\u{1F50D}</div>
          <div class="suggestions-empty-title">No user found</div>
          <div class="suggestions-empty-subtitle">
            No matches for <strong>"${this._escapeHtml(query)}"</strong>.
            <div class="suggestions-search-tip">
              \u{1F4A1} <strong>Best ways to search:</strong><br/>
              \u2022 By <strong>Full Name</strong> (e.g. <em>John Doe</em>)<br/>
              \u2022 By <strong>Username</strong> with or without @ (e.g. <em>@john</em> or <em>john</em>)<br/>
              \u2022 By <strong>User ID</strong> (e.g. <em>YM-123456</em> or <em>123456</em>)<br/>
              \u2022 By <strong>Birthday / DOB</strong> (e.g. <em>YYYY-MM-DD</em> or <em>DD/MM</em>)
            </div>
          </div>
        </div>
      `;
        this.open();
        return;
      }
      const headerTitle = isSuggestions ? `<span>\u2728 People You May Know</span>` : `<span>Matches (${results.length})</span>`;
      const html = `
      <div class="suggestions-header">
        ${headerTitle}
        <span class="suggestions-hint">Search by Name, @Username, User ID, or DOB</span>
      </div>
      <div class="suggestions-list" role="listbox">
        ${results.map((u, idx) => this._renderItem(u, query, idx)).join("")}
      </div>
      <div class="suggestions-footer">
        <button type="button" class="btn-goto-find-friends-global" id="btn-suggestions-more">
          Browse all users in Find Friends &rarr;
        </button>
      </div>
    `;
      this.container.innerHTML = html;
      this._bindItemEvents();
      this.open();
    }
    _renderItem(u, query, index) {
      const status = friendService.getFriendshipStatus(u.userId);
      let actionBtn = "";
      let badgeClass = "status-none";
      let badgeText = "User";
      if (u.isSelf) {
        actionBtn = `
        <button type="button" class="btn-3d btn-glass btn-suggestion-self" data-user-id="${u.userId}" title="Your Profile" style="padding: 6px 12px; font-size: 11.5px; opacity: 0.9;">
          \u{1F464} You
        </button>
      `;
        badgeClass = "status-friend";
        badgeText = "Your Account";
      } else if (status === "friends") {
        actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-chat" data-user-id="${u.userId}" title="Open chat">
          \u{1F4AC} Friends
        </button>
      `;
        badgeClass = "status-friend";
        badgeText = "Friends \u2713";
      } else if (status === "request_sent") {
        actionBtn = `
        <button type="button" class="btn-3d btn-glass btn-suggestion-cancel" data-user-id="${u.userId}" title="Click to cancel request">
          Request Sent
        </button>
      `;
        badgeClass = "status-pending";
        badgeText = "Request Sent";
      } else if (status === "request_received") {
        actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-respond" data-user-id="${u.userId}" title="Accept connection">
          Accept Request
        </button>
      `;
        badgeClass = "status-incoming";
        badgeText = "Pending";
      } else {
        actionBtn = `
        <button type="button" class="btn-3d btn-primary btn-suggestion-add" data-user-id="${u.userId}" title="Send friend request">
          \u2795 Add Friend
        </button>
      `;
        badgeClass = "status-none";
        badgeText = "Registered User";
      }
      const isOnline = u.onlineStatus === "online";
      const avatarImg = u.profilePicture || APP_CONFIG.defaultAvatar;
      const displayName = u.displayName || u.name;
      const nameDisplay = this._highlightMatch(displayName, query);
      const usernameDisplay = this._highlightMatch("@" + u.username, query.replace(/^@+/, ""));
      const idDisplay = this._highlightMatch(u.userId, query.replace(/[^a-z0-9]/gi, ""));
      const dobValue = u.dob || u.birthday || "";
      const dobDisplay = dobValue ? `<span class="user-dob-badge" style="font-size: 10.5px; color: var(--text-muted); margin-left: 6px;">\u{1F382} ${this._highlightMatch(dobValue, query)}</span>` : "";
      return `
      <div class="suggestion-item card-3d" data-index="${index}" data-user-id="${u.userId}">
        <div class="avatar-wrap">
          <img src="${avatarImg}" class="avatar-img avatar-sm" alt="${displayName}" onerror="this.src='${APP_CONFIG.defaultAvatar}'" />
          <span class="avatar-status ${isOnline ? "online" : ""}"></span>
        </div>
        <div class="suggestion-info">
          <div class="suggestion-top-row">
            <span class="suggestion-name">${nameDisplay}</span>
            <span class="suggestion-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="suggestion-mid-row">
            <span class="suggestion-username">${usernameDisplay}</span>
            <span class="user-id-badge" title="User ID: Click to copy" data-copy-id="${u.userId}">
              \u{1F194} ${idDisplay}
            </span>
            ${dobDisplay}
          </div>
        </div>
        <div class="suggestion-actions">
          ${actionBtn}
        </div>
      </div>
    `;
    }
    _bindItemEvents() {
      this.container.querySelectorAll(".suggestion-item").forEach((el) => {
        el.addEventListener("click", (e) => {
          if (e.target.closest(".suggestion-actions") || e.target.closest("[data-copy-id]")) return;
          const userId = el.dataset.userId;
          const user = userService.getUserById(userId);
          if (user) {
            this.selectUser(user);
          }
        });
      });
      this.container.querySelectorAll("[data-copy-id]").forEach((badge) => {
        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          const idToCopy = badge.dataset.copyId;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(idToCopy).then(() => {
              toast.success(`Copied ID: ${idToCopy} \u{1F4CB}`);
            }).catch(() => {
              toast.info(`ID: ${idToCopy}`);
            });
          } else {
            toast.info(`ID: ${idToCopy}`);
          }
        });
      });
      this.container.querySelectorAll(".btn-suggestion-chat").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const userId = btn.dataset.userId;
          const conv = chatService.getOrCreateConversation(userId);
          this.close();
          if (this.onOpenConversation) {
            this.onOpenConversation(conv.conversationId);
          }
        });
      });
      this.container.querySelectorAll(".btn-suggestion-add").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const userId = btn.dataset.userId;
          try {
            const user = userService.getUserById(userId);
            friendService.sendFriendRequest(userId);
            const name = user ? `${user.name} (${user.userId})` : userId;
            toast.success(`Friend request sent to ${name}! \u{1F48C}`);
            window.dispatchEvent(new CustomEvent("ym:friends_updated"));
            this.search(this.input.value);
          } catch (err) {
            toast.error(err.message);
          }
        });
      });
      this.container.querySelectorAll(".btn-suggestion-cancel").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const userId = btn.dataset.userId;
          friendService.cancelSentRequest(userId);
          toast.info("Request canceled.");
          window.dispatchEvent(new CustomEvent("ym:friends_updated"));
          this.search(this.input.value);
        });
      });
      this.container.querySelectorAll(".btn-suggestion-respond").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const userId = btn.dataset.userId;
          try {
            const incoming = friendService.getIncomingRequests();
            const req = incoming.find((r) => r.sender && r.sender.userId === userId);
            if (req) {
              friendService.acceptFriendRequest(req.requestId);
              toast.success("Friend request accepted! Chat unlocked \u2728");
              window.dispatchEvent(new CustomEvent("ym:friends_updated"));
              this.search(this.input.value);
            } else if (this.onOpenFriendsView) {
              this.close();
              this.onOpenFriendsView("requests");
            }
          } catch (err) {
            toast.error(err.message);
          }
        });
      });
      this.container.querySelectorAll(".btn-suggestion-self").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.close();
          if (this.onOpenProfileView) {
            this.onOpenProfileView();
          } else if (this.onOpenFriendsView) {
            this.onOpenFriendsView("profile");
          }
        });
      });
      this.container.querySelector("#btn-suggestions-more")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.close();
        if (this.onOpenFriendsView) {
          this.onOpenFriendsView("search");
        }
      });
    }
    selectUser(user) {
      if (!user) return;
      this.close();
      if (user.isSelf) {
        if (this.onOpenProfileView) {
          this.onOpenProfileView();
        } else if (this.onOpenFriendsView) {
          this.onOpenFriendsView("profile");
        }
        return;
      }
      const status = friendService.getFriendshipStatus(user.userId);
      if (status === "friends") {
        const conv = chatService.getOrCreateConversation(user.userId);
        if (this.onOpenConversation) {
          this.onOpenConversation(conv.conversationId);
        }
      } else if (status === "request_sent") {
        toast.info(`Friend request is pending with @${user.username}. Chat is locked until accepted.`);
        const conv = chatService.getOrCreateConversation(user.userId);
        if (this.onOpenConversation) {
          this.onOpenConversation(conv.conversationId);
        }
      } else if (status === "request_received") {
        toast.info(`@${user.username} sent you a friend request. Accept it in Requests to chat! \u{1F48C}`);
        if (this.onOpenFriendsView) {
          this.onOpenFriendsView("requests");
        }
      } else {
        toast.info(`Send a friend request to @${user.username} first to unlock chat.`);
        if (this.onOpenFriendsView) {
          this.onOpenFriendsView("search");
        }
      }
    }
    _highlightMatch(text, query) {
      if (!text) return "";
      if (!query || !query.trim()) return this._escapeHtml(text);
      const q = query.trim();
      const cleanQ = q.replace(/[^a-zA-Z0-9]/g, "");
      if (!cleanQ) return this._escapeHtml(text);
      try {
        const regex = new RegExp(`(${cleanQ})`, "gi");
        return this._escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
      } catch (e) {
        return this._escapeHtml(text);
      }
    }
    _escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    open() {
      this.isOpen = true;
      this._ensureElements();
      if (this.container) {
        this.container.style.display = "flex";
        this.container.classList.add("active");
      }
    }
    close() {
      this.isOpen = false;
      this._ensureElements();
      if (this.container) {
        this.container.style.display = "none";
        this.container.classList.remove("active");
      }
      this.selectedIndex = -1;
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
      this.searchSuggestions = null;
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
      this.searchSuggestions = new SearchSuggestions({
        inputId: "sidebar-search-input",
        containerId: "sidebar-search-suggestions",
        onOpenConversation: (convId) => this.openConversation(convId),
        onOpenProfileView: () => this.switchView("profile"),
        onOpenFriendsView: (subtab, query = "") => {
          this.switchView("friends");
          if (this.friendsView) {
            this.friendsView.currentSubTab = subtab;
            this.friendsView.render(query);
          }
        }
      });
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
      cloudSync.pullUsers();
    }
    _handleAuthSuccess(user) {
      if (user) {
        cloudSync.pushUser(user);
        cloudSync.pullUsers();
      }
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
      if (this.searchSuggestions) {
        this.searchSuggestions.close();
      }
      this.switchView("chats");
      const chatScreen = document.getElementById("chat-screen");
      const welcomePlaceholder = document.getElementById("chat-welcome-placeholder");
      if (chatScreen) chatScreen.style.display = "flex";
      if (welcomePlaceholder) welcomePlaceholder.style.display = "none";
      this.chatListView.setActive(convId);
      this.chatView.openConversation(convId);
    }
    switchView(viewName) {
      if (!viewName) return;
      try {
        if (this.searchSuggestions) {
          this.searchSuggestions.close();
        }
      } catch (e) {
        console.warn("Search suggestions close safe guard:", e);
      }
      this.previousView = this.currentView;
      this.currentView = viewName;
      const dashboard = document.getElementById("app-dashboard");
      if (dashboard) {
        dashboard.setAttribute("data-current-view", viewName);
      }
      document.querySelectorAll(".subview-container").forEach((el) => el.classList.remove("active"));
      document.querySelectorAll(".nav-tab-btn, .mobile-nav-item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === viewName);
      });
      document.querySelectorAll(".notif-bell-btn").forEach((btn) => {
        btn.classList.toggle("active", viewName === "notifications");
      });
      const chatScreen = document.getElementById("chat-screen");
      const welcomePlaceholder = document.getElementById("chat-welcome-placeholder");
      const sidebarList = document.getElementById("sidebar-conversations-list");
      const sidebarSearch = document.querySelector(".sidebar-search-box");
      if (viewName === "chats") {
        if (this.chatView && this.chatView.currentConvId) {
          if (chatScreen) chatScreen.style.display = "flex";
          if (welcomePlaceholder) welcomePlaceholder.style.display = "none";
        } else {
          if (chatScreen) chatScreen.style.display = "none";
          if (welcomePlaceholder) welcomePlaceholder.style.display = "flex";
        }
        if (sidebarList) sidebarList.style.display = "flex";
        if (sidebarSearch) sidebarSearch.style.display = "block";
        if (this.chatListView) {
          try {
            this.chatListView.render();
          } catch (e) {
            console.error("chatListView render failed:", e);
          }
        }
      } else {
        if (chatScreen) chatScreen.style.display = "none";
        if (welcomePlaceholder) welcomePlaceholder.style.display = "none";
        const targetSubview = document.getElementById(`${viewName}-view`);
        if (targetSubview) targetSubview.classList.add("active");
        try {
          if (viewName === "friends" && this.friendsView) this.friendsView.render();
          else if (viewName === "profile" && this.profileView) this.profileView.render();
          else if (viewName === "settings" && this.settingsView) this.settingsView.render();
          else if (viewName === "notifications" && this.notificationsView) this.notificationsView.render();
        } catch (renderErr) {
          console.error(`Error rendering subview ${viewName}:`, renderErr);
        }
        if (this.chatView) {
          this.chatView.closeConversation();
        }
      }
      this._updateBadges();
    }
    _updateBadges() {
      const incomingReqs = friendService.getIncomingRequests();
      document.querySelectorAll(".friends-badge").forEach((b) => {
        b.textContent = incomingReqs.length;
        b.style.display = incomingReqs.length > 0 ? "inline-flex" : "none";
      });
      const unreadNotifs = notificationService.getUnreadCount();
      document.querySelectorAll(".notif-badge").forEach((b) => {
        b.textContent = unreadNotifs;
        b.style.display = unreadNotifs > 0 ? "inline-flex" : "none";
      });
    }
    _bindGlobalEvents() {
      document.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.switchView(btn.dataset.view);
        });
      });
      const searchInput = document.getElementById("sidebar-search-input");
      const clearBtn = document.getElementById("sidebar-search-clear-btn");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const val = e.target.value;
          if (clearBtn) {
            clearBtn.style.display = val ? "flex" : "none";
          }
          this.chatListView.render(val);
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          if (searchInput) {
            searchInput.value = "";
            clearBtn.style.display = "none";
            this.chatListView.render("");
            if (this.searchSuggestions) {
              this.searchSuggestions.search("");
            }
            searchInput.focus();
          }
        });
      }
      document.addEventListener("click", (e) => {
        const viewBtn = e.target.closest("[data-view]");
        if (viewBtn) {
          const view = viewBtn.dataset.view;
          if (view && (viewBtn.classList.contains("nav-tab-btn") || viewBtn.classList.contains("mobile-nav-item") || viewBtn.classList.contains("notif-bell-btn") || viewBtn.classList.contains("mobile-subview-back-btn") || viewBtn.id === "btn-welcome-find-friends" || viewBtn.id === "btn-welcome-profile")) {
            e.preventDefault();
            this.switchView(view);
            if (view === "friends" && viewBtn.id === "btn-welcome-find-friends" && this.friendsView) {
              this.friendsView.currentSubTab = "search";
              this.friendsView.render();
            }
            return;
          }
        }
        const findFriendsBtn = e.target.closest("#btn-empty-find-friends");
        if (findFriendsBtn) {
          e.preventDefault();
          this.switchView("friends");
          if (this.friendsView) {
            this.friendsView.currentSubTab = "search";
            this.friendsView.render();
          }
          return;
        }
      });
      window.addEventListener("ym:notification_added", () => {
        this._updateBadges();
        if (this.currentView === "notifications" && this.notificationsView) {
          this.notificationsView.render();
        }
      });
      window.addEventListener("ym:notifications_updated", () => {
        this._updateBadges();
        if (this.currentView === "notifications" && this.notificationsView) {
          this.notificationsView.render();
        }
      });
      window.addEventListener("ym:friends_updated", () => {
        this._updateBadges();
        if (this.currentView === "friends" && this.friendsView) {
          this.friendsView.render();
        }
        if (this.chatListView) {
          this.chatListView.render();
        }
      });
      window.addEventListener("ym:conversation_unlocked", (e) => {
        this._updateBadges();
        if (this.chatListView) {
          this.chatListView.render();
        }
      });
      window.addEventListener("ym:conversations_updated", () => {
        if (this.chatListView) {
          this.chatListView.render();
        }
      });
      window.addEventListener("ym:message_received", (e) => {
        if (this.chatListView) {
          this.chatListView.render();
        }
        if (this.chatView && this.chatView.currentConvId && e.detail?.conversationId === this.chatView.currentConvId) {
          this.chatView.renderMessages();
          this.chatView.scrollToBottom();
        }
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
