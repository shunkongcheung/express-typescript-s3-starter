## Getting Started

###  Tech stack
* typescript
* express
* express-validator
* typeorm
* aws-sdk (s3)
* serverless-http
* serverless

### Feature
* basic entities and orm
* authentication and user
* restful CRUD
* file management

### Prerequisites
* npm
* postgres (install locally with brew  or use cloud service)
	* use a database in cloud. visit https://www.elephantsql.com/
	* install postgres locally
```
brew install postgres
pg_ctl -D /usr/local/var/postgres start
createdb <database-name>

--------------------------------------------------------------

psql <database-name>
postgres=# CREATE user <username> with password 'password';
CREATE ROLE
postgres=# ALTER role <username> set client_encoding to 'utf8';
ALTER ROLE
postgres=# ALTER role <username> set default_transaction_isolation to 'read committed';
ALTER ROLE
postgres=# ALTER role <username> set timezone to 'UTC';
ALTER ROLE
postgres=# GRANT all privileges on database <database-name> to <username>;
GRANT
postgres=# \q
```

### Environment Variable
* fill in `.env` from the database detail at https://api.elephantsql.com/console/<database-id>/details:

```
TYPEORM_DATABASE=<User & Default database>
TYPEORM_HOST=<Server: e.g.: raja.db.elephantsql.com>
TYPEORM_USERNAME=<User & Default database>
TYPEORM_PASSWORD=<Password>

JWT_SECRET=

S3_BUCKET_NAME=
S3_ACCESS_ID=
S3_SECRET_KEY=

```

### Database connection
* add the following command in package.json

```
  "scripts": {
    "build": "tsc",
    "db:gen": "npm run build && typeorm migration:generate -n",
    "db:run": "npm run build && typeorm migration:run",
    "db:revert": "npm run build && typeorm migration:revert"
  },

```

* add ormconfig.js

```
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  type: "postgres",
  host: process.env.TYPEORM_HOST,
  port: 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  syncchronize: false,
  logging: false,
  entities: ["dist/example/entities/**/*.js"],
  migrations: ["dist/example/migrations/**/*.js"],
  cli: {
    migrationsDir: "example/migrations"
  }
};
```

* add tsconfig.json
```
{
    "compilerOptions": {
        "module": "commonjs",
				"emitDecoratorMetadata": true,
				"experimentalDecorators": true,
        "esModuleInterop": true,
        "target": "es6",
        "noImplicitAny": false,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist-example",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*"
            ]
        }
    },
    "include": [
        "src/**/*"
    ]
}
```


## Usage

### Database
* npm command usage

```
npm run db:gen <FileName>	# generate migration files
npm run db:run		# migrate
npm run db:revert		# revert migration

```

* add a User under `src/entites`

```
import { Column, Entity } from "typeorm";
import { BaseUser } from "shunkongcheung-express-starter";

@Entity()
class User extends BaseUser {
  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;
}

export default User;

```

* add a `Base.ts` file under `src/entities`

```
import { getBaseEntity } from "shunkongcheung-express-starter";
import User from "./User";

const Base = getBaseEntity(User);

export default Base;

```

* to use `/files` route, add the following model at  `src/entities/File.ts`

```
import { Entity } from "typeorm";
import { getFileEntity } from "shunkongcheung-express-starter";
import User from "./User";

const BaseFile = getFileEntity(User);

@Entity()
class File extends BaseFile{}

export default File;

```

* to add any custom model. add a file in `src/entities`. (e.g. `src/entities/Todo.ts`)

```
import { Entity, Column } from "typeorm";
import Base from "./Base";

@Entity()
class Todo extends Base {
  @Column()
  name: string;

  @Column("text")
  content: string;
}

export default Todo;

```

## Express App
### App
* `getExpressApp` returns an object containing `app` and `serverlessHandler`
* two authentication routes are provided: `/auth/login ` and `/auth/register`
* a CRUD route set is provided for file management: `/files`(GET, POST), `/files/:id` (GET, PUT, DELETE)
* interface for `getExpressApp` is as follow:
```
interface Params<UserType extends typeof BaseUser, FileType extends typeof BaseEntity> {
  router: ReturnType<Router>;
  userModel: UserType;
	fileModel?:FileType;
}
```
* router: 		any express router
* userModel:	an entity that extends BaseUser, like the one above
* fileModel:	an entity that extends getFileEntity(User)

### Route
* getController retun an router object. It accepts the following props

```
type Method = "list" | "retrieve" | "create" | "update" | "delete";

export interface Props<
  EntityType extends typeof BaseEntity,
  EntityShape extends BaseEntity
> {
  allowedMethods?: Array<Method>;
  authenticated?: boolean;
  filterEntities?: FilterEntities<EntityType>;
  getEntity?: GetEntity<EntityType>;
  model: EntityType;
  onDelete?: OnDelete<EntityShape>;
  transformCreateData?: TCreateData;
  transformUpdateData?: TUpdateData<EntityShape>;
  userModel: typeof BaseUser;
  validations?: { [x: string]: Array<ValidationChain> };
}

interface Data {
  [x: string]: any;
}

type FilterEntities<T extends typeof BaseEntity> = (
  m: T,
  p: object,
  r: Request
) => Promise<Array<any>>;

type GetEntity<T extends typeof BaseEntity> = (
  model: T,
  req: Request
) => Promise<null | object | Buffer>;

type OnDelete<EntityShape extends BaseEntity> = (
  entity: EntityShape,
  req: Request
) => any;

type TCreateData = (e: Data, r: Request) => Promise<Data | [Data | null, Data]>;

type TUpdateData<T extends BaseEntity> = (
  e: Data,
  r: T
) => Promise<Data | [Data, Data]>;

```

* allowedMethods: 			specify which restful methods is acceptd. default all
* authenticated:				require Header/Authorization equals `Bearer <JWT>`
* filterEntities:				a method that could override the return of list view
* getEntity:						a method that could override the return of detail(retrieve) view
* transformCreateData:	a method that could override the return of create view
* transformUpdate:			a method that could override the return of update view
* onDelete:							a method that will be triggered on delete view
* model:								the model for executing the restful CRUD actions
* validations:					express-validators middleware for each restful methods


## Example
Example can be found in `example`
1. clone the repo by `git clone https://github.com/shunkongcheung/express-starter && cd express-starter`
2. setup `.env` as stated above (at least JWT_SECRET and TYPEORM_*)
3. run the following commands: `npm run db:run && npm run dev`
4. visit the following routes (`/files` is only available with S3 setup):
	* `http://localhost:8000`
	* `http://localhost:8000/auth/register`(POST)
	* `http://localhost:8000/auth/login`(POST)
	* `http://localhost:8000/todos`(GET, POST)
	* `http://localhost:8000/todos/:id`(GET, PUT, DELETE)
	* `http://localhost:8000/files`(GET, POST)
	* `http://localhost:8000/files/:id`(GET, PUT, DELETE)


## Road MAP
* handle different file types for `/files`
* if authenticated, only allow access of object created by the same user


## Authors

Shun Kong Cheung [github](https://github.com/shunkongcheung)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

N/A
