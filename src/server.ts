import app from "./index";
import serverless from "serverless-http";

const PORT = process.env.PORT || 3000;

// Servidor LOCAL
/* app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */

// Express => Lambda
export const handler = serverless(app);
