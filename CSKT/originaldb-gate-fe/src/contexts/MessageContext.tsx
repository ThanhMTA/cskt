import { message, MessageArgsProps } from "antd";
import { createContext, useContext } from "react";

export type CloseModalRes = {
  success?: boolean;
} & any;

export type ModalContentProps = MessageArgsProps;
export interface IMessage {
  openMessage: (messageProps: MessageArgsProps) => void;
}
const initValue: IMessage = {
  openMessage: () => null,
};

const MessageContext = createContext(initValue);
export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }: any) => {
  const [messageApi, messageContextHolder] = message.useMessage();

  const openMessage = (messageProps: MessageArgsProps) => {
    return messageApi.open({ ...messageProps });
  };

  const messageState: IMessage = {
    openMessage,
  };

  return (
    <MessageContext.Provider value={messageState}>
      {children}
      {messageContextHolder}
    </MessageContext.Provider>
  );
};
