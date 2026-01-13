/**
 * Bikram Sambat (BS) Date Utilities
 *
 * Converts between AD and BS dates for Nepali locale.
 */

// Nepali month names
export const BS_MONTHS = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत्र",
];

// Nepali weekday names
export const BS_WEEKDAYS = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
];

// AD month names in Nepali
export const AD_MONTHS_NEPALI = [
  "जनवरी",
  "फेब्रुअरी",
  "मार्च",
  "अप्रिल",
  "मे",
  "जुन",
  "जुलाई",
  "अगस्ट",
  "सेप्टेम्बर",
  "अक्टोबर",
  "नोभेम्बर",
  "डिसेम्बर",
];

// Nepali number conversion
const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toNepaliDigits(num: number | string): string {
  return String(num)
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : NEPALI_DIGITS[digit];
    })
    .join("");
}

// BS calendar data (days in each month for years 2000-2090 BS)
const BS_CALENDAR_DATA: Record<number, number[]> = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2084: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2085: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2086: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2087: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2088: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2089: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2090: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

// Reference date: 2080-01-01 BS = 2023-04-14 AD
const BS_REFERENCE = { year: 2080, month: 1, day: 1 };
const AD_REFERENCE = new Date(2023, 3, 14); // April 14, 2023

interface BSDate {
  year: number;
  month: number;
  day: number;
}

/**
 * Convert AD date to BS date.
 */
export function adToBS(adDate: Date): BSDate {
  // Calculate days from reference
  const diffTime = adDate.getTime() - AD_REFERENCE.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let bsYear = BS_REFERENCE.year;
  let bsMonth = BS_REFERENCE.month;
  let bsDay = BS_REFERENCE.day;

  // Add days
  while (diffDays > 0) {
    const daysInMonth = getDaysInBSMonth(bsYear, bsMonth);
    const remainingDaysInMonth = daysInMonth - bsDay;

    if (diffDays <= remainingDaysInMonth) {
      bsDay += diffDays;
      diffDays = 0;
    } else {
      diffDays -= remainingDaysInMonth + 1;
      bsMonth++;
      bsDay = 1;

      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
  }

  // Subtract days (for dates before reference)
  while (diffDays < 0) {
    bsDay--;
    diffDays++;

    if (bsDay < 1) {
      bsMonth--;
      if (bsMonth < 1) {
        bsMonth = 12;
        bsYear--;
      }
      bsDay = getDaysInBSMonth(bsYear, bsMonth);
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

/**
 * Get days in a BS month.
 */
function getDaysInBSMonth(year: number, month: number): number {
  if (BS_CALENDAR_DATA[year]) {
    return BS_CALENDAR_DATA[year][month - 1];
  }
  // Default to 30 days if year not in data
  return 30;
}

/**
 * Format BS date as Nepali string.
 */
export function formatBSDate(
  bsDate: BSDate,
  format: "full" | "short" = "full"
): string {
  const { year, month, day } = bsDate;

  if (format === "short") {
    return `${toNepaliDigits(year)}-${toNepaliDigits(
      month.toString().padStart(2, "0")
    )}-${toNepaliDigits(day.toString().padStart(2, "0"))}`;
  }

  return `${toNepaliDigits(day)} ${BS_MONTHS[month - 1]}, ${toNepaliDigits(
    year
  )}`;
}

/**
 * Get current BS date.
 */
export function getCurrentBSDate(): BSDate {
  return adToBS(new Date());
}

/**
 * Get current BS date as formatted string.
 */
export function getCurrentBSDateString(
  format: "full" | "short" = "full"
): string {
  return formatBSDate(getCurrentBSDate(), format);
}

/**
 * Format AD date in Nepali language.
 */
export function formatADDateNepali(adDate: Date): string {
  const day = adDate.getDate();
  const month = adDate.getMonth();
  const year = adDate.getFullYear();

  return `${toNepaliDigits(day)} ${AD_MONTHS_NEPALI[month]} ${toNepaliDigits(
    year
  )}`;
}

/**
 * Format date for display with both BS and AD.
 */
export function formatDualDate(adDateString: string | Date): {
  bs: string;
  ad: string;
  relative: string;
} {
  const adDate = new Date(adDateString);
  const bsDate = adToBS(adDate);

  return {
    bs: formatBSDate(bsDate),
    ad: formatADDateNepali(adDate),
    relative: getRelativeTimeNepali(adDateString),
  };
}

/**
 * Get relative time in Nepali.
 */
export function getRelativeTimeNepali(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "भर्खरै";
  if (diffMins < 60) return `${toNepaliDigits(diffMins)} मिनेट अघि`;
  if (diffHours < 24) return `${toNepaliDigits(diffHours)} घण्टा अघि`;
  if (diffDays < 7) return `${toNepaliDigits(diffDays)} दिन अघि`;

  return formatBSDate(adToBS(date));
}
