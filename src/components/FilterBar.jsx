const SelectField = ({ label, value, onChange, options, allLabel }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-bold text-slate-600">{label}</span>
    <select
      className="form-control"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => {
        const optionValue = Array.isArray(option) ? option[0] : option;
        const optionLabel = Array.isArray(option) ? option[1] : option;

        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  </label>
);

const FilterBar = ({
  filters,
  options,
  isShuffle,
  onFilterChange,
  onToggleShuffle,
}) => (
  <section className="app-card p-4" aria-label="문항 필터">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-extrabold text-slate-950">문항 찾기</h2>
      </div>
      <button
        type="button"
        onClick={onToggleShuffle}
        className={`min-h-11 shrink-0 rounded-lg px-4 text-sm font-extrabold transition active:scale-[0.99] ${
          isShuffle
            ? "bg-teal-700 text-white shadow-sm"
            : "border border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
        }`}
      >
        {isShuffle ? "섞는 중" : "섞기"}
      </button>
    </div>

    <label className="mt-4 block">
      <span className="mb-1 block text-xs font-bold text-slate-600">키워드 검색</span>
      <input
        className="form-control"
        type="search"
        value={filters.search}
        onChange={(event) => onFilterChange("search", event.target.value)}
        placeholder="예: 지표, 원근법, 라스웰"
      />
    </label>

    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <SelectField
        label="풀이 모드"
        value={filters.mode}
        onChange={(value) => onFilterChange("mode", value)}
        allLabel="전체 문항"
        options={[
          ["wrong", "오답만"],
          ["unanswered", "미풀이만"],
        ]}
      />
      <SelectField
        label="문항 구분"
        value={filters.examScope}
        onChange={(value) => onFilterChange("examScope", value)}
        allLabel="전체"
        options={[
          ["theory", "이론"],
          ["past", "기출"],
        ]}
      />
      <SelectField
        label="챕터"
        value={filters.chapter}
        onChange={(value) => onFilterChange("chapter", value)}
        allLabel="전체 챕터"
        options={options.chapters}
      />
      <SelectField
        label="섹션"
        value={filters.section}
        onChange={(value) => onFilterChange("section", value)}
        allLabel="전체 섹션"
        options={options.sections}
      />
      <SelectField
        label="난이도"
        value={filters.difficulty}
        onChange={(value) => onFilterChange("difficulty", value)}
        allLabel="전체 난이도"
        options={options.difficulties}
      />
      <SelectField
        label="문항 유형"
        value={filters.type}
        onChange={(value) => onFilterChange("type", value)}
        allLabel="전체 유형"
        options={options.types}
      />
    </div>
  </section>
);

export default FilterBar;
