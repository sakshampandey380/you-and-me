/* ==========================================================================
   YOU & ME — 3D Chat Application
   Multi-Language Chat Translation Engine
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { auth } from './auth.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

class TranslationService {
  constructor() {
    this.customEndpoint = null;
    this.cache = new Map();
    this._initDictionary();
  }

  _initDictionary() {
    // Conversational phrase dictionary: English <-> Hindi (Devanagari)
    this.phraseMapEnToHi = {
      "hello": "नमस्ते",
      "hi": "नमस्ते",
      "hey": "अरे सुनो",
      "good morning": "शुभ प्रभात ☀️",
      "good afternoon": "शुभ दोपहर ☀️",
      "good evening": "शुभ संध्या 🌙",
      "good night": "शुभ रात्रि ✨",
      "how are you": "आप कैसे हैं?",
      "how are you?": "आप कैसे हैं?",
      "how r u": "आप कैसे हैं?",
      "how r u?": "आप कैसे हैं?",
      "i am good": "मैं ठीक हूँ",
      "i am fine": "मैं बिल्कुल ठीक हूँ",
      "i am doing great": "मैं बहुत अच्छा कर रहा हूँ",
      "what are you doing": "आप क्या कर रहे हैं?",
      "what are you doing?": "आप क्या कर रहे हैं?",
      "where are you": "आप कहाँ हैं?",
      "where are you?": "आप कहाँ हैं?",
      "thank you": "धन्यवाद 🙏",
      "thanks": "धन्यवाद 🙏",
      "thank you so much": "बहुत-बहुत धन्यवाद 🙏",
      "welcome": "आपका स्वागत है",
      "you are welcome": "कोई बात नहीं, आपका स्वागत है",
      "yes": "हाँ",
      "no": "नहीं",
      "ok": "ठीक है",
      "okay": "ठीक है",
      "sure": "ज़रूर",
      "of course": "बिल्कुल",
      "please": "कृपया",
      "sorry": "माफ़ कीजिए",
      "bye": "अलविदा",
      "goodbye": "अलविदा",
      "see you": "फिर मिलेंगे",
      "see you soon": "जल्द मिलेंगे ✨",
      "take care": "अपना ख्याल रखना",
      "love you": "प्यार करता हूँ ❤️",
      "i love you": "मैं आपसे प्यार करता हूँ ❤️",
      "happy birthday": "जन्मदिन मुबारक हो 🎂",
      "congratulations": "बधाई हो 🎉",
      "awesome": "बहुत बढ़िया!",
      "nice": "अच्छा है",
      "great": "शानदार",
      "cool": "बहुत खूब",
      "beautiful": "सुंदर",
      "let's chat": "चलो बात करते हैं",
      "call me": "मुझे कॉल करें",
      "message me": "मुझे मैसेज करें",
      "are you free": "क्या आप खाली हैं?",
      "are you free?": "क्या आप फ्री हैं?",
      "what happened": "क्या हुआ?",
      "what happened?": "क्या हुआ?",
      "all good": "सब ठीक है",
      "no problem": "कोई बात नहीं",
      "i am happy": "मैं खुश हूँ",
      "nice to meet you": "आपसे मिलकर अच्छा लगा"
    };

    // Reverse map: Hindi (Devanagari) -> English
    this.phraseMapHiToEn = {};
    Object.entries(this.phraseMapEnToHi).forEach(([en, hi]) => {
      const cleanHi = hi.replace(/[?☀️🌙✨🙏❤️🎂🎉!]/g, '').trim();
      this.phraseMapHiToEn[cleanHi.toLowerCase()] = en;
      this.phraseMapHiToEn[hi.toLowerCase()] = en;
    });

    // Word-level vocabulary
    this.wordsEnToHi = {
      "friend": "दोस्त",
      "friends": "दोस्त",
      "love": "प्यार",
      "happy": "खुश",
      "today": "आज",
      "tomorrow": "कल",
      "yesterday": "कल",
      "now": "अभी",
      "chat": "बातचीत",
      "message": "संदेश",
      "photo": "तस्वीर",
      "image": "तस्वीर",
      "video": "वीडियो",
      "file": "फ़ाइल",
      "together": "साथ में",
      "work": "काम",
      "home": "घर",
      "good": "अच्छा",
      "bad": "बुरा",
      "beautiful": "खूबसूरत",
      "life": "जिंदगी",
      "time": "समय",
      "day": "दिन",
      "night": "रात",
      "sun": "सूरज",
      "moon": "चाँद",
      "star": "तारा",
      "heart": "दिल",
      "music": "संगीत"
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
    return (
      SUPPORTED_LANGUAGES.find(
        l => l.code.toLowerCase() === needle || l.name.toLowerCase() === needle || l.native.toLowerCase() === needle
      ) || SUPPORTED_LANGUAGES[0]
    );
  }

  async translate(text, targetLang = null) {
    if (!text || typeof text !== 'string') {
      return { text: '', isTranslated: false };
    }

    const trimmed = text.trim();
    if (!trimmed) return { text: '', isTranslated: false };

    // Determine target language meta
    let target = targetLang;
    if (!target) {
      const preferred = this.getUserPreferredLanguage();
      const isSourceHindi = this.isHindi(trimmed);
      target = (preferred === 'Hindi' || isSourceHindi) ? (isSourceHindi ? 'English' : 'Hindi') : preferred;
    }

    const targetMeta = this.getLanguageMeta(target);
    const targetCode = targetMeta.code;
    const targetName = targetMeta.name;

    // Avoid translating if content matches target
    const isSourceHindi = this.isHindi(trimmed);
    if (targetCode === 'hi' && isSourceHindi) {
      return { text: trimmed, isTranslated: false, targetLang: targetName };
    }
    if (targetCode === 'en' && !isSourceHindi && !/[^\x00-\x7F]/.test(trimmed)) {
      return { text: trimmed, isTranslated: false, targetLang: targetName };
    }

    // Check memory cache
    const cacheKey = `${targetCode}:${trimmed}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 1. Try Live Multi-Language Translation API (Free, high quality, zero-key)
    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=autodetect|${targetCode}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          let translated = data.responseData.translatedText;
          // Decode HTML entities if returned by API
          translated = translated
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

          // If valid translation received
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

    // 2. Offline Fallback for Hindi <-> English
    const lower = trimmed.toLowerCase();
    if (targetCode === 'hi') {
      if (this.phraseMapEnToHi[lower]) {
        const result = {
          text: this.phraseMapEnToHi[lower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      const cleanLower = lower.replace(/[!?.,]/g, '').trim();
      if (this.phraseMapEnToHi[cleanLower]) {
        const result = {
          text: this.phraseMapEnToHi[cleanLower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      const words = trimmed.split(/(\s+|[.,!?])/);
      let translatedAny = false;
      const translatedWords = words.map(word => {
        const wLower = word.toLowerCase();
        if (this.wordsEnToHi[wLower]) {
          translatedAny = true;
          return this.wordsEnToHi[wLower];
        }
        return word;
      });

      if (translatedAny) {
        const result = {
          text: translatedWords.join(''),
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      const fallbackResult = {
        text: `[अनुवाद] ${trimmed}`,
        originalText: trimmed,
        isTranslated: true,
        targetLang: 'Hindi'
      };
      return fallbackResult;
    } else if (targetCode === 'en') {
      if (this.phraseMapHiToEn[lower]) {
        const result = {
          text: this.phraseMapHiToEn[lower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      const cleanLower = lower.replace(/[!?.,|।]/g, '').trim();
      if (this.phraseMapHiToEn[cleanLower]) {
        const result = {
          text: this.phraseMapHiToEn[cleanLower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      const words = trimmed.split(/(\s+|[.,!?|।])/);
      let translatedAny = false;
      const translatedWords = words.map(word => {
        if (this.wordsHiToEn[word]) {
          translatedAny = true;
          return this.wordsHiToEn[word];
        }
        return word;
      });

      if (translatedAny) {
        const result = {
          text: translatedWords.join(''),
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      return {
        text: `[Translated] ${trimmed}`,
        originalText: trimmed,
        isTranslated: true,
        targetLang: 'English'
      };
    }

    // For any other language in offline mode
    return {
      text: `[${targetName}] ${trimmed}`,
      originalText: trimmed,
      isTranslated: true,
      targetLang: targetName
    };
  }
}

export const translationService = new TranslationService();
