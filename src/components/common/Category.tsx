export const CategoryCard = ({
  image,
  name,
}: {
  image: string;
  name: string;
}) => {
  return (
    <div className="group col-span-1 bg-white p-4 grid gap-3 rounded-sm border-2 border-transparent hover:border-(--primary-color) transition-all duration-300 cursor-pointer overflow-hidden">
      <img
        src={image}
        alt={name}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="">
        <p className="text-[16px] font-normal text-center text-[var(--font-color-secondary)] group-hover:text-[#256BF2] group-hover:underline transition-colors duration-300">
          {name}
        </p>
      </div>
    </div>
  );
};
