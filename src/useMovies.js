import { useEffect, useState } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const key = "e661ac59";

  // the below useEffect will render on dependeceny on query
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchmovies() {
        try {
          setLoading(true);
          setError("");
          // before getting the data to make Loader visible making Loader visible
          //key will be get by registering on omdb api and query is nothing but movie name
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );

          // if the response is not ok while fetching the api will throw the error to catch so that would get display
          if (!res.ok) throw new Error("Something went wrong fethcing movies");

          // parse the data recived from json
          const data = await res.json();

          // if for the wrong movie name will get false response then send as movie not found to the throw
          if (data.Response === "False") throw new Error("Movie Not Found");

          // this will array of object data api is send to setmovie will append the data to the movies list and which will get displayed
          setMovies(data.Search);
          setError("");

          // once fetch compledted set loader back to false again
          setLoading(false);
        } catch (err) {
          // set the err and accordingly the message
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          // once error occur  set loader back to false again
          setLoading(false);
        }
      }
      // if the movie name less than three character then set to default and return else if greater then fetch the data
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //  calling the useEffect function
      fetchmovies();
      // this will close the earlier movie showing in watch movie box
      //   handleclosemovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return [movies, isLoading, error];
}
