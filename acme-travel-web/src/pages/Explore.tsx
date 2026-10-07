import DestinationCard from "../components/DestinationCard";
import { destinations } from "../data/destinations";

export default function Explore() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Spring departures</p>
        <h1>Where to next?</h1>
        <p className="lead">
          Six hand-picked trips, flights and stays included. Book in one click
          and find it under My trips.
        </p>
      </section>
      <section className="grid">
        {destinations.map((destination, index) => (
          <DestinationCard
            key={destination.slug}
            destination={destination}
            index={index}
          />
        ))}
      </section>
    </>
  );
}
