import { useSelector } from "react-redux";
const Loader = () => {
  const { active, message } = useSelector((state) => state.loader);

  if (!active) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-spinner">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loader-spinner {
          display: flex;
          justify-content: space-between;
          width: 60px;
        }

        .dot {
          width: 15px;
          height: 15px;
          background-color: var(--color-primary);
          border-radius: 50%;
          animation: bounce 0.6s infinite alternate;
        }

        .dot2 {
          animation-delay: 0.2s;
        }
        .dot3 {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
            opacity: 0.6;
          }
          to {
            transform: translateY(-15px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
