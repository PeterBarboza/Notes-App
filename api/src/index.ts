import { app, apiMainLogger } from "./app"
import { CONFIG } from "./configs"

app.listen(CONFIG.port, () => {
  apiMainLogger(`Server is running on: ${CONFIG.serverHost} | PORT: [${CONFIG.port}]`)
})