import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const airports = [
  { city: "Chennai", code: "MAA", name: "Chennai International Airport" },
  { city: "Delhi", code: "DEL", name: "Indira Gandhi International Airport" },
  { city: "Mumbai", code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { city: "Bangalore", code: "BLR", name: "Kempegowda International Airport" },
  { city: "Hyderabad", code: "HYD", name: "Rajiv Gandhi International Airport" },
  { city: "Kolkata", code: "CCU", name: "Netaji Subhash Chandra Bose International Airport" },
  { city: "Kochi", code: "COK", name: "Cochin International Airport" },
  { city: "Ahmedabad", code: "AMD", name: "Sardar Vallabhbhai Patel International Airport" },
  { city: "Goa", code: "GOI", name: "Dabolim Airport" },
  { city: "Pune", code: "PNQ", name: "Pune Airport" },
  { city: "Jaipur", code: "JAI", name: "Jaipur International Airport" },
  { city: "Lucknow", code: "LKO", name: "Chaudhary Charan Singh International Airport" },
];

const airlines = [
  { name: "IndiGo", prefix: "6E", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/IndiGo_Logo.svg", cabins: ["Economy"], baggage: "15kg", basePrice: 3000 },
  { name: "Air India", prefix: "AI", logo: "https://upload.wikimedia.org/wikipedia/commons/5/54/Air_India_Logo.svg", cabins: ["Economy", "Business"], baggage: "20kg", basePrice: 3500 },
  { name: "Vistara", prefix: "UK", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Vistara_Logo.svg", cabins: ["Economy", "Business"], baggage: "25kg", basePrice: 4000 },
  { name: "SpiceJet", prefix: "SG", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/SpiceJet_logo.svg", cabins: ["Economy"], baggage: "15kg", basePrice: 2800 },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function generateFlights(from, to, date) {
  if (!from || !to || from === to) return [];

  const seed = hashStr(`${from}-${to}-${date}`);
  const rand = seededRandom(seed);
  const count = 4 + Math.floor(rand() * 3);
  const flights = [];

  const distanceMap = {
    "Chennai-Delhi": 170, "Delhi-Chennai": 170,
    "Chennai-Mumbai": 110, "Mumbai-Chennai": 110,
    "Chennai-Bangalore": 60, "Bangalore-Chennai": 60,
    "Chennai-Hyderabad": 75, "Hyderabad-Chennai": 75,
    "Delhi-Mumbai": 130, "Mumbai-Delhi": 130,
    "Mumbai-Bangalore": 95, "Bangalore-Mumbai": 95,
    "Delhi-Bangalore": 155, "Bangalore-Delhi": 155,
    "Hyderabad-Mumbai": 85, "Mumbai-Hyderabad": 85,
    "Delhi-Hyderabad": 140, "Hyderabad-Delhi": 140,
    "Kolkata-Delhi": 145, "Delhi-Kolkata": 145,
    "Chennai-Kolkata": 150, "Kolkata-Chennai": 150,
  };
  const baseDuration = distanceMap[`${from}-${to}`] || (80 + Math.floor(rand() * 120));
  const usedNumbers = new Set();

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(rand() * airlines.length)];
    let flightNum;
    do {
      flightNum = `${airline.prefix} ${100 + Math.floor(rand() * 900)}`;
    } while (usedNumbers.has(flightNum));
    usedNumbers.add(flightNum);

    const depHour = 5 + Math.floor(rand() * 17);
    const depMin = Math.floor(rand() * 4) * 15;
    const stops = rand() < 0.65 ? 0 : 1;
    const duration = baseDuration + (stops === 1 ? 60 : 0) + Math.floor(rand() * 20);
    const totalMins = depHour * 60 + depMin + duration;
    const arrHour = Math.floor(totalMins / 60) % 24;
    const arrMin = totalMins % 60;
    const priceVariance = 0.85 + rand() * 0.6;
    const price = Math.round((airline.basePrice + baseDuration * 15) * priceVariance / 100) * 100;
    const cabin = airline.cabins[Math.floor(rand() * airline.cabins.length)];
    const rating = parseFloat((3.5 + rand() * 1.4).toFixed(1));

    flights.push({
      id: i + 1,
      flightNumber: flightNum,
      airline: airline.name,
      logo: airline.logo,
      from, to, date,
      departure: `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}`,
      arrival: `${String(arrHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")}`,
      duration, price, stops,
      aircraft: rand() < 0.5 ? "Airbus A320" : "Boeing 737",
      cabin, baggage: airline.baggage, rating,
    });
  }

  return flights.sort((a, b) => a.departure.localeCompare(b.departure));
}

const Search = ({ setSelection }) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({ from: "", to: "", date: "" });
  const [activeSearch, setActiveSearch] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({ stops: [], airlines: [], priceRange: 15000, morningOnly: false, rating4: false });
  const [sortType, setSortType] = useState("cheapest");

  const normalizeCity = (input) =>
    airports.find((a) => a.city.toLowerCase() === input.trim().toLowerCase())?.city || input.trim();

  const handleSearch = () => {
    const from = normalizeCity(searchParams.from);
    const to = normalizeCity(searchParams.to);
    const date = searchParams.date;
    if (!from || !to || !date) { alert("Please fill in From, To, and Date."); return; }
    if (from.toLowerCase() === to.toLowerCase()) { alert("Origin and destination cannot be the same."); return; }
    setActiveSearch({ from, to, date });
    setHasSearched(true);
    setFilters({ stops: [], airlines: [], priceRange: 15000, morningOnly: false, rating4: false });
  };

  const rawFlights = useMemo(() => {
    if (!activeSearch) return [];
    return generateFlights(activeSearch.from, activeSearch.to, activeSearch.date);
  }, [activeSearch]);

  const filteredResults = useMemo(() => {
    let list = [...rawFlights];
    if (filters.stops.length > 0) list = list.filter((f) => filters.stops.includes(f.stops));
    if (filters.airlines.length > 0) list = list.filter((f) => filters.airlines.includes(f.airline));
    if (filters.morningOnly) list = list.filter((f) => parseInt(f.departure.split(":")[0]) < 12);
    if (filters.rating4) list = list.filter((f) => f.rating >= 4);
    list = list.filter((f) => f.price <= filters.priceRange);
    return list.sort((a, b) => {
      if (sortType === "cheapest") return a.price - b.price;
      if (sortType === "fastest") return a.duration - b.duration;
      if (sortType === "best") return a.price / a.rating - b.price / b.rating;
      return 0;
    });
  }, [rawFlights, filters, sortType]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value) ? prev[category].filter((v) => v !== value) : [...prev[category], value],
    }));
  };

  const maxPrice = rawFlights.length > 0 ? Math.max(...rawFlights.map((f) => f.price)) : 15000;
  const minPrice = rawFlights.length > 0 ? Math.min(...rawFlights.map((f) => f.price)) : 2000;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-[#003580] pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-4 text-center">Search Flights</h1>
          <div className="bg-white p-3 rounded-lg shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-2">
            <div>
              <input list="airports-from" placeholder="From (e.g. Chennai)"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400 w-full"
                value={searchParams.from}
                onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })} />
              <datalist id="airports-from">
                {airports.map((ap) => <option key={ap.city} value={ap.city}>{ap.code} – {ap.name}</option>)}
              </datalist>
            </div>
            <div>
              <input list="airports-to" placeholder="To (e.g. Mumbai)"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400 w-full"
                value={searchParams.to}
                onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })} />
              <datalist id="airports-to">
                {airports.map((ap) => <option key={ap.city} value={ap.city}>{ap.code} – {ap.name}</option>)}
              </datalist>
            </div>
            <input type="date" min={new Date().toISOString().split("T")[0]}
              className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })} />
            <button onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors uppercase py-3">
              Search Flights
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 mt-10 px-4">
          <aside className="col-span-3 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-6 border border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-gray-800">Popular Filters</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-tighter">Stops</p>
                {[{ label: "Non-Stop", val: 0 }, { label: "1 Stop", val: 1 }].map(({ label, val }) => (
                  <label key={val} className="flex items-center gap-3 text-sm mt-2 cursor-pointer hover:text-blue-600">
                    <input type="checkbox" className="w-4 h-4" checked={filters.stops.includes(val)} onChange={() => toggleFilter("stops", val)} />
                    {label}
                  </label>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-tighter">Airlines</p>
                {airlines.map((air) => (
                  <label key={air.name} className="flex items-center gap-3 text-sm mb-2 cursor-pointer hover:text-blue-600">
                    <input type="checkbox" className="w-4 h-4" checked={filters.airlines.includes(air.name)} onChange={() => toggleFilter("airlines", air.name)} />
                    {air.name}
                  </label>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-tighter">Price Range</p>
                <p className="text-xs text-gray-400 mb-2">₹{minPrice.toLocaleString()} – ₹{filters.priceRange.toLocaleString()}</p>
                <input type="range" min={minPrice} max={maxPrice} step="100" className="w-full accent-blue-600"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: parseInt(e.target.value) })} />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-tighter">Departure</p>
                <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-blue-600">
                  <input type="checkbox" className="w-4 h-4" checked={filters.morningOnly} onChange={() => setFilters({ ...filters, morningOnly: !filters.morningOnly })} />
                  Morning flights (before 12pm)
                </label>
              </div>
              <div className="pt-4 border-t">
                <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-blue-600">
                  <input type="checkbox" className="w-4 h-4" checked={filters.rating4} onChange={() => setFilters({ ...filters, rating4: !filters.rating4 })} />
                  Rated 4+ only
                </label>
              </div>
            </div>
          </aside>

          <main className="col-span-9">
            <div className="flex rounded-t-lg overflow-hidden mb-6 bg-white shadow-sm border border-gray-100">
              {["cheapest", "fastest", "best"].map((type) => (
                <button key={type} onClick={() => setSortType(type)}
                  className={`flex-1 py-4 font-bold text-xs uppercase tracking-widest transition-all ${sortType === type ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                  {type}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Showing <span className="font-bold text-gray-800">{filteredResults.length}</span> flights ·{" "}
              <span className="font-bold text-blue-700">{activeSearch.from}</span> →{" "}
              <span className="font-bold text-blue-700">{activeSearch.to}</span> ·{" "}
              <span className="font-bold text-gray-800">{activeSearch.date}</span>
            </p>
            <div className="space-y-4">
              {filteredResults.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow group">
                  <div className="w-1/5">
                    <img src={f.logo} alt={f.airline} className="w-10 h-10 object-contain mb-1" />
                    <p className="font-bold text-gray-800">{f.airline}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{f.flightNumber}</p>
                    <p className="text-[10px] text-yellow-500 font-bold mt-1">★ {f.rating}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-between px-12">
                    <div className="text-center">
                      <p className="text-xl font-bold">{f.departure}</p>
                      <p className="text-xs text-gray-500 uppercase font-medium">{f.from}</p>
                    </div>
                    <div className="flex-1 px-8">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>{Math.floor(f.duration / 60)}h {f.duration % 60}m</span>
                        <span className={f.stops === 0 ? "text-green-600 font-bold" : "text-orange-500 font-bold"}>
                          {f.stops === 0 ? "Non-stop" : "1 Stop"}
                        </span>
                      </div>
                      <div className="h-[1px] bg-gray-200 relative w-full">
                        <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-gray-300 group-hover:bg-blue-400"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{f.arrival}</p>
                      <p className="text-xs text-gray-500 uppercase font-medium">{f.to}</p>
                    </div>
                  </div>
                  <div className="w-1/4 text-right border-l pl-8">
                    <p className="text-xs text-gray-400 mb-1">{f.cabin} · {f.baggage}</p>
                    <p className="text-2xl font-black text-blue-900">₹{f.price.toLocaleString()}</p>
                    {/* Fixed: was navigate("/book") — now correctly "/booking" to match App.jsx route */}
                    <button
                      onClick={() => { setSelection(f); navigate("/booking"); }}
                      className="mt-3 bg-[#0071c2] text-white px-6 py-2 rounded font-bold hover:bg-blue-700 w-full text-sm">
                      Book Flight
                    </button>
                  </div>
                </div>
              ))}
              {filteredResults.length === 0 && (
                <div className="bg-white p-20 text-center rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-4xl mb-4">✈️</p>
                  <p className="text-gray-500 font-semibold text-lg">No flights match your filters.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting the stops, airline, or price range filters.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {!hasSearched && (
        <div className="max-w-3xl mx-auto mt-20 text-center px-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Search for any flight</h2>
          <p className="text-gray-400">Enter your origin, destination and travel date above to find available flights.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-gray-500">
            {[["Chennai → Delhi", "2026-05-10"], ["Mumbai → Goa", "2026-06-01"], ["Bangalore → Kolkata", "2026-07-15"]].map(([route, date]) => (
              <div key={route} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => { const [from, to] = route.split(" → "); setSearchParams({ from, to, date }); }}>
                <p className="font-bold text-gray-700">{route}</p>
                <p className="text-xs text-blue-500 mt-1">{date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;