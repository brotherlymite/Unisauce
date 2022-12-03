import { STEPPER } from "../../../app/config/stepper";
import { Box } from "rebass/styled-components";
import { Step, Stepper as StepperType } from "../../../types/app.types";
import React from "react";

type Props = {
  currentStep: Step;
  changeStep: (step: Step) => void;
};

const Stepper = ({ currentStep, changeStep }: Props) => {
  function handleStepChange(step: StepperType) {
    if (step.step > currentStep) return;
    changeStep(step.step);
  }

  return (
    <>
      {STEPPER.map((step, index) => (
        <React.Fragment key={index}>
          <Box
            onClick={() => handleStepChange(step)}
            color={"white"}
            fontFamily={"Roboto Mono"}
            fontSize={"12px"}
            bg={currentStep >= step.step ? "flash" : "fadedGrey"}
            width={35}
            height={35}
            textAlign={"center"}
            display={"grid"}
            alignContent={"center"}
            opacity={currentStep >= step.step ? 1 : 0.5}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              borderRadius: "10px",
              transition: `1s ease`,
              transitionDelay: `0.04s`,
            }}
          >
            {step.id + 1}
          </Box>
          {step.id !== STEPPER.length - 1 && (
            <Box
              sx={{
                borderRadius: "10px",
                transition: `1s ease`,
                transitionDelay: `0.04s`,
              }}
              mt={15}
              width={"24%"}
              height={3}
              opacity={currentStep > step.step ? 1 : 0.5}
              bg={currentStep > step.step ? "flash" : "fadedGrey"}
            ></Box>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Stepper;
