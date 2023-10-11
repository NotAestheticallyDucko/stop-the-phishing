// src/lib/isPhishing.ts
import { fetchPhishingDomains } from "./getDomains";

const CACHE_DURATION = 1000 * 60 * 30;

let cachedDomains: string[] | null = null;
let lastFetchTime = 0;

async function updateCache() {
  if (!cachedDomains || Date.now() - lastFetchTime > CACHE_DURATION) {
    cachedDomains = await fetchPhishingDomains();
    lastFetchTime = Date.now();
  }
}

export async function isPhishing(input: string): Promise<boolean> {
  if (!input) {
    return false;
  }

  await updateCache();

  console.log("Cached Domains:", cachedDomains);

  function checkDomain(domainToCheck: string): boolean {
    return cachedDomains!.some((domain) => domainToCheck.includes(domain));
  }

  function domainsChecker(arg: string): boolean {
    return checkDomain(arg);
  }

  const regex =
    /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?([a-z\.\-]+\.[a-z\.]+[^\s]*)/gi;
  const domainsArgs: string[] = [];
  let m;

  while ((m = regex.exec(input.toLowerCase())) !== null) {
    domainsArgs.push(m[1]);
  }

  console.log("Input Domains:", domainsArgs);

  return domainsArgs.some(domainsChecker);
}
