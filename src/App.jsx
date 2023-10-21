import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import RightList from "./components/RightList";

function App() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(Math.floor(Math.random() * 1000));
  const [mostFrequentType, setMostFrequentType] = useState(null);
  // Fetch Pokémon data with details
  useEffect(() => {
    const fetchItems = async (offset) => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?limit=15&offset=${offset}`
        );
        const data = response.data.results;

        // Create an array of promises to fetch details for each Pokémon
        const promises = data.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          return response.data;
        });

        // Wait for all promises to resolve and set the Pokémon details
        const pokemonDetails = await Promise.all(promises);

        // Update the state with Pokémon details
        setItems(pokemonDetails);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchItems(offset);
  }, [offset]);

  useEffect(() => {
    // if (items.length > 0) {
    //   const typeCount = {};
    //   let maxType = null;
    //   let maxCount = 0;

    //   items.forEach((pokemon) => {
    //     pokemon.types.forEach((typeData) => {
    //       const typeName = typeData.type.name;
    //       if (typeCount[typeName]) {
    //         typeCount[typeName]++;
    //       } else {
    //         typeCount[typeName] = 1;
    //       }

    //       if (typeCount[typeName] > maxCount) {
    //         maxCount = typeCount[typeName];
    //         maxType = typeName;
    //       }
    //     });
    //   });

    //   setMostFrequentType(maxType);
    // }
    if (items.length > 0) {
      const typeCount = {};
      let maxType = null;
      let maxCount = 0;

      items.forEach((pokemon) => {
        const typeName = pokemon.types[0].type.name;
        if (typeCount[typeName]) {
          typeCount[typeName]++;
        } else {
          typeCount[typeName] = 1;
        }

        if (typeCount[typeName] > maxCount) {
          maxCount = typeCount[typeName];
          maxType = typeName;
        }
      });

      setMostFrequentType(maxType);
    }
  }, [items]);

  return (
    <>
      <div className="stats">
        <div className="statcontainer">
          <h3># of Pokémons</h3>
          <p>{items.length}</p>
        </div>
        <div className="statcontainer">
          <h3>Average Weight</h3>
          <p>
            {Math.round(
              items.reduce((a, b) => a + b.weight, 0) / items.length
            ) / 100}{" "}
            hectogram
          </p>
        </div>
        <div className="statcontainer">
          <h3>Most Frequent Type</h3>
          <p>{mostFrequentType}</p>
        </div>

        <div className="container"></div>
      </div>
      <div className="checkList">
        <h1>Pokémons</h1>
        <p>Check out these pokemons!</p>
        <form action="">
          <label htmlFor="">Search: </label>
          <input type="text" placeholder="enter name" />
        </form>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Type</th>
                <th>Attack</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>{x.name}</td>
                  <td>{x.weight}</td>
                  <td>{x.types[0].type.name}</td>
                  <td>{x.stats[0].base_stat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RightList />
    </>
  );
}

export default App;
