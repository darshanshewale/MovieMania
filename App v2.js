import { useEffect, useState } from "react";
import StarRating from "./starrating";

// this include tempdata of movies

//learning diifing rules,key props rules, useeffect
//behind rendering process component-instance-dom-reactelement-browser
//render1updatedelete->render2commit->state update batching->browser paint

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

// this include tempwatched data of movies

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "e661ac59";

export default function App() {
  // this will Search the movie
  const [query, setQuery] = useState("");
  //this will display list of movie at inital pass tempmoviedata array of object
  const [movies, setMovies] = useState(tempMovieData);
  //this will display list of movie watched
  const [watched, setWatched] = useState([]);
  //this will be used when we need to Loading while fetching is not done through API
  const [isLoading, setLoading] = useState(false);
  //this will be used to display error while fetching the movie
  const [error, setError] = useState("");
  //used for diplay more about the movie list so need to fetch api again for onclickmovied id
  const [selectedId, setSelectedId] = useState("");

  //this is for test purpose can enter movie name
  const tempQuery = "";

  // this will be used to selected the movieid on which clicked on listed movie
  function handleselectmovie(id) {
    // clicked on same movie then set id back to null
    setSelectedId((selectedId) => (id === selectedId ? null : id));
    // setSelectedId(id);
  }

  //which on clicking arrow button this will set id as null will not display the movie details
  function handleclosemovie() {
    setSelectedId(null);
  }

  // this will append the selected movie in watched movie array as we click on add to list button
  function handlewatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  //this will help to delete the movie form watched list display only apart from deleted selected id

  function handledeletewatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
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
        setMovies(tempMovieData);
        setError("");
        return;
      }
      //  calling the useEffect function
      fetchmovies();
      // this will close the earlier movie showing in watch movie box
      handleclosemovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        {/* Nav bar consist Logo search and total movie for search result  send as children prop to nav component*/}
        <Logo />

        {/* search component is used to search the movie passed  query and setquery as prop to the component */}
        <Search query={query} setQuery={setQuery} />
        {/* this will calculate the number will get for search query */}
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? (
            <Loader />
          ) : (
            <MovieList movies={movies} key={movies.imdbID} />
          )} */}
          {/* this will display the loader if Loader is true */}
          {isLoading && <Loader />}
          {/* if Loader is end and Not having error as well then display movie */}
          {!isLoading && !error && (
            <MovieList movies={movies} onselectmovie={handleselectmovie} />
          )}
          {/* if error comes then show the error message by sending the error as message prop  */}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <>
            {/* if having selected id then show movie details  */}
            {selectedId ? (
              // below send the selected , onclose will set the selectedid as null and onhandlewatch will set watched array of object to watch state
              <MovieDetails
                selectedId={selectedId}
                onclosemovie={handleclosemovie}
                onhandlewatch={handlewatch}
                // watched will compare if movie is already added to watch and given the rating
                watched={watched}
              />
            ) : (
              <>
                {/* this will display details as per movie added to watched  */}
                <WatchSummary watched={watched} />
                <WatchList
                  watched={watched}
                  onhandledelete={handledeletewatched}
                />
              </>
            )}
          </>
        </Box>
        {/* <WatchedBox /> */}
      </Main>
    </>
  );
}
//getting Logo,search and numresult as children prop to avoid prop drilling
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

//display as Loading before the fetching the data throught the API
function Loader() {
  return <p className="loader">Loading...</p>;
}

// this will display the error message which received through message prop
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}
//Logo consist the log which return jsx for the component to display on navbar
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>MovieMania</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    // this set the query using setquery function
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    // display then length of the movies array of object return the jsx here to display on nav bar
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// get the movie box and watch box as children prop to avoid prop drilling
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// get children prop for movie box as well as for watch box
function Box({ children }) {
  // this will help to toggel the view for box the boxes component
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {/* this will display the movie details if isopen is true which is expanded */}
      {isOpen && children}
    </div>
  );
}

// display the movie for search result
function MovieList({ movies, onselectmovie }) {
  return (
    <ul className="list">
      {/* for each object render the display movie details usign map function if not
      having result used optional chaining */}
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onselectmovie={onselectmovie} />
        // used keyprop as content changes even thought the position is same for component while rending the driffing rule applied here
      ))}
    </ul>
  );
}

function Movie({ movie, onselectmovie }) {
  return (
    <li onClick={() => onselectmovie(movie.imdbID)} key={movie.imdbID}>
      {/* display image of movies title and year  */}
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onclosemovie, onhandlewatch, watched }) {
  // this will get the more details as object for the clicked movie
  const [onclickmovie, setonclickmovie] = useState({});
  //Loader
  const [isLoading, setLoading] = useState(false);
  //can able to help display rating
  const [userrating, setuserrating] = useState("");
  console.log(watched);

  // if their is already movie in the watched list then watched setr to faklse else to true
  const iswatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  console.log(iswatched);

  const watcheduserrating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userrating;

  // simplifying the nameing to display the details
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = onclickmovie;

  // detructure the  onclickomvie data we get from setonclickmovie after fetching through selected array to display the details in jsx

  function handleadd() {
    const newatchmovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userrating,
    };

    // append the data to watched array of object to display watched movies
    onhandlewatch(newatchmovie);
    // this will help while click happen on other movie to get display the watch movie
    onclosemovie();
  }

  // this will get trigger as their will be selectedId id changes
  useEffect(
    function () {
      async function getmoviedetails() {
        // again set loader true for watchmovie box as same
        setLoading(true);
        // here get the more details according to the api id field which is imdid
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        // this will append the data to watchmovie array of object
        setonclickmovie(data);
        // again set loader false for watchmovie box as same

        setLoading(false);
      }
      // call the function
      getmoviedetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie : ${title}`;

      return function () {
        document.title = "MovieMania";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {/* if loader is true display the loader else display watch movie details   */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* render the movie details  */}
          <header>
            {/* onclicking onclosemovie selected id set to null then nothing get displayed   */}
            <button className="btn-back" onClick={onclosemovie}>
              &larr;
            </button>
            {/* displaye poster rating and other details */}
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!iswatched ? (
                <>
                  <StarRating
                    key={imdbRating}
                    maxrating={10}
                    size={24}
                    onsetrating={setuserrating}
                  />
                  {/* if user rating is greter than 1 will get the add button to add movie to watch list afet giving the rating  */}
                  {userrating > 0 && (
                    <button className="btn-add" onClick={handleadd}>
                      + Add list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watcheduserrating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring{actors}</p>
            <p>Director by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userrating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchList({ watched, onhandledelete }) {
  return (
    <ul className="list">
      {/*  display the details for watch movie details  thorugh watched prop */}

      {/* used key prop as per driffing rule in rendering  */}
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onhandledelete={onhandledelete}
        />
      ))}
    </ul>
  );
}

// display the watched movie
function WatchedMovie({ movie, onhandledelete }) {
  return (
    //  used key prop for as per driffing rules
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userrating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onhandledelete(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
}
