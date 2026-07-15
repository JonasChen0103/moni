import PocketBase from 'pocketbase'

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(PB_URL)

pb.autoCancellation(false)

export async function syncToRemote(collection: string, records: Array<Record<string, unknown>>) {
  if (!pb.authStore.isValid) return

  for (const record of records) {
    const id = record.id as string
    try {
      await pb.collection(collection).update(id, record)
    } catch {
      try {
        await pb.collection(collection).create({ ...record, id })
      } catch {
        // conflict — remote wins on next pull
      }
    }
  }
}

export async function pullFromRemote<T>(collection: string): Promise<T[]> {
  if (!pb.authStore.isValid) return []

  try {
    const result = await pb.collection(collection).getFullList<T>()
    return result
  } catch {
    return []
  }
}
