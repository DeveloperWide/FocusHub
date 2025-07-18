import { useEffect, useRef, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const TaskSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef(null);

  useEffect(() => {
    const el = detailsRef.current;
    const toggle = () => setOpen(el.open);
    el.addEventListener('toggle', toggle);

    return () => {
      el.removeEventListener('toggle', toggle);
    };
  }, []);

  return (
    <details ref={detailsRef} className="mb-2 ">
      <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer font-medium bg-gray-100 hover:bg-gray-200 rounded">
        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        {title}
      </summary>
      <div className="px-4 py-2">{children}</div>
    </details>
  );
};

export default TaskSection;
