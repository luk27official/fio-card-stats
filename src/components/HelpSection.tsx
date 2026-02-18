import "./HelpSection.css";

interface HelpSectionProps {
  onClose: () => void;
}

function HelpSection({ onClose }: HelpSectionProps) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="help-close" onClick={onClose}>
          ×
        </button>
        <h2 className="help-title">How to Use</h2>
        <div className="help-content">
          <section className="help-section">
            <h3>🇬🇧 English</h3>
            <p>
              The usage is simple. Just upload your Fio Card data in CSV format. Then you can categorize your payments
              by selecting the category from the dropdown menu.
            </p>
            <p>
              The categories are saved in local storage so you don't have to categorize them again. Data is neither
              stored nor sent to any server.
            </p>
          </section>
          <section className="help-section">
            <h3>🇨🇿 Čeština</h3>
            <p>
              Použití nástroje je jednoduché. Stačí nahrát data z Fio banky ve formátu CSV. Poté můžete kategorizovat
              platby výběrem kategorie z rozbalovacího menu.
            </p>
            <p>
              Kategorie jsou ukládány v lokálním úložišti, takže je nemusíte znovu kategorizovat. Data nejsou ukládána
              ani odesílána na žádný server.
            </p>
          </section>
        </div>
        <button className="help-back-button" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}

export default HelpSection;
