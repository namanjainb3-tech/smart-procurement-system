export const normalizeName = (name) => {
    name = name.toLowerCase();
  
    if (name.includes("dish")) return "dishwash";
    if (name.includes("floor")) return "floorcleaner";
    if (name.includes("toothbrush")) return "toothbrush";
    if (name.includes("toothpaste")) return "toothpaste";
    if (name.includes("shampoo")) return "shampoo";
  
    if (name.includes("oil")) return "oil";
    if (name.includes("sugar")) return "sugar";
    if (name.includes("salt")) return "salt";
    if (name.includes("rice")) return "rice";
    if (name.includes("wheat") || name.includes("flour")) return "flour";
    if (name.includes("dal")) return "dal";
  
    if (name.includes("tea")) return "tea";
    if (name.includes("coffee")) return "coffee";
    if (name.includes("milk") || name.includes("cream")) return "milk";
  
    if (name.includes("turmeric")) return "turmeric";
    if (name.includes("masala")) return "masala";
    if (name.includes("chilli")) return "chilli";
  
    if (name.includes("bread")) return "bread";
    if (name.includes("butter")) return "butter";
    if (name.includes("cheese")) return "cheese";
    if (name.includes("egg")) return "eggs";
  
    if (name.includes("biscuit")) return "biscuits";
    if (name.includes("snack")) return "snacks";
    if (name.includes("noodle")) return "noodles";
  
    if (name.includes("lotion")) return "lotion";
    if (name.includes("sanitizer")) return "sanitizer";
    if (name.includes("tissue")) return "tissue";
    if (name.includes("lifebuoy")) return "soap_lifebuoy";
    if (name.includes("lux")) return "soap_lux";
    if (name.includes("soap")) return "soap";

    if (name.includes("cream")) return "cream";
    
      return "other";
    };
  
  export const getItemName = (row) => {
    const keys = Object.keys(row);
  
    for (let key of keys) {
      const lower = key.toLowerCase();
  
      if (
        lower.includes("item") ||
        lower.includes("product") ||
        lower.includes("name") ||
        lower.includes("description")
      ) {
        return row[key];
      }
    }
  
    return null;
  };

  export const getQuantity = (row) => {
    if (row.qty) return row.qty; 
  
    const keys = Object.keys(row);
  
    for (let key of keys) {
      const lower = key.toLowerCase();
  
      if (
        lower.includes("qty") ||
        lower.includes("quantity") ||
        lower.includes("count")
      ) {
        return Number(row[key]) || 1;
      }
    }
  
    return 1;
  };