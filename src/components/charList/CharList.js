import { useState, useEffect, useRef, useMemo } from "react";
import React from "react";
import { Transition } from "react-transition-group";
import PropTypes from "prop-types";
import useMarvelService from "../../services/MarvelService";
import "./charList.scss";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";


const setContent = (process,Component, newItemLoading) => {
  switch (process){
    case "waiting":
      return <Spinner/>
      // не обязательно break раз return
    case "loading":
      return newItemLoading ? <Component/>: <Spinner/>
    case "confirmed":
      return <Component/>;
    case "error":
      return <ErrorMessage/>;
    default:
      throw new Error("Unexpected process state");
  }
}


const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);


  const { loading, error, getAllCharacters, process, setProcess } = useMarvelService();
  // useEffect запускаться после рендера страницы
  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    setNewItemLoading(true);

    getAllCharacters(offset)
        .then(onCharLoaded)
        .then(()=>setProcess("confirmed"))
  };

  const onCharLoaded = (newCharList) => {
    let ended = false;
    if (newCharList < 9) {
      ended = true;
    }
    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  const duration = 500;
  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
  };

  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  function renderAllElements(items) {
    const allItems = items.map((item, i) => {
      let styleChar = "img";
      let imagePath = item.thumbnail.split("/");
      if (imagePath[imagePath.length - 1] === "image_not_available.jpg") {
        styleChar = "char__item__noChar";
      }

      return (
        <li
          className="char__item"
          tabIndex={0}
          key={item.id}
          ref={(el) => (itemRefs.current[i] = el)}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} className={styleChar} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{allItems}</ul>;
  }

  const elememts = useMemo(()=>{
    return setContent(process,()=>renderAllElements(charList),newItemLoading)
  },[process]);

  return (
    <Transition in={!newItemLoading} timeout={duration}>
      {(state) => (
        <div
          className="char__list"
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {elememts}

          <button
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{ display: charEnded ? "none" : "block" }}
            onClick={() => onRequest(offset)}
          >
            <div className="inner">load more</div>
          </button>
        </div>
      )}
    </Transition>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
