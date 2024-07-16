'use strict';

//? 1. Check if the browser supports IndexedDB
indexedDB
	? console.log('IndexedDB is supported')
	: console.warn('IndexedDB is not supported!');

//? 2. Open a database
// - indexedDB.open('Emotions', 1): Opens (or creates) a database named 'Emotions' with version 1.
// - onupgradeneeded: Event triggered if the database needs to be created or upgraded.
// - createObjectStore('data', { keyPath: 'id' }): Creates an object store with a primary key named 'id'.
// - createIndex('name', 'name', { unique: false }): Creates an index on the 'name' property.

let database;
const request = indexedDB.open('Emotions', 1);

request.onupgradeneeded = (event) => {
	database = event.target.result;
	const objectStore = database.createObjectStore('High Energy Pleasant', {
		keyPath: 'id'
	});
	objectStore.createIndex('name', 'name', { unique: false });
};

request.onerror = (event) => {
	console.log('Database failed to open:', event);
};

//? 3. Adding data
// - transaction(['High Energy Pleasant'], 'readwrite'): Creates a read/write transaction for the object store.
// - objectStore.add(data): Adds data to the object store.

function addData(data) {
	if (!database) {
		console.error('Cannot add data: Database is not initialized');
		return;
	}

	const transaction = database.transaction(
		['High Energy Pleasant'],
		'readwrite'
	);
	const objectStore = transaction.objectStore('High Energy Pleasant');
	const request = objectStore.add(data);

	request.onsuccess = () => {
		console.log('Data added successfully');
	};

	request.onerror = (event) => {
		console.error('Failed to add data', event);
	};
}

//? 4. Reading Data
// - transaction(['High Energy Pleasant'], 'readonly'): Creates a read-only transaction.
// - objectStore.get(id): Retrieves data by the primary key.

function readData(id) {
	const transaction = database.transaction(
		['High Energy Pleasant'],
		'readonly'
	);
	const objectStore = transaction.objectStore('High Energy Pleasant');
	const request = objectStore.get(id);

	request.onsuccess = (event) => {
		console.log('Data:', event.target.result);
	};

	request.onerror = (event) => {
		console.error('Failed to get data', event);
	};
}

//? 5. Updating Data
// - objectStore.put(data): Updates data in the object store.

function updateData(data) {
	const transaction = database.transaction(
		['High Energy Pleasant'],
		'readwrite'
	);
	const objectStore = transaction.objectStore('High Energy Pleasant');
	const request = objectStore.put(data);

	request.onsuccess = () => {
		console.log('Data updated successfully');
	};

	request.onerror = (event) => {
		console.error('Failed to update data', event);
	};
}

//? 6. Deleting Data
// - objectStore.delete(id): Deletes data by the primary key.

function deleteData(id) {
	const transaction = database.transaction(
		['High Energy Pleasant'],
		'readwrite'
	);
	const objectStore = transaction.objectStore('High Energy Pleasant');
	const request = objectStore.delete(id);

	request.onsuccess = () => {
		console.log('Data deleted successfully');
	};

	request.onerror = (event) => {
		console.error('Failed to delete data', event);
	};
}

//* THIS IS THE APPLICATION OF INDEXEDDB
request.onsuccess = (event) => {
	database = event.target.result;
	console.log('Database is succesfully opened!');

	//? 3. Add data
	//TODO: Add flag to add only single time
	const flag = localStorage.getItem('flag-add');

	if (!flag) {
		localStorage.setItem('flag-add', 'true');

		addData({ id: 1, name: 'Optimistic' });
		addData({ id: 2, name: 'Challenged' });
		addData({ id: 3, name: 'Ecstastic' });
		addData({ id: 4, name: 'Proud' });
		addData({ id: 5, name: 'Wishful' });
		addData({ id: 6, name: 'Alive' });
	}

	//? 4. Read data
	readData(1);
	readData(2);
	readData(3);
	readData(4);
	readData(5);
	readData(6);

	//? 5. Update data
	updateData({ id: 4, name: 'Happy' });
	// checking if it works by reading it again
	readData(4);

	//? 6. Delete data
	deleteData(1);
	// checking if it works by reading it again
	readData(1); // if console shows "Data: undefined", it worked
};
