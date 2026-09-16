/* ==========================================================================
   YOU & ME — 3D Chat Application
   Auth View Controller (Romantic 3D Scene + Login / Signup Tabs)
   ========================================================================== */

import { auth } from '../services/auth.js';
import { toast } from '../components/toast.js';
import { RomanticScene } from '../components/romanticScene.js';

export class AuthView {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess;
    this.scene = null;
    this.currentMode = 'login'; // 'login' | 'signup'
    this.uploadedAvatarData = null;
    this._init();
  }

  _init() {
    this.scene = new RomanticScene('romantic-canvas');
    this._bindEvents();
  }

  show() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'flex';
    const romanticCanvas = document.getElementById('romantic-canvas');
    if (romanticCanvas) {
      romanticCanvas.classList.remove('hidden');
      romanticCanvas.style.display = 'block';
    }
    if (this.scene) this.scene.start();
  }

  hide() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
    const romanticCanvas = document.getElementById('romantic-canvas');
    if (romanticCanvas) {
      romanticCanvas.classList.add('hidden');
      romanticCanvas.style.display = 'none';
    }
    if (this.scene) this.scene.stop();
  }

  _bindEvents() {
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    const avatarInput = document.getElementById('signup-avatar-input');
    const forgotPassBtn = document.getElementById('btn-forgot-password');

    // Tab Switching
    if (tabLogin) {
      tabLogin.addEventListener('click', () => this.switchTab('login'));
    }
    if (tabSignup) {
      tabSignup.addEventListener('click', () => this.switchTab('signup'));
    }

    // Avatar Upload Preview with Automatic Thumbnail Compression
    if (avatarInput) {
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file.");
            return;
          }
          const reader = new FileReader();
          reader.onload = (evt) => {
            const rawData = evt.target.result;
            // Compress image to 128x128 thumbnail so it never exceeds localStorage quota
            const img = new Image();
            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                const maxDim = 128;
                let w = img.width;
                let h = img.height;
                if (w > h) {
                  if (w > maxDim) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                  }
                } else {
                  if (h > maxDim) {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                  }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                this.uploadedAvatarData = canvas.toDataURL('image/jpeg', 0.82);
              } catch (canvasErr) {
                this.uploadedAvatarData = rawData;
              }
              const previewImg = document.getElementById('signup-avatar-preview');
              if (previewImg) previewImg.src = this.uploadedAvatarData;
            };
            img.src = rawData;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Login Form Submit
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('login-identifier').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember').checked;

        if (!identifier || !password) {
          toast.error("Please fill in all fields.");
          return;
        }

        try {
          const user = auth.loginUser(identifier, password, remember);
          toast.success(`Welcome back, ${user.name}! ✨`);
          this.onAuthSuccess(user);
        } catch (err) {
          toast.error(err.message);
        }
      });
    }

    // Signup Form Submit
    if (formSignup) {
      formSignup.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        const dobInput = document.getElementById('signup-dob');
        const dob = dobInput ? dobInput.value : '';

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
          toast.success(`Account created! Your ID is ${user.uid || user.userId} 🎉`);
          this.onAuthSuccess(user);
        } catch (err) {
          toast.error(err.message);
        }
      });
    }

    // Forgot Password Trigger
    if (forgotPassBtn) {
      forgotPassBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toast.info("Log in with your registered username, email, or User ID, or click Create Account to sign up!");
      });
    }

    // Password Visibility Toggles
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (input.type === 'password') {
          input.type = 'text';
          btn.style.color = 'var(--color-romantic-pink)';
        } else {
          input.type = 'password';
          btn.style.color = 'var(--text-muted)';
        }
      });
    });
  }

  switchTab(mode) {
    this.currentMode = mode;
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');

    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      formLogin.style.display = 'flex';
      formSignup.style.display = 'none';
    } else {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      formSignup.style.display = 'flex';
      formLogin.style.display = 'none';
    }
  }
}
