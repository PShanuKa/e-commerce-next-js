const HomePage = () => {
  return (
    <div className="w-full bg-[#EEEFF1] pt-8">
      <Banner />
    </div>
  );
};

export default HomePage;

const Banner = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      {/* <div>

            <img src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772463599/np38ttmrqlirkhmjwchm.jpg" alt="" />
            </div> */}

      <div className="grid grid-cols-4 gap-3 ">
        <div className="col-span-3 grid grid-cols-2 p-10 bg-white h-[400px] items-center">
          <div className="flex  items-center  ">
            <div className="flex flex-wrap gap-5">
              <p className="text-[13px] font-semibold text-orange-500">
                NEW ARRIVALS
              </p>
              <p className="text-[30px]  font-bold text-[var(--font-color-primary)]">
                Sound that goes straight to your soul
              </p>
              <div className="flex items-center gap-2 py-2 px-5 border border-[var(--font-color-secondary)] rounded-[3px]">
                <p className="text-[var(--font-color-secondary)]">Shop Now</p>
              </div>
            </div>
          </div>
          <img
            src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772463599/np38ttmrqlirkhmjwchm.jpg"
            alt=""
          />
        </div>

        <div className="col-span-1 grid grid-flow-row grid-row-2 gap-3">
          <div className="bg-white p-4 flex justify-center items-center">
            <div className="col-span-3 grid grid-cols-5  bg-white  items-center">
              <div className="flex  items-center col-span-3 ">
                <div className="flex flex-wrap gap-1">
                  <p className="text-[11px] font-semibold text-orange-500 uppercase">
                    Wearables
                  </p>
                  <p className="text-[15px]  font-semibold text-[var(--font-color-primary)]">
                   High Resolution Tablets

                  </p>
                  <div className="">
                    <p className="text-[var(--font-color-secondary)]">
                      Shop Now
                    </p>
                  </div>
                </div>
              </div>
              <img
                className="col-span-2"
                src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772463599/np38ttmrqlirkhmjwchm.jpg"
                alt=""
              />
            </div>
          </div>

          <div className="bg-white p-4 flex justify-center items-center">
            <div className="col-span-3 grid grid-cols-5  bg-white  items-center">
              <div className="flex  items-center col-span-3 ">
                <div className="flex flex-wrap gap-1">
                  <p className="text-[11px] font-semibold text-orange-500 uppercase">
                    Tablets
                  </p>
                  <p className="text-[15px]  font-semibold text-[var(--font-color-primary)]">
                   Advanced Banners Module
                  </p>
                  <div className="">
                    <p className="text-[var(--font-color-secondary)]">
                      Shop Now
                    </p>
                  </div>
                </div>
              </div>
              <img
                className="col-span-2"
                src="https://res.cloudinary.com/dldtrjalo/image/upload/v1772463599/np38ttmrqlirkhmjwchm.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
