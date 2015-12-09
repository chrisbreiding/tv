import React, { createClass } from 'react';
import Show from './show';

export default createClass({
  render () {
    const { label, type, shows } = this.props;
    return (
      <div className={`shows ${type}`}>
        <h2>{label}</h2>
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
