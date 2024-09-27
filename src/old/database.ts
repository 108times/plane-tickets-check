// import sqlite3 from "sqlite3";
// import { open } from "sqlite";

// // Define the Flight type
// interface Flight {
//   flightNumber: string;
//   price: number;
//   origin: string;
//   destination: string;
//   date: string;
// }

// // Create a new SQLite database (flights.db)
// const dbPromise = open({
//   filename: "./flights.db",
//   driver: sqlite3.Database,
// });

// // Initialize the database and create the flights table if it doesn't exist
// async function initDB() {
//   const db = await dbPromise;
//   await db.run(`
//     CREATE TABLE IF NOT EXISTS flights (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       flight_number TEXT,
//       price REAL,
//       origin TEXT,
//       destination TEXT,
//       date TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `);
// }

// // Save a flight to the database
// async function saveFlight(flight: Flight): Promise<void> {
//   const db = await dbPromise;
//   try {
//     await db.run(
//       `INSERT INTO flights (flight_number, price, origin, destination, date)
//       VALUES (?, ?, ?, ?, ?)`,
//       [
//         flight.flightNumber,
//         flight.price,
//         flight.origin,
//         flight.destination,
//         flight.date,
//       ]
//     );
//     console.log(`Flight ${flight.flightNumber} saved to the database.`);
//   } catch (err) {
//     console.error("Error saving flight:", err);
//   }
// }

// // Exporting the functions
// export { initDB, saveFlight, Flight };
