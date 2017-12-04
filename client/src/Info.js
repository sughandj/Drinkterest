import React from 'react';

const Info = ({ type, title, message }) => {
  return (
    <div className={"alert alert-dismissible alert-" + type}>
      <button type="button" className="close" data-dismiss="alert">&times;</button>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}

export default Info;
