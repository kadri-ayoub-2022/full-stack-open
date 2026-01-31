const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input onChange={(e) => setFilter(e?.target?.value)} value={filter} />
    </div>
  );
};

export default Filter;