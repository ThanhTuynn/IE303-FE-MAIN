import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "./user/components/Toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <Router>
            <AppRoutes />
            <ToastContainer />
        </Router>
    );
}

export default App;
