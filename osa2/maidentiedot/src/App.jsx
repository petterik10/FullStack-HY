import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import countrySerice from "./services/countries";
import Countries from "./components/Countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  const handeFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const showOneCountry = (country) => {
    setSearchFilter(country.toLowerCase());
  };

  useEffect(() => {
    countrySerice.findAllCountries().then((response) => {
      setCountries(response);
    });
  }, []);

  const countriesToShow = searchFilter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : [];

  return (
    <div>
      find countries
      <Filter filter={searchFilter} onChange={handeFilterChange} />
      <Countries countries={countriesToShow} showCountry={showOneCountry} />
    </div>
  );
};

export default App;
