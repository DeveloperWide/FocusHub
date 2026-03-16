import { useSelector } from "react-redux";
import FocusSetupModal from "../components/Timer/FocusSetupModal";
import FocusSessionView from "../components/Timer/FocusSessionView";

const FocusTimer = () => {
  const { session, status } = useSelector((s) => s.focus);

  return (
    <div className="h-full w-full -m-4">
      {status === "idle" && !session ? <FocusSetupModal /> : <FocusSessionView />}
    </div>
  );
};

export default FocusTimer;
