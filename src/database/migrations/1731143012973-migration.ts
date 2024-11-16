import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731143012973 implements MigrationInterface {
    name = 'Migration1731143012973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`displayName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz\` (\`id\` varchar(36) NOT NULL, \`quizName\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question\` (\`id\` varchar(36) NOT NULL, \`question\` varchar(255) NOT NULL, \`answer1\` varchar(255) NOT NULL, \`answer2\` varchar(255) NOT NULL, \`answer3\` varchar(255) NOT NULL, \`correctAnswer\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quiz_questions_question\` (\`quizId\` varchar(36) NOT NULL, \`questionId\` varchar(36) NOT NULL, INDEX \`IDX_4a78420f711459e3208a886ba7\` (\`quizId\`), INDEX \`IDX_51ec21f848eef540a431cb2cd3\` (\`questionId\`), PRIMARY KEY (\`quizId\`, \`questionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`quiz\` ADD CONSTRAINT \`FK_52c158a608620611799fd63a927\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_80f29cc01d0bd1644e389cc13be\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions_question\` ADD CONSTRAINT \`FK_4a78420f711459e3208a886ba7a\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`quiz_questions_question\` ADD CONSTRAINT \`FK_51ec21f848eef540a431cb2cd3c\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quiz_questions_question\` DROP FOREIGN KEY \`FK_51ec21f848eef540a431cb2cd3c\``);
        await queryRunner.query(`ALTER TABLE \`quiz_questions_question\` DROP FOREIGN KEY \`FK_4a78420f711459e3208a886ba7a\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_80f29cc01d0bd1644e389cc13be\``);
        await queryRunner.query(`ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_52c158a608620611799fd63a927\``);
        await queryRunner.query(`DROP INDEX \`IDX_51ec21f848eef540a431cb2cd3\` ON \`quiz_questions_question\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a78420f711459e3208a886ba7\` ON \`quiz_questions_question\``);
        await queryRunner.query(`DROP TABLE \`quiz_questions_question\``);
        await queryRunner.query(`DROP TABLE \`question\``);
        await queryRunner.query(`DROP TABLE \`quiz\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
