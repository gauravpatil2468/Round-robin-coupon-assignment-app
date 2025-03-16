import { useState } from "react";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { Menu, X } from "lucide-react";

// Define the Button type
interface ButtonProps {
  text: string;
  action: () => void;
}

// Define the Navbar props type
interface NavbarProps {
  button1: ButtonProps;
  button2?: ButtonProps; // button2 is optional
}

const Navbar = ({ button1, button2 }: NavbarProps) => {
  
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  // Function to render dynamic buttons passed as props
  const renderButtons = () => {
    const buttons = [];

    // Render button1 if it's provided
    if (button1) {
      buttons.push(
        <PrimaryButton key="button1" onClick={button1.action}>
          {button1.text}
        </PrimaryButton>
      );
    }

    // Render button2 if it's provided
    if (button2) {
      buttons.push(
        <PrimaryButton key="button2" onClick={button2.action}>
          {button2.text}
        </PrimaryButton>
      );
    }

    return buttons;
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-6 py-3 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* App Name */}
        <div className="text-2xl font-extrabold">CouponApp</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Render dynamic buttons */}
          {renderButtons()}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-3 mt-3 bg-white py-4 border-t">
          {/* Render dynamic buttons for mobile */}
          {renderButtons()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
