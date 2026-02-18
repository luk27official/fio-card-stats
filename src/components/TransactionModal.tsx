import { FioCSVData } from "../utils/csvUtils";
import "./TransactionModal.css";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: FioCSVData | null;
  itemName: string;
  currentIndex?: number;
  totalTransactions?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function TransactionModal({
  isOpen,
  onClose,
  transaction,
  itemName,
  currentIndex = 0,
  totalTransactions = 1,
  onNext,
  onPrevious,
}: TransactionModalProps) {
  if (!isOpen || !transaction) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Transaction Details {totalTransactions > 1 && `(${currentIndex + 1} of ${totalTransactions})`}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{itemName || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{transaction["Datum"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span
              className="detail-value"
              style={{
                color:
                  transaction["Objem"] && parseFloat(transaction["Objem"].replace(",", ".")) >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {transaction["Objem"] || "N/A"} {transaction["Měna"] || ""}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{transaction["Typ"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Message:</span>
            <span className="detail-value">{transaction["Zpráva pro příjemce"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Note:</span>
            <span className="detail-value">{transaction["Poznámka"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Counter Account:</span>
            <span className="detail-value">{transaction["Protiúčet"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bank Code:</span>
            <span className="detail-value">{transaction["Kód banky"] || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Source Account:</span>
            <span className="detail-value">{transaction["Zdrojový účet"] || "N/A"}</span>
          </div>
        </div>
        {totalTransactions > 1 && (
          <div className="modal-footer">
            <button className="modal-nav-button" onClick={onPrevious} disabled={currentIndex === 0}>
              ← Previous
            </button>
            <button className="modal-nav-button" onClick={onNext} disabled={currentIndex === totalTransactions - 1}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
