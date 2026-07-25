import { defineStore } from 'pinia';

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  agreedToTerms: boolean;
}

interface ContactUsState {
  form: ContactForm;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

function emptyForm(): ContactForm {
  return { name: '', email: '', phone: '', message: '', agreedToTerms: false };
}

export const useContactUsStore = defineStore('contact-us', {
  state: (): ContactUsState => ({
    form: emptyForm(),
    submitting: false,
    submitted: false,
    error: null,
  }),

  getters: {
    canSubmit(state): boolean {
      const { name, email, message, agreedToTerms } = state.form;
      return Boolean(name && email && message && agreedToTerms) && !state.submitting;
    },
  },

  actions: {
    /** Placeholder: the real path is a `submitContactEnquiry` mutation. */
    async submit() {
      if (!this.canSubmit) return;
      this.submitting = true;
      this.error = null;
      try {
        this.submitted = true;
        this.form = emptyForm();
      } finally {
        this.submitting = false;
      }
    },

    reset() {
      this.form = emptyForm();
      this.submitting = false;
      this.submitted = false;
      this.error = null;
    },
  },
});
