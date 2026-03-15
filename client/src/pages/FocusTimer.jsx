import { useSelector } from "react-redux";
import FocusSetupModal from "../components/Timer/FocusSetupModal";
import FocusSessionView from "../components/Timer/FocusSessionView";
import { useFocusSession } from "../hooks/useFocusSession";

const FocusTimer = () => {
  useFocusSession();
  const { session } = useSelector((s) => s.focus);
  console.log(session);
  return (
    <div className="h-full flex justify-center items-center">
      {!session && <FocusSetupModal />}
      {session && <FocusSessionView />}
    </div>
  );
};

export default FocusTimer;
