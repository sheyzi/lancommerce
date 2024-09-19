# Development
**Clone the repository**
```bash
git clone url
```

**Install the dependencies**
```bash
pnpm install
```

**Set up the environment variables**
- Create a `.env` file in the root of the project
- Copy the contents of `example.env` into the `.env` file
- Fill in the environment variables with the correct values


**Run docker compose (OPTIONAL)** 

If you don't have a postgres database running on your local machine, you can create one using docker compose
```bash
docker-compose up -d
```
> Note: The environment variables prefixed with `POSTGRES_` are the credentials that would be used to create the database. You can change them to your preferred values

**Run db migrations and create the prisma client**

Run the following command to create the necessary tables in the database and generate the prisma client
```bash
pnpm db:init
```

**Start the development server**
```bash
pnpm dev
```
