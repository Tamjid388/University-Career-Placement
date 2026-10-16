import { useEffect, useState } from "react";
import { UseSearchJobs } from "../../hooks/useJobs.js";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [location, setLocation] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedInput(input);
      setDebouncedLocation(location);
    }, 400);

    return () => clearTimeout(delay);
  }, [input, location]);

  const { data, isLoading } = UseSearchJobs({
    ...(debouncedInput.trim() ? { title: debouncedInput.trim(), limit: 7 } : {}),
    ...(debouncedLocation.trim() ? { location: debouncedLocation.trim() } : {}),
  });
  const suggestions = data?.jobs || [];

  const goToResults = () => {
    const params = new URLSearchParams();
    if (input.trim()) params.set("title", input.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/job/search-results?${params.toString()}`);
    setOpen(false);
  };

  const handleSelect = (jobId) => {
    setInput("");
    setLocation("");
    setOpen(false);
    navigate(`/job/details/${jobId}`);
  };

  return (
    <div className="relative w-full">
      <form
        role="search"
        aria-label="Job search"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
        className="bg-base-100 p-2 rounded-2xl shadow-lg border border-base-300 flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
      >
        <label htmlFor="home-search-keyword" className="sr-only">
          Job title or keyword
        </label>
        <input
          id="home-search-keyword"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Job title, keyword..."
          autoComplete="off"
          className="w-full lg:w-1/2 p-3 rounded-xl outline-none bg-transparent text-base-content placeholder:text-gray-400 focus:bg-base-200/60"
        />
        <div className="hidden lg:block w-px self-stretch bg-base-300" aria-hidden="true" />
        <label htmlFor="home-search-location" className="sr-only">
          Location
        </label>
        <input
          id="home-search-location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Location"
          autoComplete="off"
          className="w-full lg:w-1/4 p-3 rounded-xl outline-none bg-transparent text-base-content placeholder:text-gray-400 focus:bg-base-200/60"
        />
        <button type="submit" className="btn-brand-primary lg:ml-auto whitespace-nowrap">
          Find Job
        </button>
      </form>

      {open && debouncedInput.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 shadow-xl border border-base-300 rounded-xl z-50 max-h-60 overflow-y-auto py-1">
          {isLoading ? (
            <p className="p-3 text-sm text-gray-700 dark:text-gray-300">Loading...</p>
          ) : suggestions.length > 0 ? (
            suggestions.slice(0, 7).map((job) => (
              <button
                key={job._id}
                onClick={() => handleSelect(job._id)}
                className="w-full text-left px-4 py-2 hover:bg-base-200 text-gray-900 dark:text-base-content font-medium text-sm md:text-base transition"
              >
                {job.title}
              </button>
            ))
          ) : (
            <p className="p-3 text-sm text-gray-700 dark:text-gray-300">No jobs found. Press Enter to search anyway.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
