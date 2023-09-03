import React, { useState,useEffect } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import {NavLink} from "react-router-dom";
import MarvelService from "../../services/MarvelService";
import * as Yup from "yup";
import "./mainForm.scss";

const MainForm = (props) => {
  const { getCharacterByName, clearError } = MarvelService();

  const [charName, setCharName] = useState([]);

  const searchName = (name) => {
    getCharacterByName(name).then((result) => setCharName(result));

    console.log(charName)
  };

  const notificationBelow = () => {
    if (charName.name && charName.name !== "No such character") {
      return (
          <div className="char__search-wrapper" >
            <div className="char__search-success">There is a character {charName.name}!</div>
        <NavLink className="button button__secondary"  to={`/character/${charName.id}`} >
          <div className="inner">Go to page</div>
        </NavLink>
          </div>
      );
    } else if (charName.name === "No such character") {
      return <div className="char__search-error">There is no such character,try another</div>;
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      onSubmit={(value) => searchName(value.name)}

      validationSchema={Yup.object({
        name: Yup.string().required("Required!"),
      })}
    >
      <Form>
        <div className="char__search-form">
          <label className="char__search-label" htmlFor="name">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field id="name" name="name" type="text" placeholder="enter text"  />
            <div className="buttons_grid">
              <button className="button button__main" type="submit">
                <div className="inner">find</div>
              </button>
            </div>
          </div>
          <ErrorMessage  name="name" render={msg => <div className="char__search-error">{"Please enter some name"}</div>} />
          {notificationBelow()}
        </div>
      </Form>
    </Formik>

  );
};

export default MainForm;
