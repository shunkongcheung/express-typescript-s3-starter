import moment from "moment";

function getTimeOrTab() {
  const { PRINT_TIME = "" } = process.env;
  if (!PRINT_TIME) return "\n";
  return `${moment().format("YYYY/MM/DD HH:mm:ss")}: `;
}

export default getTimeOrTab;
