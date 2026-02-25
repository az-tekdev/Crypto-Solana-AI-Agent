import { WalletProvider } from './contexts/WalletContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;
