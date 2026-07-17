export const PLANS = {
  starter: { name: 'Starter', maxRecords: 500000, price: 299 },
  pro: { name: 'Pro', maxRecords: 5000000, price: 799 },
  enterprise: { name: 'Enterprise', maxRecords: Infinity, price: 0 },
}

export const CHUNK_SIZE = 10000
export const PARALLEL_WORKERS = 8
export const BATCH_SIZE = 1000
