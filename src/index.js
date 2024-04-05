import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./starrating";

// function Test() {
//   const [rated, setrating] = useState();

//   return (
//     <div>
//       <StarRating color="blue" onsetrating={setrating} />
//       <p>This movies was rated {rated} stars</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxrating={5} />
    <StarRating
      maxrating={5}
      color="red"
      size={20}
      className="test"
      defaultrating={0}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>
);
