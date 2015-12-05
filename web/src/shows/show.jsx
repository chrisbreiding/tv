import React, { createClass } from 'react';

export default createClass({
  render () {
    const { show } = this.props;
    return (
      <li key={show.get('id')}>
        <h3>{show.get('display_name')}</h3>
      </li>
    );
  }
});
