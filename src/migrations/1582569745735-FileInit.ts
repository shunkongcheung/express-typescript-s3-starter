import {MigrationInterface, QueryRunner} from "typeorm";

export class FileInit1582569745735 implements MigrationInterface {
    name = 'FileInit1582569745735'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP, "name" character varying NOT NULL, "fileType" character varying NOT NULL, "s3Key" character varying NOT NULL, "url" text NOT NULL, "createdById" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_d7187ebff85831dd00deaa3e0cc" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_d7187ebff85831dd00deaa3e0cc"`, undefined);
        await queryRunner.query(`DROP TABLE "file"`, undefined);
    }

}
