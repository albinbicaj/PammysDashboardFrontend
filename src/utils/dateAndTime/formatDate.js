// src/utils/formatDate.js
import dayjs from 'dayjs';
import 'dayjs/locale/de'; // import German locale

// Set default locale to German
dayjs.locale('de');

/**
 * Format a date with a given format, defaults to German date format.
 *
 * @param {string|Date} date - The date to format
 * @param {string} [formatStr='DD.MM.YYYY'] - Optional format string
 * @returns {string} - Formatted date
 */
export function formatDate(date, formatStr = 'DD.MM.YYYY') {
  if (!date) return '-';
  return dayjs(date).format(formatStr);
}
