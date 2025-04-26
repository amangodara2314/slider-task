import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VideoCarousel from "./VideoCarousel";
import SingleVideoPage from "./SingleVideoPage";
const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <VideoCarousel />,
    },
    {
      path: "/video/:videoId",
      element: <SingleVideoPage />,
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default App;
