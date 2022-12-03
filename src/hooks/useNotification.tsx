import React from "react";
import { toast } from "react-toastify";
import { Text } from "rebass";

type NotificationPropType = {
  title: string | JSX.Element;
  description: string | JSX.Element;
  autoClose?: number | false;
};
const useNotiifcation = () => {
  const notify = React.useCallback(({ title, description, autoClose = 5000 }: NotificationPropType) => {
    return toast(
      <>
        <Text fontFamily={"Roboto Mono"} fontWeight={"bold"} fontSize={14} color={"flash"}>
          {title}
        </Text>
        <Text fontFamily={"Roboto Mono"} fontSize={12} color={"grey"}>
          {description}
        </Text>
      </>,
      { autoClose, className: "app-notification", bodyClassName: "grow-font-size", progressClassName: "fancy-progress-bar" }
    );
  }, []);

  const updateNotify = React.useCallback((notifyRefId: string, { title, description, autoClose }: NotificationPropType) => {
    return toast.update(notifyRefId, {
      autoClose,
      className: "app-notification",
      bodyClassName: "grow-font-size",
      progressClassName: "fancy-progress-bar",
      render: (
        <>
          <Text fontFamily={"Roboto Mono"} fontWeight={"bold"} fontSize={14} color={"flash"}>
            {title}
          </Text>
          <Text fontFamily={"Roboto Mono"} fontSize={12} color={"grey"}>
            {description}
          </Text>
        </>
      ),
    });
  }, []);

  return {
    notify,
    updateNotify,
  };
};

export default useNotiifcation;
