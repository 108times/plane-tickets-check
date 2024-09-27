import puppeteer from "puppeteer";
import fs from "fs-extra";
import express from "express";
import { schedulePuppeteerTask, ScrapedData } from "./puppeteer";

// Express server to read and serve formatted data
const app = express();
const port = 3000;

app.get("/data", async (req, res) => {
  try {
    // Read the stored data from the JSON file
    const data = await fs.readFile("data.json", "utf8");

    // Parse the JSON data
    const jsonData: ScrapedData[] = JSON.parse(data);

    // Format the data (example: format date and structure the response)
    const formattedData = jsonData.map((item) => ({
      timestamp: new Date(item.timestamp).toLocaleString(),
      heading: item.heading.toUpperCase(), // Example: Formatting heading to uppercase
      paragraph: item.paragraph,
    }));

    // Send the formatted data as the response
    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: "Error reading or processing data file" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Start the Puppeteer task
schedulePuppeteerTask();
