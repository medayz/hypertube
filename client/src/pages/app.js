import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { Router } from "@reach/router";
import axios from "axios";
import Layout from "../components/layout";
import Movie from "../components/movie";
import Library from "../components/library";

const App = props => {
  // let [loggedOn, setLoggedOn] = useState(null);
  let [id, setId] = useState("");

  useEffect(() => {
    console.log("props", props);
    const [_, imdbid] = props["*"].split("/");
    axios
      .get(`/api/v1/users/me`)
      .then(({ data }) => {
        console.log("data:", data);
        setId(imdbid);
        // !["movie", "library"].includes(props.route) && navigate("/app/library");
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
    <Layout>
      <Router basepath="/app">
        <Library path="/library" />
        <Movie path={`/movie/${id}`} imdbid={id} />
      </Router>
    </Layout>
  );
};

export default App;
