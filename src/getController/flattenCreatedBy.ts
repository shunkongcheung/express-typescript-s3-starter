const flattenCreatedBy = (inItem: object | Array<any>) => {
  if (Array.isArray(inItem))
    return inItem.map(itm =>
      typeof itm === "object" ? flattenCreatedBy(itm) : itm
    );
  else if (inItem instanceof Date) return inItem;
  else if (typeof inItem !== "object") return inItem;
  else {
    const flatten: { [x: string]: any } = {};
    Object.entries(inItem).map(([key, value]) => {
      if (key === "createdBy") flatten[key] = value?.id ?? "";
      else if (typeof value === "object")
        flatten[key] = flattenCreatedBy(value);
      else flatten[key] = value;
    });
    return flatten;
  }
};

export default flattenCreatedBy;
