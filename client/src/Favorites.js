import React, { Component } from 'react';
import Loading from './Loading';

class Favorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      per_row: 3,
      results: null,
      favorites: new Set(),
    };

    this.onToggleFavorite = this.onToggleFavorite.bind(this);
  };

  componentDidMount() {
    this.getResults();
  }

  checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      let error = new Error(res.statusText);
      error.res = res;
      throw error;
    }
  }

  getResults() {
    fetch('/api/favorites', {
        method: "get",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache',
        },
        credentials: 'same-origin',
      })
        .then(this.checkStatus)
        .then(res => res.json())
        .then(favoritesList => {
          let favorites = new Set(favoritesList);
          let results = [];
          let promises = [];

          for (let i = 0; i < favoritesList.length; i++) {
            promises.push(
              fetch(`/brewerydb/beer/${favoritesList[i]}?q=`)
                .then(this.checkStatus)
                .then(res => res.json())
                .then(res => results.push(res.data))
                .catch(e => this.props.changeInfo("danger", "Error", e.toString()))
            );
          }

          Promise.all(promises).then(() => this.setState({ results, favorites }))
        })
        .catch(e => this.props.changeInfo("danger", "Error", e.toString()));
  }

  onToggleFavorite(event) {
    let id = event.target.id;

    if (this.refs[id].innerText === "Favorite") {
      fetch('/api/favorite', {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          drink: id,
        })
      })
        .then(this.checkStatus)
        .then(res => res.json())
        .then(res => {
          this.refs[id].innerText = "Unfavorite";
          this.refs[id].className = "btn btn-danger";
          this.getResults();
        })
        .catch(e => this.props.changeInfo("danger", "Error", e.toString()));
    }
    else {
      fetch('/api/favorite/' + id, {
        method: "delete",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache',
        },
        credentials: 'same-origin',
      })
        .then(this.checkStatus)
        .then(res => {
          this.refs[id].innerText = "Favorite";
          this.refs[id].className = "btn btn-secondary";
          this.getResults();
        })
        .catch(e => this.props.changeInfo("danger", "Error", e.toString()));
    }
  }

  render () {
    const data = this.state.results;

    let container = [];
    let grid = [];
    let key = 0;

    if (data) {
      let rows = [];
      let cols = [];

      for (let i = 0; i < data.length; i++) {
        cols.push(
          <div key={key++} className="col">
            <div className="card">
              <h4 className="card-header">{data[i].nameDisplay}</h4>
              <div className="card-body"></div>
              <img className="card-image" src={data[i].labels ? data[i].labels.medium : "https://imgplaceholder.com/256x256/ffffff/dddddd/ion-beer"} alt={data[i].nameDisplay}/>
              <div className="card-body">
                <p className="card-text">{data[i].description}</p>
              </div>
              <div className="card-footer text-muted">
                <button onClick={this.onToggleFavorite}
                  id={data[i].id} ref={data[i].id}
                  type="button"
                  className={ this.state.favorites.has(data[i].id.toString()) ? "btn btn-danger" : "btn btn-secondary" }>
                  { this.state.favorites.has(data[i].id.toString()) ? "Unfavorite" : "Favorite" }
                </button>
              </div>
            </div>
          </div>
        );

        if ((i + 1) % this.state.per_row === 0 || (i + 1) === data.length) {
          rows.push(
            <div key={key++} className="row">
              {cols}
            </div>
          );
          cols = [];
        }
      }

      grid.push(
        <div key={key++} className="container">
          {rows}
        </div>
      );
    }
    else {
      grid.push(<Loading key={key++}/>);
    }

    container.push(
      <div key={key++} className="container">
        {grid}
      </div>
    )

    return (
      <div id="favorites">
        <h2>Favorites</h2>
        <br/><br/>
        {container}
      </div>
    );
  }
}

export default Favorites;
