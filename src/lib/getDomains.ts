import axios from "axios";

const DOMAIN_LIST_URL =
  "https://raw.githubusercontent.com/NotAestheticallyDucko/stop-the-phishing-domains/main/domains.json";
const CACHE_DURATION = 1000 * 60 * 30;

let cachedDomains: any = null;
let lastFetchTime = 0;

export async function fetchPhishingDomains() {
  if (!cachedDomains || Date.now() - lastFetchTime > CACHE_DURATION) {
    const response = await axios.get(DOMAIN_LIST_URL);
    cachedDomains = response.data.domains;
    lastFetchTime = Date.now();
  }
  return cachedDomains;
}
