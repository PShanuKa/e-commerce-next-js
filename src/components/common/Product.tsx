import { MdAddShoppingCart } from "react-icons/md";

export const ProductCard = () => {
  return (
    <div className="bg-white">
      <div className=" rounded-sm p-4">
        <div className="flex justify-end">
          <div className="bg-[#E8F0FF] p-1 rounded-sm border border-[#1A59D8] px-2">
            <p className="text-[12px] font-normal text-[#1A59D8]">New</p>
          </div>
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg"
            alt=""
          />
        </div>
        <div className="mt-2">
          <h1 className="text-[11px] font-normal text-[#5D6163] underline">
            Ginneys
          </h1>
          <h1 className="text-[14px] font-normal text-[#5D6163]">
            Noise-Cancelling Headphones
          </h1>

          <h1 className="text-[14px] font-semibold">Rs 100.00</h1>
        </div>
      </div>
      <div className="border-t border-[#E3E4E4] p-4">
        <div className="flex items-center gap-2">
          <MdAddShoppingCart className="text-[#5D6163]" />
          <p className="text-[13px] font-normal text-[#5D6163]">Add to Cart</p>
        </div>
      </div>
    </div>
  );
};
