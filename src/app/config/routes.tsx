import { AppRoute } from "../../types/app.types";
import Home from "../../views/home";

export const ROUTES: AppRoute[] = [
  {
    name: "Home",
    route: "/",
    component: Home,
  },
];
