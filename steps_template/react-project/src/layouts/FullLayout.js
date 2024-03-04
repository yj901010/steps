import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Container } from "reactstrap";
// import Body from "../components/Body";
const FullLayout = () => {

  const contentAreaStyle = {
    flexGrow: 1,
    maxWidth: '1300px',
    margin: '0 auto',
  };

  return (
    <main>
      {/********header**********/}
      <Header/>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea" style={{display: "grid"}}>
          <Sidebar />
          {/* <Body /> */}
        </aside>
        {/********Content Area**********/}
        <div className="contentArea" style={contentAreaStyle}>
          {/********Middle Content**********/}
          <Container className="p-4" fluid style={{height:"1500px"}}>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;