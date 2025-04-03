import { useQuery } from "@apollo/client";
import { GET_RACES } from "../utils/queries";
import { useEffect } from "react";

interface RaceInterface {
  name: string;
  index: string;
  url: string;
}

const RacesPage = () => {
  const { loading, data } = useQuery(GET_RACES);
  useEffect(() => {
    console.log("data: ", data);
  }, [data]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Races Page</h1>
      {data?.getRaces?.map((race: RaceInterface, index: number) => {
        return (
          <div key={index}>
            <button>{race.name}</button>
          </div>
        );
      })}
    </div>
  );
};
export default RacesPage;
