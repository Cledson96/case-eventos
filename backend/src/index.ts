import { Logger } from "@/shared/utils";

import Server from "./server";

Server.start().catch((error: unknown) => {
  Logger.error("Erro ao iniciar servidor", { error });
  process.exit(1);
});
