import { PencilLine } from "lucide-react";
import ClearIcon from "@mui/icons-material/Clear";

const Buttons = ({ goal, deleteHandler, setEditingGoal }) => {
  return (
    <div className="flex justify-center items-center">
      {/* Click => show input fields with value(title, tag) of this goal */}
      {/* onClick => editMode(!true) */}
      <button
        onClick={() => setEditingGoal(goal)}
        className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
      >
        <PencilLine size={18} />
      </button>

      <button
        onClick={() => deleteHandler(goal.id)}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
      >
        <ClearIcon
          sx={{
            color: "#ef4444",
            fontSize: 20,
            cursor: "pointer",
          }}
        />
      </button>
    </div>
  );
};

export default Buttons;
