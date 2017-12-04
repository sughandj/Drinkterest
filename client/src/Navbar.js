import React from 'react';

const Navbar = ({ authorized, navigate, onBrowseClick, onFavoritesClick, onSignoutClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a className="navbar-brand" href="/">Drinkterest</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      {authorized ? (
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav mr-auto">
            <li className={navigate !== "favorites" ? "nav-item active" : "nav-item"}>
              <a onClick={onBrowseClick} className="nav-link">Browse</a>
            </li>
            <li className={navigate === "favorites" ? "nav-item active" : "nav-item"}>
              <a onClick={onFavoritesClick} className="nav-link">Favorites</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{authorized}</a>
              <div className="dropdown-menu dropdown-menu-right">
                <a id="dropdown-item" onClick={onSignoutClick} className="dropdown-item">Sign Out</a>
              </div>
            </li>
          </ul>
        </div>
      ) : (
        <div className="collapse navbar-collapse" id="navbar">
        </div>
      )}
    </nav>
  );
}

export default Navbar;
