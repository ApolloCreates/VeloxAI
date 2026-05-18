"use client";

export default function StatusTimeline({ status }) {
  const steps = ["pending", "processing", "success"];

  return (
    <div className="flex items-center gap-4 mt-4">

      {steps.map((step, index) => {
        const isActive = steps.indexOf(status) >= index;

        return (
          <div key={index} className="flex items-center gap-2">

            {/* CIRCLE */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm
              ${isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              {isActive ? "✓" : ""}
            </div>

            {/* LABEL */}
            <span className="text-sm capitalize">{step}</span>

            {/* LINE */}
            {index !== steps.length - 1 && (
              <div className="w-8 h-1 bg-gray-300"></div>
            )}

          </div>
        );
      })}

      {/* FAILED STATE */}
      {status === "failed" && (
        <span className="text-red-500 font-bold ml-4">Failed ❌</span>
      )}
    </div>
  );
}