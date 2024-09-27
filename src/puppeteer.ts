import puppeteer from "puppeteer";
import fs from "fs-extra";

// Interface for the scraped data
export interface ScrapedData {
  timestamp: string;
  october30: string;
  november16: string;
}

const SITE = "https://www.goindigo.in/";

// Function to perform actions on the webpage and extract data
async function visitPageAndStoreData(): Promise<void> {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the target page
    await page.goto(SITE, { waitUntil: "networkidle2" });

    // Extract data from the page (replace with your own logic)
    // const extractedData = await page.evaluate(() => {
    // });

    await page.click('[aria-label="sourceCity"]');

    await page.waitForSelector(".city-selection");

    await page.waitForSelector('[aria-label="sourceCity"] input');

    await page.type('[aria-label="sourceCity"] input', "Almaty");

    const searchResult = await page.$$eval(
      ".city-selection__list-item-wrapper .body-extra-small-regular",
      (searchResult) =>
        searchResult.filter((item) =>
          item.textContent?.includes("Almaty International Airport")
        )
    );

    // @ts-ignore
    searchResult[0].click();

    await delay(2000);

    await page.waitForSelector('[aria-label="destinationCity"]');

    await page.waitForSelector(".city-selection");

    await page.waitForSelector('[aria-label="destinationCity"] input');

    await page.type('[aria-label="destinationCity"] input', "Delhi");

    const searchResult2 = await page.$$eval(
      ".city-selection__list-item-wrapper .body-extra-small-regular",
      (searchResult) =>
        searchResult.filter((item) =>
          item.textContent?.includes("Indira Gandhi International Airport")
        )
    );

    // @ts-ignore
    searchResult2[0].click();

    await delay(2000);

    await page.click('[aria-label="departureDate"]');

    await page.waitForSelector(".city-selection");

    await page.click(".rdrNextPrevButton");

    const dates = await page.$$eval(".rdrMonth", (searchResult) =>
      searchResult.reduce(
        (result, item) => {
          const key = item
            .querySelector(".rdrMonthName")
            ?.textContent?.includes("October")
            ? "october30"
            : "november16";

          result[key] =
            [...item.querySelectorAll(".rdrDays button")].find(
              (item) => item.querySelector(".date")?.textContent === "16"
            )?.nextElementSibling?.textContent ?? "";

          return result;
        },
        {
          october30: "",
          november16: "",
        }
      )
    );

    // Read existing data from the file (if any)
    let fileData: ScrapedData[] = [];

    if (await fs.pathExists("data.json")) {
      const existingData = await fs.readFile("data.json", "utf-8");
      fileData = JSON.parse(existingData);
    }

    // Add the new data with a timestamp
    fileData.push({
      timestamp: new Date().toISOString(),
      ...dates,
    });

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
