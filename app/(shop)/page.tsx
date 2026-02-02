import Products from "./components/products/page"
import { EmblaCarousel } from "./components/ui/carousel/carousel"

export default function Page () {
    return (
        <div>
            <EmblaCarousel />
            <Products />
        </div>
    )
}