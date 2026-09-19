// common.ts — shared application types
export interface NavTabItem {
  key: string;
  label: string;
  badge?: string;
  active?: boolean;
}

// RESERVED: pending screens (generic header props)
export interface HeaderProps {
  onBack?: () => void;
  title?: string;
}

// RESERVED: pending screens (toast state shape)
export interface ToastState {
  message: string | null;
  visible: boolean;
}

/** A single color stop of a (multi-stop) gradient. */
export interface GradientStop {
  offset: number;
  color: string;
}
