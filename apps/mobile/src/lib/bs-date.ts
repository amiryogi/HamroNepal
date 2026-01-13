/**
 * Bikram Sambat (BS) Date Utilities
 *
 * Converts AD dates to BS and formats them in Nepali.
 */

const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const nepaliMonths = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत",
];

// BS calendar data (days in each month for years 2000-2090)
const bsMonthDays: Record<number, number[]> = {
  2080: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2081: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
};

// Reference date: 2080-01-01 BS = 2023-04-14 AD
const refBSDate = { year: 2080, month: 1, day: 1 };
const refADDate = new Date(2023, 3, 14); // April 14, 2023

/**
 * Convert number to Nepali digits
 */
export function toNepaliDigits(num: number | string): string {
  return String(num)
    .split("")
    .map((digit) => {
      const n = parseInt(digit, 10);
      return isNaN(n) ? digit : nepaliDigits[n];
    })
    .join("");
}

/**
 * Get days in a BS month
 */
function getDaysInBSMonth(year: number, month: number): number {
  if (bsMonthDays[year]) {
    return bsMonthDays[year][month - 1] || 30;
  }
  // Default days if year not in lookup table
  return [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30][month - 1] || 30;
}

/**
 * Get total days in a BS year
 */
function getDaysInBSYear(year: number): number {
  if (bsMonthDays[year]) {
    return bsMonthDays[year].reduce((a, b) => a + b, 0);
  }
  return 365;
}

/**
 * Convert AD date to BS date
 */
export function adToBS(adDate: Date): {
  year: number;
  month: number;
  day: number;
} {
  // Calculate days difference from reference
  const diffTime = adDate.getTime() - refADDate.getTime();
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let bsYear = refBSDate.year;
  let bsMonth = refBSDate.month;
  let bsDay = refBSDate.day;

  if (diffDays >= 0) {
    // Forward from reference
    bsDay += diffDays;

    while (bsDay > getDaysInBSMonth(bsYear, bsMonth)) {
      bsDay -= getDaysInBSMonth(bsYear, bsMonth);
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
  } else {
    // Backward from reference
    bsDay += diffDays;

    while (bsDay < 1) {
      bsMonth--;
      if (bsMonth < 1) {
        bsMonth = 12;
        bsYear--;
      }
      bsDay += getDaysInBSMonth(bsYear, bsMonth);
    }
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

/**
 * Format BS date in Nepali
 */
export function formatBSDate(bsDate: {
  year: number;
  month: number;
  day: number;
}): string {
  const day = toNepaliDigits(bsDate.day);
  const month = nepaliMonths[bsDate.month - 1];
  const year = toNepaliDigits(bsDate.year);
  return `${day} ${month} ${year}`;
}

/**
 * Get current BS date string
 */
export function getCurrentBSDateString(): string {
  return formatBSDate(adToBS(new Date()));
}

/**
 * Format relative time in Nepali
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "अहिले";
  if (diffMins < 60) return `${toNepaliDigits(diffMins)} मिनेट अघि`;
  if (diffHours < 24) return `${toNepaliDigits(diffHours)} घण्टा अघि`;
  if (diffDays < 7) return `${toNepaliDigits(diffDays)} दिन अघि`;

  return formatBSDate(adToBS(then));
}

/** AD month names in Nepali */
const adMonthsNepali = [
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

/**
 * Format AD date in Nepali language
 */
export function formatADDateNepali(adDate: Date): string {
  const day = adDate.getDate();
  const month = adDate.getMonth();
  const year = adDate.getFullYear();

  return `${toNepaliDigits(day)} ${adMonthsNepali[month]} ${toNepaliDigits(
    year
  )}`;
}

/** Dual date interface */
export interface DualDate {
  bs: string;
  ad: string;
  relative: string;
}

/**
 * Format date with both BS and AD in Nepali
 */
export function formatDualDate(dateString: string | Date): DualDate {
  const adDate =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const bsDate = adToBS(adDate);

  return {
    bs: formatBSDate(bsDate),
    ad: formatADDateNepali(adDate),
    relative: formatRelativeTime(adDate),
  };
}
