import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const formatCommentTime = (commentTimestamp) => {
  // Parse the custom timestamp format
  let commentTime = dayjs(commentTimestamp);

  // Apply the time zone offset of -2 hours
  commentTime = commentTime.add(1, 'hour');

  // Get the current time
  const currentTime = dayjs();

  // Calculate the time difference in minutes
  const timeDifference = currentTime.diff(commentTime, 'minute');

  if (timeDifference < 1) {
    return 'Gerade jetzt';
  } else if (timeDifference < 60) {
    return `vor ${timeDifference}m`;
  } else if (timeDifference < 1440) {
    const hours = Math.floor(timeDifference / 60);
    return `vor ${hours}h`;
  } else if (timeDifference < 10080) {
    const days = Math.floor(timeDifference / 1440);
    return `vor ${days}d`;
  } else {
    return commentTime.format('MMM D, YYYY');
  }
};

export const extractTime = (dateTimeString) => {
  let time = dayjs(dateTimeString, 'DD.MM.YYYY HH:mm:ss');

  // Apply the time zone offset of -2 hours
  time = time.add(2, 'hour');
  // Parse the input string into a dayjs object
  const dateTime = dayjs(time, 'DD.MM.YYYY HH:mm:ss');

  // Format and return the time in HH:mm format
  return dateTime.format('HH:mm');
};

export const getDateDescription = (dateString) => {
  const today = dayjs();
  const providedDate = dayjs(dateString, 'DD.MM.YYYY HH:mm:ss');

  if (providedDate.isSame(today, 'day')) {
    return 'TODAY';
  } else if (providedDate.isSame(today.subtract(1, 'day'), 'day')) {
    return 'YESTERDAY';
  } else {
    return providedDate.format('MMM D, YYYY');
  }
};
