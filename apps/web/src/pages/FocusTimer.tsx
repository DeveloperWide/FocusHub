import { useAppSelector } from "../app/hooks";
import FocusSetupModal from "../components/Timer/FocusSetupModal";
import FocusSessionView from "../components/Timer/FocusSessionView";
import { useFocusSession } from "../hooks/useFocusSession";

const FocusTimer = () => {
  const { session, status } = useAppSelector((s) => s.focus);
  useFocusSession();

  return (
    <div className="h-full w-full -m-4">
      {status === "idle" && !session ? (
        <FocusSetupModal />
      ) : (
        <FocusSessionView />
      )}
    </div>
  );
};

export default FocusTimer;
