import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIsbnConstraint1735733461273 implements MigrationInterface {
    name = 'AddUniqueIsbnConstraint1735733461273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7"`);
    }

}
