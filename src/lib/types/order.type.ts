import { Prisma } from '@prisma/client';

export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED'
}

// const orderWithItems = Prisma.validator<Prisma.OrderFindManyArgs>()({
// 	include: {
// 		items: {
// 			include: {
// 				variant: {
// 					include: {
// 						product: {
// 							include: {
// 								category: true,
// 								featuredImage: true
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// });

export type orderWithItems = any;
