// Where fans can send corrections and new sightings.
export const REPO_URL = "https://github.com/pchprojects24/sullivans-crossing-map";
export const ISSUES_URL = `${REPO_URL}/issues`;

// Pre-filled "suggest a correction" link for one location.
export function correctionUrl(locationName: string): string {
  const params = new URLSearchParams({
    template: "location-correction.yml",
    title: `Correction: ${locationName}`,
  });
  return `${ISSUES_URL}/new?${params.toString()}`;
}
