export type SearchValues = {
  search: string;
  setSearch: (search: string) => void;
};
                  
export type searchResponse = {
  id: number;
  name: string;
  genre: string;
  author: string;
  available: boolean;
};
