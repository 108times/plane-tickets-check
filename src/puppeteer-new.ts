import puppeteer from "puppeteer";
import fs from "fs-extra";

// Interface for the scraped data
export interface ScrapedData {
  timestamp: string;
  data: DataItem[];
}

type DataItem = {
  date: string;
  price: string;
};

const SITE = "https://www.goindigo.in/book/flight-select.html";

// Function to perform actions on the webpage and extract data
async function visitPageAndStoreData(): Promise<void> {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    // Go to the target page
    await page.goto(SITE, { waitUntil: "networkidle2" });

    const flightModal = await page.$(".flight-modal");

    if (flightModal) {
      await page.click(".flight-modal .flight-close");
    }

    // Read existing data from the file (if any)
    let fileData: ScrapedData[] = [];

    if (await fs.pathExists("data.json")) {
      const existingData = await fs.readFile("data.json", "utf-8");
      fileData = JSON.parse(existingData);
    }

    // // Add the new data with a timestamp
    // fileData.push({
    //   timestamp: new Date().toISOString(),
    //   ...prices,
    // });

    // Save the updated data to the file
    await fs.writeFile("data.json", JSON.stringify(fileData, null, 2));

    // Close the browser
    await browser.close();

    console.log("Data saved successfully.");
  } catch (error) {
    console.error("Error during Puppeteer execution:", error);
  }
}

// Schedule the Puppeteer task to run every 10 minutes
export function schedulePuppeteerTask(): void {
  visitPageAndStoreData(); // Run immediately
  setInterval(visitPageAndStoreData, 600000 * 2); // 600,000 ms = 10 minutes
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// Extract data from the page (customize this as needed)
// const extractedData: ScrapedData = await page.evaluate(() => {
// const heading = document.querySelector('h1')?.innerText || 'No heading found';
// const paragraph = document.querySelector('p')?.innerText || 'No paragraph found';
// return { heading, paragraph };
//   });
