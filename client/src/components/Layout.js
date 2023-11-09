import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </>
  );
};

export default Layout;
