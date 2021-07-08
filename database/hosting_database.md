# How to host a postgreSQL database locally using docker

1. Install psql and pgAdmin [here](https://www.postgresql.org/download/)
- `psql` is a command line tool for postgreSQL
- pgAdmin is a GUI tool for postgreSQL

2. Install docker
- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Mac](https://docs.docker.com/docker-for-mac/install/)
- [Linux](https://docs.docker.com/engine/install/ubuntu/)

3. Navigate to the `database` folder, and run `docker compose up -d`
- This will start a docker container running postgres
- Check to see if it working by running `docker ps` and checking for an image running `postgres:latest`

4. Configure the environment variables for the database and server folders
- Need to set a database password in the database folder
- Need to put the same password in the database connection string for prisma

5. Navigate to the `server` folder and run the command `npm i` to install the dependencies

6. Navigate to the `server` folder and run the command `npx prisma migrate dev --name "init"` to create a new SQL migration
- To check that it worked, run `psql -h localhost -p 5432 -U postgres` and use the password defined in the environment variables
- Navigate to the database with `\c mydb`
- List the tables using `\dt`
- If the tables are there, the migration was successful