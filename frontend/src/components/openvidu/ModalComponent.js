import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalComponent = ({ isOpen, onRequestClose, onAccept, onReject }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="친구 요청"
    className="Modal"
    overlayClassName="Overlay"
  >
    <h2>친구 요청</h2>
    <p>상대방과 친구가 되고 싶으신가요?</p>
    <button onClick={onAccept} className="btn btn-success">네</button>
    <button onClick={onReject} className="btn btn-danger">아니오</button>
  </Modal>
);

export default ModalComponent;
