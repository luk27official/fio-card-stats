import "./ControlPanel.css";
import { Currency } from "../utils/otherUtils";
import { isUsingLiveRates } from "../utils/exchangeRateService";

interface ControlPanelProps {
  hideDuplicates: boolean;
  setHideDuplicates: (value: boolean) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (value: Currency) => void;
}

function ControlPanel({ hideDuplicates, setHideDuplicates, selectedCurrency, setSelectedCurrency }: ControlPanelProps) {
  const liveRates = isUsingLiveRates();

  return (
    <div className="control-panel">
      <div className="control-item">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={hideDuplicates}
            onChange={(e) => setHideDuplicates(e.target.checked)}
            className="toggle-checkbox"
          />
          <span className="toggle-slider"></span>
          <span className="toggle-text">Hide duplicate transactions</span>
        </label>
      </div>

      <div className="control-item">
        <label className="currency-label">
          <span>Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
            className="currency-select"
          >
            <option value="CZK">CZK (Kč)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="PLN">PLN (zł)</option>
          </select>
        </label>
        <span
          className={`exchange-rate-badge ${liveRates ? "live" : "fallback"}`}
          title={liveRates ? "Using live exchange rates" : "Using fallback exchange rates"}
        >
          {liveRates ? "Live rates" : "Fallback rates"}
        </span>
      </div>
    </div>
  );
}

export default ControlPanel;
