import { ChatProvider } from "@/features/chat";
import { AppShell } from "./routes";
import { useAuth } from "@/shared/hooks";

const App = () => {
  const { user } = useAuth();

  return (
    <ChatProvider user={user}>
      <AppShell />
    </ChatProvider>
  );
};

export default App;
