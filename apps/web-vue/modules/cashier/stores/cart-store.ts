import { defineStore } from 'pinia';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    addItem(product: { id: string; name: string; price: number }) {
      const existing = this.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }
    },

    removeItem(productId: string) {
      this.items = this.items.filter((i) => i.productId !== productId);
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((i) => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
