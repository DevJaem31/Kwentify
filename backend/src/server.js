import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});
