export const getTime = (date, time) => {
  if (!date) return null;

  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hour = date.getHours();
  var milliSeconds = date.getMilliseconds();
  const timeString = hour + ":" + minutes;

  const secondString = seconds + "." + milliSeconds;
  return time ? hour + ":" + minutes + ":" + seconds : secondString;
};
