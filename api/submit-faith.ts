import { createSubmitHandler } from "./submit.js";

export default createSubmitHandler({
  sheetIdEnvironmentVariable: "GOOGLE_SHEET_ID_FAITH_FORMATION",
  useFirstTab: true,
  faithFormationOnly: true,
});
