import { Check, PencilLine } from "lucide-react";
import ClearIcon from "@mui/icons-material/Clear";

// Obj -> task || goal
// setEditing -> setEditingGoal || setEditingTask

const Buttons = ({ obj, deleteHandler, setEditing }) => {
  return (
    <div className="flex justify-center items-center">
      <button className="opacity-0 group-hover:opacity-100 p-2 text-green-500 hover:text-green-600 hover:bg-green-500/30 rounded-lg transition-all duration-200 hover:cursor-pointer">
        <Check />
      </button>
      <button
        onClick={() => setEditing(obj)}
        className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-500/30 rounded-lg transition-all duration-200 hover:cursor-pointer"
      >
        <PencilLine size={18} />
      </button>

      <button
        onClick={() => deleteHandler(obj.id)}
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
