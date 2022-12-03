import React from "react";

export type AppRoute = {
  route: string;
  name: string;
  component: React.JSXElementConstructor<any>;
};

export type Stepper = {
  name: string;
  id: number;
  step: Step;
  description: string;
};

export const enum Step {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
}
