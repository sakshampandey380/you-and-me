/* ==========================================================================
   YOU & ME — 3D Chat Application
   Chat Translation Service (Hindi <-> English Client-Side Engine)
   "Connect. Chat. Share. Together." | Made by Saksham ❤️
   ========================================================================== */

import { auth } from './auth.js';

class TranslationService {
  constructor() {
    this.customEndpoint = null; // Can be configured later if an API is added
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
      "bye": "अलविida",
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
    // Check for Devanagari Unicode range (U+0900 to U+097F)
    return /[\u0900-\u097F]/.test(text);
  }

  getUserPreferredLanguage() {
    const user = auth.getCurrentUser();
    if (user && user.language) {
      return user.language;
    }
    return "English";
  }

  async translate(text, targetLang = null) {
    if (!text || typeof text !== 'string') {
      return { text: '', isTranslated: false };
    }

    const trimmed = text.trim();
    if (!trimmed) return { text: '', isTranslated: false };

    // Determine target language: if not supplied, detect based on content or user preference
    const isSourceHindi = this.isHindi(trimmed);
    let target = targetLang;

    if (!target) {
      // If source is Hindi, translate to English. If English, translate to Hindi.
      target = isSourceHindi ? 'English' : 'Hindi';
    }

    // If source is already in target language, return as-is
    if (target === 'Hindi' && isSourceHindi) {
      return { text: trimmed, isTranslated: false, targetLang: 'Hindi' };
    }
    if (target === 'English' && !isSourceHindi && !/[^\x00-\x7F]/.test(trimmed)) {
      // Already English / Latin
      return { text: trimmed, isTranslated: false, targetLang: 'English' };
    }

    // 1. Check custom external endpoint if configured
    if (this.customEndpoint) {
      try {
        const res = await fetch(this.customEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: trimmed, target: target === 'Hindi' ? 'hi' : 'en' })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.translatedText) {
            return {
              text: data.translatedText,
              originalText: trimmed,
              isTranslated: true,
              targetLang: target
            };
          }
        }
      } catch (e) {
        console.warn("[TranslationService] External endpoint failed, falling back to local engine:", e);
      }
    }

    // 2. Client-Side Translation Engine
    const lower = trimmed.toLowerCase();

    if (target === 'Hindi') {
      // English -> Hindi
      if (this.phraseMapEnToHi[lower]) {
        return {
          text: this.phraseMapEnToHi[lower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
      }

      // Check without punctuation
      const cleanLower = lower.replace(/[!?.,]/g, '').trim();
      if (this.phraseMapEnToHi[cleanLower]) {
        return {
          text: this.phraseMapEnToHi[cleanLower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
      }

      // Word-by-word tokenized fallback
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
        return {
          text: translatedWords.join(''),
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'Hindi'
        };
      }

      // Fallback: If no dictionary match, present phrase with Hindi indicator
      return {
        text: `[अनुवाद] ${trimmed}`,
        originalText: trimmed,
        isTranslated: true,
        targetLang: 'Hindi'
      };
    } else {
      // Hindi -> English
      if (this.phraseMapHiToEn[lower]) {
        return {
          text: this.phraseMapHiToEn[lower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
      }

      const cleanLower = lower.replace(/[!?.,|।]/g, '').trim();
      if (this.phraseMapHiToEn[cleanLower]) {
        return {
          text: this.phraseMapHiToEn[cleanLower],
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
      }

      // Word-by-word tokenized fallback
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
        return {
          text: translatedWords.join(''),
          originalText: trimmed,
          isTranslated: true,
          targetLang: 'English'
        };
      }

      return {
        text: `[Translated] ${trimmed}`,
        originalText: trimmed,
        isTranslated: true,
        targetLang: 'English'
      };
    }
  }
}

export const translationService = new TranslationService();

