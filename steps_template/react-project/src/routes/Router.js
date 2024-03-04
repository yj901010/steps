import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const Main = lazy(() => import("../components/Main.jsx"));
const Login = lazy(() => import("../components/Login.jsx"));
const Join = lazy(() => import("../components/Join.jsx"));
const MyPage = lazy(() => import("../components/MyPage.jsx"));
const Delete = lazy(() => import("../components/Delete.jsx"));
const Survey = lazy(() => import("../components/Survey.jsx"));
const Result = lazy(() => import("../components/Result.jsx"));
const HeatMap = lazy(() => import("../components/HeatMap.js"));
const FsrValue = lazy(() => import("../components/FsrValue.jsx"));
// const About = lazy(() => import("../views/About.js"));
// const Alerts = lazy(() => import("../views/ui/Alerts"));
// const Badges = lazy(() => import("../views/ui/Badges"));
// const Buttons = lazy(() => import("../views/ui/Buttons"));
// const Cards = lazy(() => import("../views/ui/Cards"));
// const Grid = lazy(() => import("../views/ui/Grid"));
// const Tables = lazy(() => import("../views/ui/Tables"));
// const Forms = lazy(() => import("../views/ui/Forms"));
// const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/main" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/main", exact: true, element: <Main /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/join", exact: true, element: <Join /> },
      { path: "/mypage", exact: true, element: <MyPage /> },
      { path: "/delete", exact: true, element: <Delete /> },
      { path: "/survey", exact: true, element: <Survey /> },
      { path: "/result", exact: true, element: <Result /> },
      { path: "/heatmap", exact: true, element: <HeatMap /> },
      { path: "/fsrvalue", exact: true, element: <FsrValue /> }
      // { path: "/about", exact: true, element: <About /> },
      // { path: "/alerts", exact: true, element: <Alerts /> },
      // { path: "/badges", exact: true, element: <Badges /> },
      // { path: "/buttons", exact: true, element: <Buttons /> },
      // { path: "/cards", exact: true, element: <Cards /> },
      // { path: "/grid", exact: true, element: <Grid /> },
      // { path: "/table", exact: true, element: <Tables /> },
      // { path: "/forms", exact: true, element: <Forms /> },
      // { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
];

export default ThemeRoutes;
