import moment from "moment-timezone";

 const formatBrasiliaDate = (date: Date): string => {
  return moment(date).tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
};

export default formatBrasiliaDate;