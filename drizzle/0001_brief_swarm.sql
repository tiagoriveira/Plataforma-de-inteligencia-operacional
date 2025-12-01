CREATE TABLE `assets` (
	`id` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('MÁQUINA','VEÍCULO','FERRAMENTA','OUTRO') NOT NULL,
	`location` varchar(255) NOT NULL,
	`status` enum('OPERACIONAL','MANUTENÇÃO','CRÍTICO','INATIVO') NOT NULL DEFAULT 'OPERACIONAL',
	`manufacturer` varchar(255),
	`model` varchar(255),
	`serialNumber` varchar(255),
	`year` int,
	`warranty` varchar(255),
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdBy` int,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` varchar(32) NOT NULL,
	`type` enum('CHECKIN','CHECKOUT','INSPECTION','ISSUE','IMPROVEMENT','MAINTENANCE') NOT NULL,
	`operator` varchar(255) NOT NULL,
	`observation` text,
	`photoUrl` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`userId` int,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assets` ADD CONSTRAINT `assets_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_assetId_assets_id_fk` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;