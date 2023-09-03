import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {Helmet} from "react-helmet";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./singleComicsPage.scss";

import useMarvelComics from "../../services/MarvelComics";

const SingleComicsPage = () => {
  const { comicsID } = useParams();
  const [comics, setComics] = useState(null);
  const { loading, error,clearError, getOneComics } = useMarvelComics();

  useEffect(() => {
    updateComics();
  }, [comicsID]);

  const updateComics = () => {
    clearError();
    getOneComics(comicsID).then(onComicsLoaded);
  };

  const onComicsLoaded = (comics) => {
    setComics(comics);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !comics) ? <View comics={comics} /> : null;

  return (
      <>
        {errorMessage}
        {spinner}
        {content}
      </>


  );
};

const View = ({ comics }) => {

  const { title, description, pageCount, thumbnail, language, prices } = comics;

  return (

    <div className="single-comic">
      <Helmet>
        <meta name="description" content={`${title} comics book`} />
        <title>{title}</title>
      </Helmet>
      <img src={thumbnail} alt={title} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{pageCount}</p>
        <p className="single-comic__descr">Language:{language} </p>
        <div className="single-comic__price">{prices}</div>
      </div>
      <Link to="/comics" className="single-comic__back">
        Back to all
      </Link>
    </div>

  );
};

export default SingleComicsPage;
