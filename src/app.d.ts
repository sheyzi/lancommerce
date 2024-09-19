// See https://kit.svelte.dev/docs/types#app

import type { Address } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
			firstName?: string;
			lastName?: string;
			addresses?: Address[];
			role: Role;
		};
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
