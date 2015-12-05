import _ from 'lodash';
import React, { createClass } from 'react';
import Show from './show';

export default createClass({
  render () {
    const { type, shows } = this.props;
    return (
      <div className={`shows-list ${_.kebabCase(type)}`}>
        <h2>{type}</h2>
        <ul>
          {
            shows.map((show) => {
              return <Show
                       key={show.get('id')}
                       show={show}
                       episodesFilter={this.props.episodesFilter} />;
            })
          }
        </ul>
      </div>
    );
  }
});
