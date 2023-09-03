import { useHttp } from "../hooks/http.hooks";

const useMarvelService = () => {
  const {  request,  clearError, process,setProcess } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/"; // не повторяйся
  const _apiKey = "apikey=9d2ef397697d45f2beeb8c03512d34c0";
  const _baseOffset = 210;

  //https://gateway.marvel.com:443/v1/public/characters?name=LOKI&apikey=9d2ef397697d45f2beeb8c03512d34c0

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };
  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getSingleCharacter =async (id)=>{
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformSingleCharacter(res.data.results[0]);

  }

  const getCharacterByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    return _transformCharName(res.data);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : "There is no description for this character",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics:
        char.comics.items.length >= 10
          ? char.comics.items.slice(0, 10)
          : char.comics.items.length < 10
          ? [{ name: "Нет доступных комиксов с этим персонажем" }]
          : char.comics.items,
    };
  };

  const _transformSingleCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}`
        : "There is no description for this character",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
    };
  };

  const _transformCharName = (char) => {
    if (!char.results[0]) {
      return { name: "No such character" };
    }
    return {
      id: char.results[0].id,
      name: char.results[0].name,
    };
  };

  return {
    getAllCharacters,
    getCharacter,
    clearError,
    process,
    setProcess,
    getCharacterByName,
    getSingleCharacter,

  };
};

export default useMarvelService;
