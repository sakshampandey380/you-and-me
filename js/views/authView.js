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
    if (this.scene) this.scene.start();
  }

  hide() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
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

    // Avatar Upload Preview
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
            this.uploadedAvatarData = evt.target.result;
            const previewImg = document.getElementById('signup-avatar-preview');
            if (previewImg) previewImg.src = this.uploadedAvatarData;
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
          toast.success(`Account created! Your ID is ${user.userId} 🎉`);
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
        toast.info("Demo Account Tip: You can log in with username 'alex' and password 'password123', or create a new account!");
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
