import React, { useEffect, useState, useMemo } from "react";
import { navigate } from "gatsby";
import { Router } from "@reach/router";
import axios from "axios";
import Layout from "../components/layout";
import Movie from "../components/movie";
import Library from "../components/library";
import UserContext from "../context/user";

const App = props => {
  let [user, setUser] = useState(null);
  let [id, setId] = useState("");

  const context = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    const [_, imdbid] = props["*"].split("/");
    axios
      .get(`/api/v1/users/me`)
      .then(({ data }) => {
        console.log("data:", data);
        setUser(data);
        setId(imdbid);
      })
      .catch(({ response: err }) => {
        console.log("error:", err);
        if (err.status === 403) {
          alert("You must verify your e-mail address before you can log in !");
        }
        navigate("/signin");
      });
  }, []);

  return (
    <>
      {context && (
        <UserContext.Provider value={context}>
          <Layout>
            <Router basepath="/app">
              <Library path="/library" />
              <Movie path={`/movie/${id}`} imdbid={id} />
            </Router>
          </Layout>
        </UserContext.Provider>
      )}
    </>
  );
};

export default App;
