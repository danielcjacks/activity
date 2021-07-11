# How to use prisma migrate to setup the database

1. Make sure database is running
- Look at `database_setup.md`

2. Install dependencies
- Goto `server` folder
- Run `npm i`

3. Configure environment variables
- Create a `.env` file based on the `.env.sample` file, substituting the password with the password you defined for the database

4. Run prisma migrate
- Move into the `server` folder
- Run `npx prisma migrate dev --name "init"`

5. Check migration succeeded
- Login to database using `psql -U postgres` then using your password
- Run `\l`
- Change to database using `\c mydb`
- List tables using `\dt`
- Alternatively just run the server and see if the routes work