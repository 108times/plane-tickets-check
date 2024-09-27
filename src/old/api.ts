import axios from "axios";

const ENDPOINT =
  "https://api-prod-booking-skyplus6e.goindigo.in/v1/getfarecalendar";

export const getFlights = async () => {
  const response = await axios.post(
    ENDPOINT,
    {
      currencyCode: "USD",
      destination: "ALA",
      endDate: "2024-11-18",
      lowestIn: "M",
      origin: "DEL",
      promoCode: "",
      startDate: "2024-10-29",
    },
    {
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization, user_key, Access-Control-Allow-Origin, Dpl, x-datadog-trace-id, x-datadog-parent-id, x-datadog-origin, x-datadog-sampling-priority, traceparent",
        "Access-Control-Allow-Methods":
          "GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, CONNECT",
        "Access-Control-Allow-Origin": "https://www.goindigo.in",
        "Access-Control-Max-Age": "2000",
        "Cache-Control": "max-age=0, no-cache, no-store",
        "Content-Encoding": "gzip",
        "Content-Type": "application/json; charset=utf-8",
        Date: "Fri, 27 Sep 2024 11:56:08 GMT",
        Expires: "Fri, 27 Sep 2024 11:56:08 GMT",
        Pragma: "no-cache",
        "Prod-Aro-Booking": "booking-test",
        "Server-Timing":
          'cdn-cache; desc=MISS, edge; dur=40, origin; dur=176, ak_p; desc="1727438168688_1600416433_12694547_21595_12001_84_0_219";dur=1',
        "Set-Cookie":
          "b70309b4fc34c695d5fe907818b08972=6a4455f9be9d398531d1f424fa2ceebc; path=/; HttpOnly; Secure; SameSite=None, 671ab3f9e0bdb54802fff0d75e9fcfee=857f58e27a53f889112407a5beda74a6; path=/; HttpOnly; Secure; SameSite=None",
        Vary: "Accept-Encoding",
        "X-Akamai-Cache": "NotCacheable from child",
        "X-Apibooking-Grn": "0.b16a645f.1727438168.c1b413",
      },
    }
  );
  console.log("getFlights", response.data);
};
