import { useQuery } from "@apollo/client";
import { GET_SKILLS } from "../utils/queries";
import { useEffect } from "react";

interface SkillInterface {
  name: string;
  index: string;
  url: string;
}

const SkillsPage = () => {
  const { loading, data, error } = useQuery(GET_SKILLS);

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error loading skills.</h1>;

  return (
    <div>
      <h1>Skills Page</h1>
      {data?.getSkills?.map((skill: SkillInterface, index: number) => (
        <div key={skill.index}>
          <button>{skill.name}</button>
        </div>
      ))}
    </div>
  );
};

export default SkillsPage;
