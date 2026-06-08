import type { Server as HttpServer } from "node:http";

import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { Env } from "@/shared/config";
import {
  errorHandler,
  notFoundHandler,
  requestContext,
  responseFormatter,
} from "@/shared/middlewares";
import { appRoutes } from "@/shared/routes";
import { Logger, httpLogger } from "@/shared/utils";

class App {
  private readonly app: Express;
  private server?: HttpServer;
  private isShuttingDown = false;
  private readonly shutdownTimeoutMs = 10000;

  public constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public start(): void {
    this.server = this.app.listen(Env.port, Env.host, () => {
      Logger.info(`Servidor iniciado em http://${Env.host}:${Env.port}`);
    });

    this.configureGracefulShutdown();
  }

  private initializeMiddlewares(): void {
    this.app.use(requestContext);
    this.app.use(httpLogger);
    this.app.set("trust proxy", 1);
    this.app.disable("x-powered-by");
    this.app.use(
      rateLimit({
        windowMs: Env.rateLimitWindowMs,
        max: Env.rateLimitMax,
        message: "Muitas requisicoes deste IP, tente novamente em 15 minutos.",
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: Env.allowedOrigins,
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type", "Charset", "X-Request-Id"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      })
    );
    this.app.use(express.json({ limit: Env.bodyLimit }));
    this.app.use(express.urlencoded({ extended: false, limit: Env.bodyLimit }));
    this.app.use(responseFormatter);
  }

  private initializeRoutes(): void {
    this.app.get("/livez", (_request: Request, response: Response) => {
      response.success({ status: "alive" }, "API em execucao");
    });

    this.app.get("/readyz", (_request: Request, response: Response) => {
      if (this.isShuttingDown) {
        response.error("API em encerramento", 503);
        return;
      }

      response.success({ status: "ready" }, "API pronta para receber requisicoes");
    });

    this.app.get("/health", (_request: Request, response: Response) => {
      response.success(
        {
          status: "ok",
          uptime: process.uptime(),
          environment: Env.nodeEnv,
        },
        "API funcionando corretamente"
      );
    });

    this.app.use(appRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private configureGracefulShutdown(): void {
    process.on("SIGTERM", () => {
      this.shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      this.shutdown("SIGINT");
    });

    process.on("uncaughtException", (error: Error) => {
      Logger.error("Erro nao capturado", { error });
      this.shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason: unknown) => {
      Logger.error("Promise rejeitada sem tratamento", { reason });
      this.shutdown("unhandledRejection");
    });
  }

  private shutdown(signal: string): void {
    this.isShuttingDown = true;
    Logger.info(`Encerrando servidor: ${signal}`);

    if (!this.server) {
      process.exit(0);
    }

    const shutdownTimeout = setTimeout(() => {
      Logger.error("Timeout ao encerrar servidor HTTP", { signal });
      this.server?.closeIdleConnections?.();
      this.server?.closeAllConnections?.();
      process.exit(1);
    }, this.shutdownTimeoutMs);

    this.server.close((error?: Error) => {
      clearTimeout(shutdownTimeout);

      if (error) {
        Logger.error("Erro ao encerrar servidor HTTP", { error });
        process.exit(1);
      }

      Logger.info("Servidor encerrado com sucesso");
      process.exit(0);
    });
  }
}

export default new App();
