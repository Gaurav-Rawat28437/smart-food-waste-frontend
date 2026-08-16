import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout, { Protected } from "./components/Shell";
import Landing from "./pages/Landing";
import { Login } from "./pages/Auth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { DonorHome, DonorProfile, Donate, MyDonations } from "./pages/DonorPages";
import { NgoHome, NgoProfile, AvailableDonations, ClaimsPage } from "./pages/NgoPages";
import { AdminHome, AdminDonations, DirectoryPage } from "./pages/AdminPages";

function AppHome() {
  const { user } = useAuth();
  if (user?.role === "DONOR") return <DonorHome />;
  if (user?.role === "NGO") return <NgoHome />;
  return <AdminHome />;
}

function DonationsRoute() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <AdminDonations /> : <AvailableDonations />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout>
              <AppHome />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/app/donor-profile"
        element={
          <Protected roles={["DONOR"]}>
            <AppLayout>
              <DonorProfile />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/app/donate"
        element={
          <Protected roles={["DONOR"]}>
            <AppLayout>
              <Donate />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/app/my-donations"
        element={
          <Protected roles={["DONOR"]}>
            <AppLayout>
              <MyDonations />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/app/ngo-profile"
        element={
          <Protected roles={["NGO"]}>
            <AppLayout>
              <NgoProfile />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/app/donations"
        element={
          <Protected roles={["NGO", "ADMIN"]}>
            <AppLayout>
              <DonationsRoute />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/app/claims"
        element={
          <Protected roles={["NGO", "ADMIN"]}>
            <AppLayout>
              <ClaimsPage />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/app/ngos"
        element={
          <Protected roles={["ADMIN", "DONOR"]}>
            <AppLayout>
              <DirectoryPage type="ngos" />
            </AppLayout>
          </Protected>
        }
      />
      <Route
        path="/app/donors"
        element={
          <Protected roles={["ADMIN"]}>
            <AppLayout>
              <DirectoryPage type="donors" />
            </AppLayout>
          </Protected>
        }
      />

      <Route
        path="/app/profile"
        element={
          <Protected>
            <AppLayout>
              <Profile />
            </AppLayout>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
