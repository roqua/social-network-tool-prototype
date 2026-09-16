import "./index.css";
import { EpdLayout } from "./epd-layout/EpdLayout";
import { Interview } from "./Interview";
import { OpenQuestions } from "./OpenQuestions";

// Two pages, no router: the interview at / and the researcher's question
// list at /vragen. Vercel rewrites every path to index.html.
export function App() {
  const page = window.location.pathname === "/vragen" ? <OpenQuestions /> : <Interview />;
  return <EpdLayout>{page}</EpdLayout>;
}

export default App;
