# How to host a PostgreSQL database locally

1. Install PostgreSQL server and tools
- Download installer [here](https://www.postgresql.org/download/)
- On the select componenets screen, select PostgreSQL Server, pgAdmin, and Command Line Tools
- Do not need Stack Builder
- Keep everything else as default
- Make sure you remember your the password you set

2. Start PostgreSQL server
- Find the PostgresSQL data folder
  - Mine was `C:\Program Files\PostgreSQL\13\data`
- Run `postgres -D "<path>"`
  - For me `postgres -D "C:\Program Files\PostgreSQL\13\data"`

3. Connect with `psql` to test that the server is working
- Run `psql -U postgres`
- Use password defined during step 1
- Should be met with a prompt like `postgres=#`
- `\l` to list databases