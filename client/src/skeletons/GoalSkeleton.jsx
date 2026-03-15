import Skeleton from "react-loading-skeleton";

const GoalSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-gray-300 p-4 my-4 rounded-2xl border border-gray-200">
      <div className="flex items-center">
        {/* dot */}
        <Skeleton
          circle
          width={8}
          height={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
          style={{ marginRight: 12 }}
        />

        <div className="flex flex-col">
          <Skeleton
            width={60}
            height={7}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
          <Skeleton
            width={150}
            height={10}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-2">
        <Skeleton
          width={27}
          height={27}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
        <Skeleton
          width={27}
          height={27}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </div>
  );
};

export default GoalSkeleton;
