import { toast } from 'svelte-sonner';

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

// ... other toast utility functions