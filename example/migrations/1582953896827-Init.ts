import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1582953896827 implements MigrationInterface {
    name = 'Init1582953896827'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "todo" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP, "name" character varying NOT NULL, "content" text NOT NULL, "createdById" integer, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_435d346a98cd4b729a772c35514" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_435d346a98cd4b729a772c35514"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
