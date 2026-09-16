import "./index.css";
import { EpdLayout } from "./epd-layout/EpdLayout";
import { Interview } from "./Interview";

export function App() {
  return (
    <EpdLayout>
      <Interview />
    </EpdLayout>
  );
}

export default App;
