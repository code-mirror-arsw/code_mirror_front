import Modal from "./Modal";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}
export const SuccessModal = ({ open, message, onClose }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title="✅ Éxito"
    message={message}
    color="success"
  />
);