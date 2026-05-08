/*
This helper file has two method for formating dates:
  - formatDateTime: Format including Date and Time
  - formatTime: Format including only Time
  - formatDate: Format including only Date
*/

export const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (isoString) => {
  return new Date(isoString).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
};
