import './Header.css';

interface HeaderProps {
    onHelpClick: () => void;
    onExampleClick: () => void;
}

function Header({ onHelpClick, onExampleClick }: HeaderProps) {
    return (
        <header className="app-header">
            <h1 className="fancy-header">Fio Card Stats</h1>
            <nav className="nav-links">
                <button onClick={onHelpClick} className="nav-link">
                    Help
                </button>
                <span className="nav-separator">|</span>
                <a href="https://github.com/luk27official/fio-card-stats" target="_blank" rel="noopener noreferrer" className="nav-link">
                    GitHub
                </a>
                <span className="nav-separator">|</span>
                <button onClick={onExampleClick} className="nav-link">
                    Example CSV
                </button>
            </nav>
        </header>
    );
}

export default Header;
