import PropTypes from 'prop-types';

/**
 * Horizontal, scrollable pill bar for filtering threads by category.
 * Purely a front-end/UI concern (no API support for it), so it's kept as
 * simple prop-driven state rather than in the Redux store.
 * @param {object} props - Component props.
 * @return {JSX.Element} Category filter bar element.
 */
export default function CategoryFilterBar({categories, active, onSelect}) {
  return (
    <div className="category-bar">
      <button
        type="button"
        className={`category-pill ${active === 'all' ? 'is-active' : ''}`}
        onClick={() => onSelect('all')}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-pill ${active === category ? 'is-active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryFilterBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
