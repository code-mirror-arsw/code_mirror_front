import Modal from "./Modal";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}
export const ErrorModal = ({ open, message, onClose }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title="❌ Error"
    message={message}
    color="error"
  />
);
