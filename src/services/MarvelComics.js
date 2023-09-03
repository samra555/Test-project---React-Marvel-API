import { useHttp } from "../hooks/http.hooks";

const useMarvelComics = () => {
  const {  request,  clearError, process, setProcess } =
    useHttp();
  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=9d2ef397697d45f2beeb8c03512d34c0";
  const _baseOffset = 1;

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}comics?offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  };

  const getOneComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (char) => {
    return {
      id: char.id,
      title: char.title,
      description: char.description || "There is no description",
      pageCount: char.pageCount ? `${char.pageCount} p.` : "No information",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      language: char.textObjects.language || "en-us",
      prices: char.prices[0].price > 0 ? char.prices[0].price : "",
    };
  };

  return {
    getAllComics,
    clearError,
    process,
    setProcess,
    getOneComics,
  };
};

export default useMarvelComics;
