import { useQuery } from "@apollo/client";
import { GET_CLASSES } from "../utils/queries";
import { useEffect } from "react";

interface ClassInterface {
  name: string;
  index: string;
  url: string;
}

const ClassesPage = () => {
  const { loading, error, data } = useQuery(GET_CLASSES);

  useEffect(() => {
    if (data) {
      console.log("Fetched classes:", data);
    }
  }, [data]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading classes.</h1>;

  return (
    <div>
      <h1>Class Page</h1>
      {data?.getClasses?.map((cls: ClassInterface, index: number) => (
        <button key={index}>{cls.name}</button>
      ))}
    </div>
  );
};

export default ClassesPage;
