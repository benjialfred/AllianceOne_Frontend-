import { create } from 'zustand';

type ModalType = 'newsletter' | 'offer' | 'feature' | 'event';

interface MarketingModalOptions {
  type: ModalType;
  title: string;
  description: string;
  primaryActionText: string;
  onPrimaryAction?: () => void;
  image?: string;
  isDismissible?: boolean;
}

interface MarketingState {
  isOpen: boolean;
  options: MarketingModalOptions | null;
  showModal: (options: MarketingModalOptions) => void;
  closeModal: () => void;
}

export const useMarketingStore = create<MarketingState>((set) => ({
  isOpen: false,
  options: null,
  showModal: (options) => set({ isOpen: true, options }),
  closeModal: () => set({ isOpen: false }),
}));
