import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router"
// import App from './App.jsx'
import SheetUploadForm from './sheet-uploader'
import AddAgent from './add-agent'
import Agents from './agents'
import Sheets from './sheets'
// import Sidebar from './sidebar'
// import Header from './header'
import Dashboard from './dashboard'
import AutoAttendants from './auto-attendants'
import CampaignTable from './campaign'
import Login from './login'
import Sheet from './open-sheet'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {path: "/", element: <CampaignTable />},
      { path: "agents", element: <Agents /> },
      { path: "agents/add", element: <AddAgent /> },
      { path: "lists/upload", element: <SheetUploadForm />},
      { path: "lists", element: <Sheets />},
      { path: "attendants", element: <AutoAttendants /> },
      { path: "list/open", element: <Sheet />}
    ],
  },
  {
    path: "/login",
    element: <Login />
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
  // <StrictMode>
  // // </StrictMode>
)
