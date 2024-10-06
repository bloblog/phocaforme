export const timeFormat = (time) => {
    const hours = new Date(time).getHours().toString().padStart(2, "0");
    const minutes = new Date(time).getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

// export default timeFormat;