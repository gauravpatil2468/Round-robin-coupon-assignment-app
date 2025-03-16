interface CouponCardProps {
    code?: string;
    onCodeChange: (index: number, value: string) => void;
    onEdit: () => void;
    index: number;
    type: "view" | "add"; // Differentiate between viewing and adding
    isActive?: boolean; // New prop for status
  }
  
  export default function CouponCard({
    code = "",
    onCodeChange,
    onEdit,
    index,
    type,
    isActive = true, // Default to active
  }: CouponCardProps) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg w-72 flex-shrink-0 m-2">
        <h3 className="text-xl font-semibold mb-2">Coupon {index + 1}</h3>
  
        {type === "add" ? (
          // Add mode - shows input field for entering coupon
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(index, e.target.value)}
            placeholder={`Enter Code ${index + 1}`}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
        ) : (
          // View mode - shows coupon code, active status, edit button
          <div className="">
            <div className="mb-2">
              <span className="font-semibold">Coupon Code:</span> {code || "No code available"}
            </div>
  
            <div className="mb-4 flex items-center">
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-white text-sm font-semibold ${
                  isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
  
            <div className="flex justify-between items-center">
              <button onClick={onEdit} className="text-blue-500 underline">
                Edit
              </button>
              <button onClick={onEdit} className="text-blue-500 underline">
                More Info
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  