import Fuse from "fuse.js";
import { useEffect, useState } from "react";

type SplitText = {
  id: string;
  text: string;
};

// Official Fuse.js documentation: https://fusejs.io/

/* 
Returns a searchable dataset that on search will return the object ids with closest matching text value.

@param items - Objects to fuzzy search.
@param textPath - Dot-delimited string of object property accessors to searchable string property.
@param idPath - Dot-delimited string of object property accessors to unique object identifier.
@return A search function that will return ids of objects with closest match in no particular order.
*/
const useFuzzySearch = (items: object[], textPath: string, idPath: string) => {
  const [fuse, setFuse] = useState<Fuse<SplitText> | null>(null);

  const splitText = (text: string): string[] => {
    return text.split(/[\n|,|.]+/);
  };

  // When prop `items` changes, this effect will reset the dataset used for searching.
  useEffect(() => {
    // Splits text value of an object.
    // Necessary since the length of an entry skews the weights of search results,
    //   e.g. searching a word in a large entry may yield a lower score than in an entry with less text.
    // So making each entry a set of lines and searching on those yields better results.
    const reducer = (acc: SplitText[], o: any) => {
      const splitTexts = splitText(getObjVal(o, textPath)).map((line) => ({
        id: getObjVal(o, idPath),
        text: line,
      }));

      return acc.concat(splitTexts);
    };

    const searchData = items.reduce(reducer, []);
    const options: Fuse.IFuseOptions<SplitText> = {
      keys: ["text"], // Accesses SplitText.text. Searches will look at this value when scoring matches.
      ignoreLocation: true, // Ignore where the pattern happens in a string, e.g. matches don't have to be within 60 characters.
      minMatchCharLength: 1,
      includeScore: true,
    };
    const fuse_ = new Fuse(searchData, options);
    setFuse(fuse_);
  }, [items]);

  // Access object value with dot-delimited string accessor path
  const getObjVal = (item: object, accessorStringPath: string): string => {
    const accessors = accessorStringPath.split(".");
    let currVal: any = item;
    accessors.forEach((a: string) => {
      currVal = currVal[a];
    });

    return currVal;
  };

  // Search dataset and return ids of objects with closest match.
  const search = (text: string): string[] | null => {
    const result = fuse?.search(text);
    console.log("SEARCH RESULT");
    console.log(result);

    if (!result) {
      return null;
    }

    const uniqueIds = new Set(result.map((r) => r.item.id));

    return [...uniqueIds];
  };

  return search;
};

export default useFuzzySearch;
