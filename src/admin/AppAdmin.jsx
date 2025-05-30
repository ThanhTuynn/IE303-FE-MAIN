import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes/index";
import DefaultComponent from "./component/DefaultComponent/DefaultComponent";
import "./indexAdmin.css";

function App() {
    return (
        <Routes>
            {routes.map((route) => {
                const Page = route.page;
                const Layout = route.isShowHeader ? DefaultComponent : Fragment;

                return (
                    <Route
                        key={route.path}
                        path={route.path.replace("/admin", "") || "/"}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}

            {/* Fallback: NotFound cho admin, không redirect về trang chủ */}
            <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
    );
}

export default App;
