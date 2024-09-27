// import axios from "axios";
// import cron from "node-cron";
// import dotenv from "dotenv";
// import { saveFlight, initDB, Flight } from "./database"; // Import the database functions

// dotenv.config();

// // Flight API details
// const apiKey = process.env.API_KEY as string;
// const origin = "JFK"; // Origin airport code
// const destination = "LAX"; // Destination airport code
// const date = "2024-10-01"; // Travel date

// // Function to fetch flight data
// async function checkFlights(): Promise<void> {
//   try {
//     const response = await axios.get("https://api.example.com/flights", {
//       params: {
//         origin: origin,
//         destination: destination,
//         date: date,
//         apiKey: apiKey,
//       },
//     });

//     const flightData: Flight[] = response.data;

//     console.log(
//       `Found ${flightData.length} flights from ${origin} to ${destination}`
//     );
//     flightData.forEach((flight: Flight) => {
//       console.log(`Flight: ${flight.flightNumber}, Price: ${flight.price}`);
//       saveFlight({
//         flightNumber: flight.flightNumber,
//         price: flight.price,
//         origin: origin,
//         destination: destination,
//         date: date,
//       });
//     });
//   } catch (error) {
//     console.error("Error fetching flight data:", error);
//   }
// }

// // Initialize the database
// initDB().then(() => {
//   console.log("Database initialized.");

//   // Schedule the flight check to run every hour
//   cron.schedule("0 * * * *", () => {
//     console.log("Checking flights at", new Date().toLocaleTimeString());
//     checkFlights();
//   });

//   // Start by checking flights immediately
//   checkFlights();
// });
