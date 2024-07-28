import dayjs from "dayjs";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { TimeValue } from "@react-types/datepicker";

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

export const now = () => dayjs().toDate();

export const nowThen = () => dayjs();

export const formatTimeLeft = (seconds: number) => {
  const duration = dayjs.duration(seconds, "seconds");
  const minutes = Math.floor(duration.asMinutes());
  const remainingSeconds = duration.seconds();
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

// Convert a Date object to a CalendarDate object
export const fromDateToCalendarDate = (
  value?: Date
): CalendarDate | undefined => {
  if (!value) return undefined;

  const dt = dayjs(value);

  if (!dt.isValid()) return undefined;

  const formattedDate = dt.format("YYYY-MM-DD");
  const parsedDate = parseDate(formattedDate);

  if ("year" in parsedDate && "month" in parsedDate && "day" in parsedDate) {
    return parsedDate as CalendarDate;
  }

  return undefined;
};

// Convert a CalendarDate object to a Date object
export const fromCalendarDateToDate = (
  value?: CalendarDate
): Date | undefined => {
  if (!value) return undefined;

  const dt = dayjs(value.toDate(getLocalTimeZone()));

  if (!dt.isValid()) return undefined;

  return dt.toDate();
};

export const fromTimeToTimeValue = (value?: string): TimeValue | undefined => {
  if (!value) return undefined;

  const dt = dayjs(value, "hh:mm A");

  if (!dt.isValid()) return undefined;

  const convertedTime = {
    hour: dt.hour(),
    minute: dt.minute(),
    second: 0,
    millisecond: 0,
  };

  return convertedTime as TimeValue;
};

export const fromTimeValueToTime = (value?: TimeValue): string | undefined => {
  if (!value) return undefined;

  const { hour, minute } = value;

  const timeString = `${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}`;

  return dayjs(timeString, "hh:mm").format("hh:mm A");
};

export const humanize = (date: string | Date) => dayjs(date).fromNow();
