import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
})
const connectionPromise = client.connect()

export const getDbClient = async () => {
  await connectionPromise
  return client
}
