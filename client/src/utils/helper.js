export const checkInputValue = (inputVal, setTask, setInputValue) => {
    if (inputVal != "" && inputVal.length > 0) {
        setTask(inputVal);
        setInputValue("")
    } else {
        isValue = false;
        toast.info("Write Task Name")
    }
}


export const updateTimer = (num, onChange , setInputValue) => {
    if (num >= 1) {
      onChange(num);
      setInputValue(""); // reset input
    }
  }

// utils/helper.js
export const getLast7Days = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  let result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    result.push({
      label: days[d.getDay()],
      date: d.toISOString().split("T")[0] // format as YYYY-MM-DD
    });
  }

  return result;
};

