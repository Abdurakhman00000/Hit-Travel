import React, { useEffect, useRef, useState } from "react";
import "./ModalBottom.css";

const ModalBottom = ({ style, open, close, children }) => {
  const modalRef = useRef(null);
  const [startY, setStartY] = useState(null);

  useEffect(() => {
    const modalElement = modalRef.current;

    const handleTouchStart = (e) => {
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (startY !== null) {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 10) {
          modalElement.style.transition = "transform 0.3s ease-in-out";
          modalElement.style.transform = "translateY(100%)";
          setTimeout(() => {
            if (close) {
              if (open) {
                close({ ...open, closeDiv: false });
              } else {
                close(false);
              }
            }
          }, 300);
        }
        setStartY(null);
      }
    };

    modalElement.addEventListener("touchstart", handleTouchStart);
    modalElement.addEventListener("touchmove", handleTouchMove);

    return () => {
      modalElement.removeEventListener("touchstart", handleTouchStart);
      modalElement.removeEventListener("touchmove", handleTouchMove);
    };
  }, [close, startY]);

  return (
    <div className="modal_bottom_home">
      <div
        onClick={() =>
          close
            ? open
              ? close({ ...open, closeDiv: false })
              : close(false)
            : " "
        }
        className="not_modal"
      ></div>
      <div
        style={{
          maxHeight: style === "style" ? "90vh" : "",
          height: style === "style" ? "90vh" : "",
        }}
        ref={modalRef}
        className="modal"
      >
        <div className="container">
          <div className="padding">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalBottom;
