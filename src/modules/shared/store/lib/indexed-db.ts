const DB_NAME = "game-engine-db";
const DB_VERSION = 1;

export const STORES = {
	DATA: "campaign_data",
	ASSETS: "campaign_assets",
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

const db = (() => {
	let instance: IDBDatabase;

	return {
		get: async () => {
			if (instance) return instance;

			return new Promise<IDBDatabase>((resolve, reject) => {
				const request = indexedDB.open(DB_NAME, DB_VERSION);

				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);

				request.onupgradeneeded = (event) => {
					const target = event.target as IDBOpenDBRequest;
					const database = target.result;

					// Create our two distinct stores
					if (!database.objectStoreNames.contains(STORES.DATA)) {
						database.createObjectStore(STORES.DATA);
					}
					if (!database.objectStoreNames.contains(STORES.ASSETS)) {
						database.createObjectStore(STORES.ASSETS);
					}
				};
			}).then((database) => {
				instance = database;
				return database;
			});
		},
	};
})();

// Helper to wrap transactions
async function getTransaction(
	storeName: StoreName,
	mode: IDBTransactionMode = "readonly",
) {
	const database = await db.get();
	return database.transaction(storeName, mode);
}

// --- CORE API ---

export async function get<T>(
	storeName: StoreName,
	key: string,
): Promise<T | undefined> {
	const transaction = await getTransaction(storeName);
	const store = transaction.objectStore(storeName);
	const request = store.get(key);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function set<T>(
	storeName: StoreName,
	key: string,
	value: T,
): Promise<void> {
	const transaction = await getTransaction(storeName, "readwrite");
	const store = transaction.objectStore(storeName);
	store.put(value, key);

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

export async function del(storeName: StoreName, key: string): Promise<void> {
	const transaction = await getTransaction(storeName, "readwrite");
	const store = transaction.objectStore(storeName);
	store.delete(key);

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

export async function getAll<T>(storeName: StoreName): Promise<T[]> {
	const transaction = await getTransaction(storeName);
	const store = transaction.objectStore(storeName);
	const request = store.getAll();

	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
