import React from 'react';

const Loading = () => {
  return (
    <div id="loading">
      <h2>Loading...</h2>
      <div className="progress">
        <div id="progress" className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  );
}

export default Loading;
