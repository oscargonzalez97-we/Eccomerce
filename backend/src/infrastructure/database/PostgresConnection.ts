import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

pool.on("error", (error: Error) => {
  console.error(
    "Error inesperado en el pool de PostgreSQL:",
    error
  );
});

export async function query<
  T extends pg.QueryResultRow = pg.QueryResultRow
>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function testDatabaseConnection(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");

    console.log(
      "✅ Conexión con PostgreSQL establecida"
    );
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}