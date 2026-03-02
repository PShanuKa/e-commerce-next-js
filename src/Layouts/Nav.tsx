import { GrCart } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { RiTelegram2Line } from "react-icons/ri";

const Navbar = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto py-5 flex justify-between items-center gap-5 ">
        <img
          src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772459447/u802hted1wvhkinubocz.png"
          alt=""
        />
        <div className="flex flex-1 max-w-[650px]">
          <div className="bg-[var(--primary-color)] py-2 px-5  h-[40px] rounded-l-[3px] justify-center items-center flex gap-1">
            <p className="text-white">All</p>
            <FaAngleDown className="text-white" />
          </div>
          <div className="bg-[var(--primary-color)] flex-1 p-0.5 h-[40px]  justify-center items-center flex">
            <input
              type="text"
              className="w-full h-full bg-white border-none outline-none px-4"
              placeholder="Search here..."
            />
          </div>
          <div className="bg-[var(--primary-color)] p-2 w-[40px] h-[40px] rounded-r-[3px] justify-center items-center flex">
            <IoSearch className="text-white" />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center ">
            <AiOutlineUser className="text-[20px]" />
            <p className="text-[11px] text-[var(--font-color-secondary)]">
              Account
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p>0 item(s)-Rs0.00</p>
            <div className="bg-[var(--primary-color)] p-2 w-[40px] h-[40px] rounded-[3px] justify-center items-center flex">
              <GrCart className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-[var(--primary-color)]  ">
        <div className="max-w-7xl mx-auto flex justify-between ">

        <div className="  h-[50px] flex py-1 gap-5 w-full">
          <div className="bg-[var(--secondary-color)] p-2 rounded-[3px] flex items-center gap-2 pr-20">
            <HiOutlineMenuAlt2 /> <p className="text-[13px]">All Departments</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <p className="text-white text-[13px]">Mega Menu</p>
              <FaAngleDown className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-white text-[13px]">Sale</p>
              <FaAngleDown className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-white text-[13px]">Multi Level</p>
              <FaAngleDown className="text-white" />
            </div>{" "}
          </div>
        </div>
        <div className=" w-[300px] h-[50px] flex py-1 gap-5 justify-end">
          <div className="flex items-center gap-2">
           
            <div className="flex items-center gap-2">
              <p className="text-white text-[13px]">About Us</p>
          
            </div>{" "}
          </div>
          <div className="bg-[var(--secondary-color)] p-2 rounded-[3px] flex items-center gap-2 px-3">
            <RiTelegram2Line /> <p className="text-[13px]">Contact Us</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
