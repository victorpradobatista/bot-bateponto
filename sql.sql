CREATE TABLE `ban` (
	`id` VARCHAR(50) NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	`staff` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`motivo` VARCHAR(50) NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `bateponto` (
	`id` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempo` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`entrou` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempototal` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempoinc` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`btinit` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `boss` (
	`bossname` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`life` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dificuldade` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`bossimage` VARCHAR(700) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`lastattack` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`vivo` INT(11) NULL DEFAULT NULL
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `coins` (
	`id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`coins` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `economia` (
	`id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dinheiro` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`cooldown` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`vip` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`cooldownRoubo` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `inventario` (
	`id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`item` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`raridade` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`valor` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`image` VARCHAR(700) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`floatid` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`itemid` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `items` (
	`nome` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`raridade` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`valor` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`image` VARCHAR(700) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dano` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`equipavel` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `player` (
	`id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`armaequipada` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dano` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`durabilidade` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`atacou` INT(11) NULL DEFAULT NULL
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `sugestao` (
	`dono` VARCHAR(400) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`sugestao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`votos_sim` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`votos_nao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`idsugestao` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`votos` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `tempo` (
	`user` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempoemcall` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempoagora` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `ticket` (
	`Dono` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Assumiu` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Status` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Type` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`CodigoUnico` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Transcript` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`Canal` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`LinkTranscript` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;