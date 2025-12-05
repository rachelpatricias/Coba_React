export const formatToAMPM = (time) => {
  if (!time || typeof time !== "string") return "-";

  const [hour, minute] = time.split(":");
  if (!hour || !minute) return "-";

  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return `${h}:${minute} ${ampm}`;
};
