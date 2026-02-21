import { BasketItem } from "../context/basketProvider/basketProvider";

export function serializeItem(item: any) {
  return {
    ...item,
    _id: item._id.toString(),
    categoryId: item.categoryId?._id?.toString(),
    categoryName: item.categoryId?.name.toString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}

export function serializeCategory(category: any) {
  return {
    ...category,
    _id: category._id.toString(),
    createdAt: category.createdAt?.toISOString(),
    updatedAt: category.updatedAt?.toISOString(),
    items: category.items?.map((itm:any) => ({
      ...itm,
      _id: itm._id.toString(),
      categoryId: itm.categoryId.toString(),
      category: category.name,
      createdAt: itm.createdAt?.toISOString(),
      updatedAt: itm.updatedAt?.toISOString(),
    })) ?? [],
  };
}

export function calculateTotal(basket:BasketItem[]){
  return basket.reduce((acc, itm) => {
      const price = itm.item.prices?.discounted ?? 0 > 0 ? 
          itm.item.prices?.discounted : itm.item.prices?.base;
      
          return acc + price! * itm.quantity
  }, 0)
}

export function formateDatTime (value:string): string | null {
    if (!value) return null;

    const newDate = new Date(value);
    return `${newDate.toDateString()} ${newDate.toLocaleTimeString()}`;
}

export function getCurrencySymbol (currencyCode:string, locale='en') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  .format(0)
  .replace(/[0-9\s.,]/g, '');
}
