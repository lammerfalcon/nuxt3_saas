DROP INDEX IF EXISTS `payments_order_id_unique`;--> statement-breakpoint
ALTER TABLE `payments` ADD `payment_id` text NOT NULL;