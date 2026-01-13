/**
 * Date Display Component
 *
 * Shows dates in BS and AD format with Nepali localization.
 */

import { formatDualDate } from "@/lib/bs-date";

interface DateDisplayProps {
  /** Date string or Date object to display */
  date: string | Date;
  /** Display variant */
  variant?: "full" | "compact" | "relative";
  /** Show both BS and AD dates */
  showBoth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * DateDisplay - Shows dates in Nepali BS/AD format
 *
 * @example
 * <DateDisplay date="2025-12-29" variant="full" showBoth />
 * // Shows: "१४ पुष २०८२ • २९ डिसेम्बर २०२५"
 */
export function DateDisplay({
  date,
  variant = "full",
  showBoth = true,
  className = "",
}: DateDisplayProps) {
  const dualDate = formatDualDate(date);

  if (variant === "relative") {
    return (
      <time
        dateTime={new Date(date).toISOString()}
        className={className}
        title={`${dualDate.bs} (${dualDate.ad})`}
      >
        {dualDate.relative}
      </time>
    );
  }

  if (variant === "compact") {
    return (
      <time
        dateTime={new Date(date).toISOString()}
        className={className}
        title={`${dualDate.bs} • ${dualDate.ad}`}
      >
        {dualDate.bs}
      </time>
    );
  }

  // Full variant
  if (showBoth) {
    return (
      <time dateTime={new Date(date).toISOString()} className={className}>
        <span className="text-gray-900 font-medium">{dualDate.bs}</span>
        <span className="text-gray-500 mx-2">•</span>
        <span className="text-gray-600">{dualDate.ad}</span>
      </time>
    );
  }

  return (
    <time dateTime={new Date(date).toISOString()} className={className}>
      {dualDate.bs}
    </time>
  );
}

/**
 * DateDisplayInline - Compact inline date display
 */
export function DateDisplayInline({
  date,
  className = "",
}: {
  date: string | Date;
  className?: string;
}) {
  return (
    <DateDisplay
      date={date}
      variant="compact"
      showBoth={false}
      className={className}
    />
  );
}

/**
 * RelativeTime - Shows relative time like "३ घण्टा अघि"
 */
export function RelativeTime({
  date,
  className = "",
}: {
  date: string | Date;
  className?: string;
}) {
  const dualDate = formatDualDate(date);

  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={className}
      title={`${dualDate.bs} • ${dualDate.ad}`}
    >
      {dualDate.relative}
    </time>
  );
}
