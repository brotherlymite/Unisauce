import { Step, Stepper } from "../../types/app.types";

export const STEPPER: Stepper[] = [
  {
    name: "positions",
    step: Step.ONE,
    id: 0,
    description: "View your positions in your account",
  },
  {
    name: "approve",
    id: 1,
    step: Step.TWO,
    description: "Approve aTokens",
  },
  {
    name: "connect_to_account_and_delegate",
    id: 2,
    step: Step.THREE,
    description:
      "Connect to the account you want to move your positions to and provide delegartion",
  },
  {
    name: "review_and_execute",
    id: 3,
    step: Step.FOUR,
    description:
      "Review the positions that would be transfered and execute the transfer",
  },
];
