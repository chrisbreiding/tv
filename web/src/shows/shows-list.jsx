import _ from 'lodash';
import React, { createClass } from 'react';

export default createClass({
  render () {
    const { type, shows } = this.props;
    return (
      <div className={`shows-list ${_.kebabCase(type)}`}>
        <h2>{type}</h2>
        <ul>
          {
            shows.map((show) => {
              return <li key={show.get('id')}><h3>{show.get('display_name')}</h3></li>;
            })
          }
        </ul>
      </div>
    );
  }
});
