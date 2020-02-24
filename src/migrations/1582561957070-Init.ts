import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1582561957070 implements MigrationInterface {
    name = 'Init1582561957070'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
    }

}
