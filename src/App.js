import Header from "./components/Header";
import BrideGroom from "./components/BrideGroom";
import Countdown from "./components/CountDown";
import EventTimeline from "./components/EventTimeline";
import RSVP from "./components/RSVP";
import "./App.css";

function App() {
  return (
    <div className="bg-yellow-50 min-h-screen font-sans">
      <Header />
      <BrideGroom />
      <Countdown targetDate="2025-02-18T09:00:00" />
      <EventTimeline />
      <RSVP />
    </div>
  );
}

export default App;
