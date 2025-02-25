import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal, ModalProps } from "antd";
import { createContext, useContext, useState } from "react";

// Định nghĩa interface cho các thuộc tính của Modal
export type CloseModalRes = {
  success?: boolean;
} & any;

export type ModalContentProps = ModalProps & {
  onModalClose: (res?: CloseModalRes) => void;
};
export interface IModal {
  openModal: (content: any, modalProps?: ModalContentProps) => void;
  closeModal: (e: CloseModalRes) => CloseModalRes | null;
}
const initValue: IModal = {
  openModal: () => null,
  closeModal: (e: CloseModalRes) => null,
};
const ModalContext = createContext(initValue);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: any) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalProps, setModalProps] = useState<ModalContentProps | undefined>();

  const openModal = (content: any, modalProps?: ModalContentProps) => {
    setModalContent(content);
    if (modalProps) {
      setModalProps(modalProps);
    }
  };

  const closeModal = (res?: CloseModalRes) => {
    setModalContent(null);
    if (modalProps) {
      modalProps?.onModalClose!(res);
    }
    // setTimeout(() => setModalProps(undefined), 500)
  };

  // Các thuộc tính của Modal Context
  const modalState: IModal = {
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalState}>
      {children}
      <Modal
        open={!!modalContent}
        onCancel={closeModal}
        footer={null}
        destroyOnClose={true}
        maskClosable={false}
        centered={true}
        className="ring-[12px] ring-white/30 rounded-primary"
        closeIcon={<CloseCircleOutlined className="text-xl" />}
        {...modalProps}
        afterClose={() => {
          setModalProps(undefined);
        }}
      >
        <div className="max-h-[85vh] overflow-hidden overflow-y-scroll rounded-primary">
          {modalContent}
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};
