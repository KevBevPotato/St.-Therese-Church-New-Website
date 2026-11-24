export interface PotluckSignup {
  label: string;
  url: string;
  expiresOn: string;
}

export function getActivePotlucks(
  potlucks: PotluckSignup[],
  today = new Date()
): PotluckSignup[] {
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return potlucks.filter(potluck => potluck.expiresOn > todayKey);
}
