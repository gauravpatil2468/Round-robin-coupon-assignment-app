import { ReactNode } from "react";

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
  disabled = false, // Added disabled prop
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
  disabled?: boolean; // Added disabled prop to the type
}) => {
  return (
    <button
      className={`${
        size === "small"
          ? "text-sm px-6 py-2 min-w-[120px]"
          : "text-lg px-10 py-3 min-w-[150px]"
      } 
      bg-amber-500 text-white cursor-pointer flex items-center justify-center rounded-full 
      hover:shadow-md border transition duration-300 ease-in-out
      w-full sm:w-auto
      ${disabled ? "bg-gray-300 cursor-not-allowed" : ""}
      `}
      onClick={onClick}
      disabled={disabled} // Apply the disabled attribute
    >
      {children}
    </button>
  );
};
