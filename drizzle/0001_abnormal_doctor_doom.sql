CREATE TABLE `financialProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creditScore` int NOT NULL,
	`monthlyIncome` int NOT NULL,
	`monthlyExpenses` int NOT NULL,
	`outstandingDebt` int NOT NULL,
	`creditLimit` int NOT NULL,
	`activeLoans` int NOT NULL,
	`missedPayments` int NOT NULL,
	`dtiRatio` decimal(10,4) NOT NULL,
	`utilizationRatio` decimal(10,4) NOT NULL,
	`healthStatus` varchar(20) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financialProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `financialProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`summary` text NOT NULL,
	`steps` json NOT NULL,
	`riskFlags` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scoreHistories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creditScore` int NOT NULL,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoreHistories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `financialProfiles` ADD CONSTRAINT `financialProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scoreHistories` ADD CONSTRAINT `scoreHistories_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;