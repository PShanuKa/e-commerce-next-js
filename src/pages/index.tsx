import { CategoryCard } from "../components/common/Category"
import { ProductCard } from "../components/common/Product"

const Home = () => {
    return (
        <div className=" p-10 bg-[#EEEFF1]">
     
        
        <div className="grid grid-cols-8 gap-3">
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
            <CategoryCard image="https://res.cloudinary.com/dldtrjalo/image/upload/v1772456745/akkgbvfv19aklzrpkujr.jpg" name="Category" />
           
        </div>

         <div className="grid grid-cols-5 gap-3 mt-10">
            <ProductCard  />
            <ProductCard  />
            <ProductCard  />
            <ProductCard  />
            <ProductCard  />
            
           
        </div>













        </div>
    )
}

export default Home