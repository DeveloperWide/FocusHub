import Skeleton from "react-loading-skeleton";

const TaskSkeleton = () => {
  return (
    <div className="flex items-center justify-between border-l-4 border-gray-300 bg-white border p-4 rounded-xl my-4">
      <div className="flex items-center gap-4">
        {/* priority dot */}
        <Skeleton
          circle
          width={8}
          height={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        <div classNazme="flex flex-col gap-2">
          <Skeleton
            width={60}
            height={10}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
          <Skeleton
            width={180}
            height={16}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton
          width={32}
          height={32}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
        <Skeleton
          width={32}
          height={32}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </div>
  );
};

export default TaskSkeleton;
