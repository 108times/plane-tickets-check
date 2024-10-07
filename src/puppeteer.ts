import puppeteer, { Page } from "puppeteer";
import fs from "fs-extra";

const INDIGO_SITE = "https://www.goindigo.in/";
const TEN_MINUTES_IN_MS = 600000;

// Function to perform actions on the webpage and extract data
export async function visitPageAndStoreData(): Promise<void> {
  try {
    // Launch the browser
    const browser = await puppeteer.launch(/* { headless: true } */);
    const page = await browser.newPage();
    // Go to the target page
    await page.goto(INDIGO_SITE, { waitUntil: "load" });
    await page.setViewport({ width: 1920, height: 1024 });

    const html = await page.$("body");

    console.log({ html });

    await closeFlightModal(page);

    await page.waitForSelector(".bookingmf-container__tabs--content");

    await selectAlmaty(page);

    await delay(2000);

    await selectDeli(page);

    await delay(2000);

    await openDates(page);

    await delay(2000);

    const prices = await extractPrices(page);
    console.log({ prices });
    // Read existing data from the file (if any)
    let fileData: Data[] = [];

    if (await fs.pathExists("data.json")) {
      const existingData = await fs.readFile("data.json", "utf-8");
      fileData = JSON.parse(existingData);
    }

    // Add the new data with a timestamp
    fileData.push(prices);

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
  setInterval(visitPageAndStoreData, TEN_MINUTES_IN_MS * 2); // 600,000 ms = 10 minutes
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export type Data = {
  timestamp: string;
  months: Month[];
};

type Month = {
  name: string | null | undefined;
  days: Day[];
};

type Day = {
  date: string | null | undefined;
  price: string | null | undefined;
};

async function extractPrices(page: Page) {
  const result: Data = {
    timestamp: new Date().toISOString(),
    months: [],
  };

  await page.$$eval(".rdrMonth", (months) => {
    months.forEach((month) => {
      const name = month.querySelector(".rdrMonthName")?.textContent;

      const data: Month = {
        name,
        days: [],
      };

      const days = month.querySelectorAll(".custom-calendar-day");

      days.forEach((day) => {
        const date = day.querySelector(".date")?.textContent;
        const price = day.querySelector(".price")?.textContent;
        const value = { date, price };

        data.days.push(value);
      });

      result.months.push(data);
    });
  });

  return result;
}

async function openDates(page: Page) {
  // await page.click('[aria-label="departureDate"]');
  await page.locator('::-p-aria([aria-label="departureDate"])').click();

  await page.waitForSelector(".city-selection");
}

async function closeFlightModal(page: Page) {
  const flightModal = await page.$(".flight-modal");
  console.log({ flightModal });
  if (flightModal) {
    await page.click(".flight-modal .flight-close");
  }
}

async function selectAlmaty(page: Page) {
  const blocks = await page.$$("search-widget-form-body__from");

  const [sourceCity, destinationCity] = blocks;

  await sourceCity?.click();

  await delay(2000);

  const citySelection = await page.$(".city-selection");
  console.log({ citySelection, sourceCity, blocks });
  await page.waitForSelector(".city-selection");

  const input = await sourceCity.$("input");

  await input?.type("Almaty");

  const firstResult = await page.$(".city-selection__list-item--info");

  // const firstResult = await page.$$eval(
  //   ".city-selection__list-item-wrapper .body-extra-small-regular",
  //   (searchResult) =>
  //     searchResult.find((item) =>
  //       item.textContent?.includes("Almaty International Airport")
  //     )
  // );

  //@ts-ignore
  firstResult?.click();
}

async function selectDeli(page: Page) {
  const destinationCity = await page.$('[aria-label="destinationCity"]');

  await destinationCity?.click();

  await page.waitForSelector(".city-selection");

  await page.type('::-p-aria([aria-label="destinationCity"] input)', "Delhi");

  const destination = await page.$$eval(
    ".city-selection__list-item-wrapper .body-extra-small-regular",
    (searchResult) =>
      searchResult.find((item) =>
        item.textContent?.includes("Indira Gandhi International Airport")
      )
  );

  //@ts-ignore
  destination?.click();

  await delay(2000);
}

// Extract data from the page (customize this as needed)
// const extractedData: ScrapedData = await page.evaluate(() => {
// const heading = document.querySelector('h1')?.innerText || 'No heading found';
// const paragraph = document.querySelector('p')?.innerText || 'No paragraph found';
// return { heading, paragraph };
//   });
