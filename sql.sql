CREATE TABLE `cargos` (
	`CargoServico` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`CargoForaServico` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `bateponto` (
	`id` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempo` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`entrou` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempototal` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tempoinc` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`btinit` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`mensagemid` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`horarioformatado` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`cargo` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`idIngame` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci'
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

