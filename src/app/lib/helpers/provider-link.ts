function getProviderLink(
  providerName: string,
  title: string,
  regionCode: string
): string | null {
  const encodedTitle = encodeURIComponent(title);

  switch (providerName) {
    case "Netflix":
      return `https://www.netflix.com/search?q=${encodedTitle}`;
    case "Disney Plus":
      return `https://www.disneyplus.com/search/${encodedTitle}`;
    case "Apple TV":
    case "Apple TV Plus":
      return `https://tv.apple.com/search?term=${encodedTitle}`;
    case "Amazon Prime Video":
      return `https://www.primevideo.com/search?phrase=${encodedTitle}`;
  }

  // Region-specific providers
  if (providerName === "Hulu" && regionCode === "US") {
    return `https://www.hulu.com/search?q=${encodedTitle}`;
  }
  if (providerName === "BBC iPlayer" && regionCode === "GB") {
    return `https://www.bbc.co.uk/iplayer/search?q=${encodedTitle}`;
  }
  if (providerName === "ITVX" && regionCode === "GB") {
    return `https://www.itv.com/search?q=${encodedTitle}`;
  }
  if (providerName === "Crave" && regionCode === "CA") {
    return `https://www.crave.ca/en/search?q=${encodedTitle}`;
  }
  if (providerName === "Neon TV" && regionCode === "NZ") {
    return `https://www.neontv.co.nz/search?search=${encodedTitle}`;
  }
  if (providerName === "Stan" && regionCode === "AU") {
    return `https://www.stan.com.au/search?q=${encodedTitle}`;
  }

  return null;
}

type ProviderOffer = {
  provider_id: number;
  provider_name: string;
  link: string;
  logo_path: string;
  offers: Array<'Rent' | 'Buy' | 'Stream'>;
};

export function transformWatchProviders(
  regionSpecificProviders: any,
  movieTitle: string,
  regionCode: string
): ProviderOffer[] {
  const providersMap = new Map<
    string,
    {
      offers: Set<'Rent' | 'Buy' | 'Stream'>;
      provider_id: number;
      logo_path: string;
    }
  >();

  // Types to check from TMDB
  const tmdbTypes = [
    { key: 'flatrate', label: 'Stream' },
    { key: 'rent', label: 'Rent' },
    { key: 'buy', label: 'Buy' },
  ] as const;

  // Combine all watch types
  for (const { key, label } of tmdbTypes) {
    const entries = regionSpecificProviders?.[key] || [];
    for (const provider of entries) {
      const name = provider.provider_name;
      if (!providersMap.has(name)) {
        providersMap.set(name, {
          offers: new Set<'Rent' | 'Buy' | 'Stream'>(),
          provider_id: provider.provider_id,
          logo_path: provider.logo_path
        });
      }
      providersMap.get(name)!.offers.add(label);
    }
  }

  // Build the result using getProviderLink
  const result: ProviderOffer[] = [];

  for (const [provider_name, { offers, provider_id, logo_path}] of providersMap.entries()) {
    const link = getProviderLink(provider_name, movieTitle, regionCode);
    if (link) {
      result.push({
        provider_id,
        provider_name,
        link,
        logo_path,
        offers: Array.from(offers),
      });
    }
  }

  return result;
}