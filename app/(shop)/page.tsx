import Products from "./components/products/page";
import { EmblaCarousel } from "./components/ui/carousel/carousel";
import CategoriesCarousel from "./components/categoriesCarousel/categoriesCarousel";

export default function Page () {
    return (
        <div>
            <EmblaCarousel />
            <CategoriesCarousel />
            <Products />
        </div>
    )
}