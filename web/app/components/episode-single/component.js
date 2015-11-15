import Ember from 'ember';
import $ from 'jquery';
import date from '../../utils/date';

export default Ember.Component.extend({

  tagName: 'li',
  classNames: ['episode-single'],
  classNameBindings: ['airdateStatus', 'showFileName'],

  showFileName: false,

  setup: function () {
    $(document.body).on(`click.${this.get('episode.id')}`, () => {
      if (!this.get('isDestroyed')) {
        Ember.run(() => { this.send('hideFileName'); });
      }
    });
  }.on('didInsertElement'),

  willDestroy () {
    $(document.body).off(`click.${this.get('episode.id')}`);
  },

  airdateStatus: function () {
    let airdate = moment(this.get('episode.airdate'));
    return date.isToday(airdate)     ? 'today upcoming' :
           date.isFarPast(airdate)   ? 'far-past' :
           date.isPast(airdate)      ? 'past' :
           date.isRecent(airdate)    ? 'recent' :
           date.isFarFuture(airdate) ? 'far-future' :
           date.isFuture(airdate)    ? 'future' :
                                        'upcoming';
  }.property('episode.airdate'),

  actions: {
    showFileName () {
      this.set('active', true);
      this.set('showFileName', true);

      Ember.run.later(() => {
        let text = this.$('.file-name')[0];
        let selection = window.getSelection();
        let range = document.createRange();

        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);

        this.set('active', false);
      });
    },

    hideFileName () {
      if (!this.get('active')) {
        this.set('showFileName', false);
      }
    }
  }

});
