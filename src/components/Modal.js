import ReactDom from 'react-dom';

import '../App.css'

const Modal = ({ 
    open, 
    onClose
 }) => {

if(!open) return null;



    return ReactDom.createPortal(
      <>
        <div className="modal-overlay" onClick={onClose} />
        <div className="modal modal-fade">
          <p className="font-asap text-xl text-center text-green-400 p-3">
            This application is meant to show you your top played artists or tracks from Spotify over the past month of listening history.
          </p>
          <p className="font-asap text-sm text-center text-green-400 p-3">developed by austin wills</p>
        </div>
      </>,
      document.getElementById("portal")
    );
}

export default Modal;