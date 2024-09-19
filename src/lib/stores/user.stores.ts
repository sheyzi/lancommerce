import type { User } from 'lucia';
import { writable } from 'svelte/store';
import type { UserWithRelations } from '../types/user.types';

export const currentUser = writable<UserWithRelations | null>(null);
