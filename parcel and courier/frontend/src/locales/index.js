import translate from "google-translate-api-x";

// Translate a single text
const res = await translate("Hello world", { to: "fr" });
console.log(res.text); // Bonjour le monde
