// utils/helper.js
export const getLast7Days = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  let result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    result.push({
      label: days[d.getDay()],
      date: d.toISOString().split("T")[0], // format as YYYY-MM-DD
    });
  }

  return result;
};
