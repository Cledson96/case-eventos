import { Router } from "express";

class AppRoutes {
  public readonly router: Router;

  public constructor() {
    this.router = Router();
  }
}

export const appRoutes = new AppRoutes().router;
