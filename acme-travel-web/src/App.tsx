import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, useThunderID } from "@thunderid/react";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import { configureApi } from "./api";

// Pages inside RequireSignIn render only for a signed-in traveler.
function RequireSignIn({ children }: { children: React.ReactNode }) {
  const { signIn } = useThunderID();
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <section className="hero hero-compact">
          <p className="eyebrow">My trips</p>
          <h1>Sign in to see your trips</h1>
          <p className="lead">
            Your bookings are tied to your account. Sign in and they will be
            right here.
          </p>
          <button className="btn" onClick={() => signIn()}>
            Sign in
          </button>
        </section>
      </SignedOut>
    </>
  );
}

export default function App() {
  const { getAccessToken } = useThunderID();

  // Every bookings API call now carries the signed-in traveler's access token.
  useEffect(() => {
    configureApi({ getAccessToken });
  }, [getAccessToken]);

  return (
    <div className="app">
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route
            path="/trips"
            element={
              <RequireSignIn>
                <MyTrips />
              </RequireSignIn>
            }
          />
        </Routes>
      </main>
      <footer className="footer">Acme Travel · demo application</footer>
    </div>
  );
}
