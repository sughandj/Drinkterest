import React, { Component } from 'react';
import Loading from './Loading';
import { debounce } from 'throttle-debounce';

class Browse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      per_page: 9,
      per_row: 3,
      page: 1,
      query: "",
      results: {},
      favorites: new Set(),
    };

    this.onChangeDebounce = debounce(500, this.onChangeDebounce);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onToggleFavorite = this.onToggleFavorite.bind(this);
  };

  componentDidMount() {
    this.getResults();
  }

  onChangeDebounce(target) {
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, () => this.getResults());
  }

  handleInputChange(event) {
    this.onChangeDebounce(event.target);
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

  getPage(page) {
    this.setState({
      page: page
    }, () => this.getResults());
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
          fetch('/lcboapi/products?q=' + this.state.query + '&per_page=' + this.state.per_page + '&page=' + this.state.page)
            .then(this.checkStatus)
            .then(res => res.json())
            .then(results => this.setState({ results, favorites }))
            .catch(e => this.props.changeInfo("danger", "Error", e.toString()));
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
    const pager = this.state.results.pager;
    const results = this.state.results.result;

    let container = [];
    let grid = [];
    let key = 0;

    if (results) {
      let rows = [];
      let cols = [];

      for (let i = 0; i < results.length; i++) {
        cols.push(
          <div key={key++} className="col">
            <div className="card">
              <h4 className="card-header">{results[i].name}</h4>
              <div className="card-body">
                <h5 className="card-title">{results[i].style}</h5>
                <h6 className="card-subtitle text-muted">{results[i].origin}</h6>
              </div>
              <img className="card-image" src={results[i].image_thumb_url} alt={results[i].name}/>
              <div className="card-body">
                <p className="card-text">{results[i].package}</p>
              </div>
              <div className="card-footer text-muted">
                <button onClick={this.onToggleFavorite}
                  id={results[i].id} ref={results[i].id}
                  type="button"
                  className={ this.state.favorites.has(results[i].id.toString()) ? "btn btn-danger" : "btn btn-secondary" }>
                  { this.state.favorites.has(results[i].id.toString()) ? "Unfavorite" : "Favorite" }
                </button>
              </div>
            </div>
          </div>
        );

        if ((i + 1) % this.state.per_row === 0 || (i + 1) === results.length) {
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

      let nextpages = [];
      for (let i = this.state.page + 1; i <= Math.min(this.state.page + 4, pager.total_pages); i++) {
        nextpages.push(
          <li key={key++} className="page-item">
            <a onClick={() => this.getPage(i)} className="page-link">{i}</a>
          </li>
        );
      };

      grid.push(
        <div key={key++}>
          <ul className="pagination">
            <li className={ pager.is_first_page ? "page-item disabled" : "page-item" }>
              <a onClick={() => this.getPage(this.state.page - 1)} className="page-link">&laquo;</a>
            </li>
            <li className="page-item active">
              <a className="page-link">{this.state.page}</a>
            </li>
            {nextpages}
            <li className={ pager.is_final_page ? "page-item disabled" : "page-item" }>
              <a onClick={() => this.getPage(this.state.page + 1)} className="page-link">&raquo;</a>
            </li>
          </ul>
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
      <div id="browse">
        <h2>Browse</h2>
        <input name="query" onChange={this.handleInputChange} className="form-control" type="text" placeholder="Search"/>
        <br/><br/>
        {container}
      </div>
    );
  }
}

export default Browse;
