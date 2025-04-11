import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { GET_PROFICIENCIES } from "../utils/queries";
//import { CREATE_CHARACTER } from "../utils/mutations";

const CharacterProficienciesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const charData = location.state;

  const [selected, setSelected] = useState<string[]>([]);
  //const [createCharacter] = useMutation(CREATE_CHARACTER);

  const { data, loading, error } = useQuery(GET_PROFICIENCIES, {
    variables: {
      classIndex: charData.class.toLowerCase(),
      raceIndex: charData.race.toLowerCase(),
    },
  });

  const chooseAmount = data?.getProficiencies?.chooseAmount || 0;
  const optional = data?.getProficiencies?.optional || [];
  const staticProfs = data?.getProficiencies?.static || [];

  // 👇 Log what the API is returning
  useEffect(() => {
    if (data) {
      console.log("chooseAmount:", data.getProficiencies.chooseAmount);
      console.log("optional proficiencies:", data.getProficiencies.optional);
      console.log("static proficiencies:", data.getProficiencies.static);
    }
  }, [data]);

  const toggleSelection = (prof: string) => {
    if (selected.includes(prof)) {
      setSelected(selected.filter((p) => p !== prof));
    } else if (selected.length < chooseAmount) {
      setSelected([...selected, prof]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allProfs = [...staticProfs.map((p: any) => p.name), ...selected];

    try {
      // 👇 Forward full character state to the next page
      navigate("/character-equipment", {
        state: {
          ...charData,
          proficiencies: allProfs,
        },
      });
    } catch (err) {
      console.error("Error navigating to equipment page:", err);
    }
  };

  if (loading) return <p>Loading proficiencies...</p>;
  if (error) return <p>Error loading proficiencies.</p>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Choose Proficiencies
      </h1>

      <h2 className="text-xl font-semibold mb-2">Automatically Granted:</h2>
      <ul className="mb-4 list-disc ml-6">
        {staticProfs.map((p: any) => (
          <li key={p.index}>{p.name}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">
        Choose {chooseAmount} Additional Proficiencies:
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          {optional.map((p: any) => (
            <label key={p.index} className="block">
              <input
                type="checkbox"
                disabled={
                  !selected.includes(p.name) && selected.length >= chooseAmount
                }
                checked={selected.includes(p.name)}
                onChange={() => toggleSelection(p.name)}
                className="mr-2"
              />
              {p.name}
            </label>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={selected.length < chooseAmount}
            className={`px-6 py-3 mt-4 rounded text-white ${
              selected.length === chooseAmount
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next : Equipment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterProficienciesPage;
