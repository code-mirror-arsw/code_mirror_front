import Loading from "../loading/loading";
import "./ReconnectingModal.css";

export default function ReconnectingModal() {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Loading />
        <p className="modal-text">Reconectando...</p>
      </div>
    </div>
  );
}
