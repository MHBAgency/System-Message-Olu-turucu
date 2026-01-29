import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { PromptPanel } from './components/PromptPanel';

function App() {

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - Left (60%) */}
        <div className="w-[60%] border-r border-gray-800/50">
          <ChatPanel />
        </div>

        {/* Prompt Panel - Right (40%) */}
        <div className="w-[40%]">
          <PromptPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
