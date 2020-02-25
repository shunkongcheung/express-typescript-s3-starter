## Getting Started

### Prerequisites
* tech stack:
	* typescript
	* express
	* express-validator
	* typeorm
	* aws-sdk (s3)
	* serverless-http
	* serverless
* include:
	* basic entities and orm
	* authentication and user
	* restful CRUD
	* file management
* package managers
	* npm
	* brew (MacOS)
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
* use a database in cloud. visit https://www.elephantsql.com/
* fill in `.env` from the database detail at https://api.elephantsql.com/console/<database-id>/details:
```
TYPEORM_DATABASE=<User & Default database>
TYPEORM_HOST=<Server: e.g.: raja.db.elephantsql.com>
TYPEORM_USERNAME=<User & Default database>
TYPEORM_PASSWORD=<Password>
```

* Run the following command:
```
npm i
npm run build 		# build from typescript
npm run db:run		# database migrations
npm run dev				# start development server
```


## Road MAP
* add restful options to base to show the validators.


## Authors

N/A

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

N/A
