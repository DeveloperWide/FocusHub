// utils/helper.js
export const getLast7Days = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  let result = [];

  const localDayKey = (date) => {
    const tzOffset = date.getTimezoneOffset();
    const shifted = new Date(date.getTime() - tzOffset * 60 * 1000);
    return shifted.toISOString().slice(0, 10);
  };

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    result.push({
      label: days[d.getDay()],
      date: localDayKey(d),
    });
  }

  return result;
};
