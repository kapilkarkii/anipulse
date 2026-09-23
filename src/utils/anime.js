export const STATUS_LABELS = {
  watching: "Watching",
  completed: "Completed",
  planned: "Planned",
  paused: "Paused"
};

export function getReleaseDetails(dateString, now = Date.now()) {
  if (!dateString) {
    return {
      short: "No upcoming release",
      long: "Release schedule unavailable",
      milliseconds: Number.POSITIVE_INFINITY
    };
  }

  const date = new Date(dateString);
  const difference = date.getTime() - now;
  if (difference <= 0) {
    return {
      short: "Available now",
      long: "A new episode may be available",
      milliseconds: difference
    };
  }

  const hours = Math.floor(difference / 3_600_000);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const short = days > 0 ? `${days}d ${remainingHours}h` : `${Math.max(1, hours)}h`;
  const formatted = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);

  return {
    short,
    long: `Next episode · ${formatted}`,
    milliseconds: difference
  };
}

export function getInitials(title) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
