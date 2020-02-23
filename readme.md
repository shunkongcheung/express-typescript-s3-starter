## Getting Started

### Prerequisites
npm
brew (MacOS)

### Database setup
* install postgres
```
brew install postgres
pg_ctl -D /usr/local/var/postgres start
createdb express_starter
```

* setup user credential
```
psql express_starter
postgres=# CREATE database express_starter;
CREATE DATABASE
postgres=# CREATE user express_starter_user with password 'password';
CREATE ROLE
postgres=# ALTER role express_starter_user set client_encoding to 'utf8';
ALTER ROLE
postgres=# ALTER role express_starter_user set default_transaction_isolation to 'read committed';
ALTER ROLE
postgres=# ALTER role express_starter_user set timezone to 'UTC';
ALTER ROLE
postgres=# GRANT all privileges on database express_starter to express_starter;
GRANT
postgres=# \q
```

### Node

Run the following command:

```
npm i
```

## Road MAP

* add createdAt, createdBy, modifiedAt, enable to base.mod
* add restful options to model.con to show the validators


## Authors

N/A

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

N/A
