const timeFormat = (time) => {
  const hours = new Date(time).getHours().toString().padStart(2, "0");
  const minutes = new Date(time).getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const alarmTimeFormat = (time) => {
  if (new Date() == new Date(time)) {
    const hours = new Date(time).getHours().toString().padStart(2, "0");
    const minutes = new Date(time).getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    const month = new Date(time).getMonth();
    const day = new Date(time).getDay();
    return `${month}월 ${day}일`;
  }
};

const currentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export { timeFormat, alarmTimeFormat, currentTime };
