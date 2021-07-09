# How to host a PostgreSQL database locally

1. Install PostgreSQL server and tools
- Download installer [here](https://www.postgresql.org/download/)
- On the select componenets screen, select PostgreSQL Server, pgAdmin, and Command Line Tools
- Do not need Stack Builder
- Keep everything else as default
- Make sure you remember your the password you set

2. Add PostgreSQL to path
- Find PostgreSQL bin folder
  - Mine was `C:\Program Files\PostgreSQL\13\bin`
- On windows search `path` in windows search
- Click `edit system environment variables`
- Click `environment variables`
- Under `system variables`, click `Path`
- Click `edit`
- Click `new` and paste in the bin folder path
- Hit `Ok` all the way down

3. Start PostgreSQL server
- Find the PostgresSQL data folder
  - Mine was `C:\Program Files\PostgreSQL\13\data`
- Run `postgres -D "<path>"`
  - For me `postgres -D "C:\Program Files\PostgreSQL\13\data"`
- If the program terminates, something went wrong
- You want the program to not terminate after the command
- Sometimes it terminates, and I have no idea why, but I just messed around with it until it eventually didn't terminate

4. Connect with `psql` to test that the server is working
- Run `psql -U postgres`
- Use password defined during step 1
- Should be met with a prompt like `postgres=#`
- `\l` to list databases

5. To stop server, hit `Ctrl C` in the terminal window that is running the server

6. To start the server, run the `postgres -D "<path>"` command again, and if it doesn't terminate, it should be running