export const checkInputValue = (inputVal, setTask, setInputValue) => {
    if (inputVal != "" && inputVal.length > 0) {
        setTask(inputVal);
        setInputValue("")
    } else {
        toast.info("Write Task Name")
    }
}


export const updateTimer = (num, onChange , setInputValue) => {
    if (num >= 1) {
      onChange(num);
      setInputValue(""); // reset input
    }
  }