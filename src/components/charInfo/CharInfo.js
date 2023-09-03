import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const {  getCharacter, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }
    clearError();
    getCharacter(charId)
        .then(onCharLoaded)
        .then(()=>setProcess("confirmed"))
    ; // не забывай, что в промис сразу идет в аргумент
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };



  return (
    <div className="char__info">
      {setContent(process,View, char)}
    </div>
  );
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;
  let imageClass = "";
  let imagePath = thumbnail.split("/");
  if (imagePath[imagePath.length - 1] === "image_not_available.jpg") {
    imageClass = "char__basics__noChar";
  }

  return (
    //родительский компонент
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} className={imageClass} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.map((item, i) => {
          //Вариант 1 - if(i>9){return} но если элементов много, лучше не использовать . Все равно грузит
          return (
            <li className="char__comics-item" key={i}>
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CharInfo;
