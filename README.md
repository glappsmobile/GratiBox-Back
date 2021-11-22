## Deployment 🚀
You can check the application in production here: [https://gratibox-gules.vercel.app/](https://gratibox-gules.vercel.app/)

### Tooling:
* [ExpressJS](https://expressjs.com/)
* [JavaScript](https://www.javascript.com/)
* [NodeJS](https://nodejs.org/en/about/)
* [PostreSQL](https://www.postgresql.org/)
* [JestJS](https://jestjs.io/)

### Prerequisites
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
* [PostgreSQL](https://www.postgresql.org/)

### Installation
* Clone the backend repository
```sh
git clone https://github.com/glappsmobile/gratibox-back
```
* Clone the frontend repository
```sh
git clone https://github.com/glappsmobile/gratibox
```
* Install NPM packages in frontend AND backend folders
```sh
npm install
```

* Create the dev and test database using PostgreSQL
```sh
CREATE DATABASE gratibox_test;
CREATE DATABASE gratibox_dev;
```

* Import DATABASE.sql to both databases (it's located at the root of the backend repository)
```sh
pg_dump gratibox_dev < path/to/DATABASE.sql
pg_dump gratibox_test < path/to/DATABASE.sql
```

* Put the database information in the [.env.dev](https://github.com/glappsmobile/gratibox-back/blob/main/.env.dev) and [.env.test](https://github.com/glappsmobile/gratibox-back/blob/main/.env.test) files in the backend repository.

### How to run:
To start the development server, run:
```sh
npm run start:dev
```
To start the frontend, run:
```sh
npm start
```
