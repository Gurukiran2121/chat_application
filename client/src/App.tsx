import { Layout, Spin } from "antd";
import AppRoutes from "./components/Routes";
import { useAppContext } from "./appContext/AppContext";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

const { Content } = Layout;

function App() {
  const { isCheckingAuth, checkAuth } = useAppContext();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <>loading app...</>;
  }
  return (
    <BrowserRouter>
      <Spin spinning={isCheckingAuth} delay={300} size="large">
        <Layout className="main-layout-container">
          <Content>
            <AppRoutes />
          </Content>
        </Layout>
      </Spin>
    </BrowserRouter>
  );
}

export default App;
