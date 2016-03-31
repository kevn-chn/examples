import {Rx} from '@cycle/core';
import {button, div, input} from '@cycle/dom';
import combineLatestObj from 'rx-combine-latest-obj';

function intent(DOM) {
  const changeColor$ = DOM.select('.color-field')
    .events('input')
    .map(ev => ({color: ev.target.value}));
  const changeWidth$ = DOM.select('.width-slider')
    .events('input')
    .map(ev => ({width: parseInt(ev.target.value)}));
  const changeHeight$ = DOM.select('.height-slider')
    .events('input')
    .map(ev => ({height: parseInt(ev.target.value)}));
  const destroy$ = DOM.select('.remove-btn')
    .events('click')
    .map(ev => true);

  return {changeColor$, changeWidth$, changeHeight$, destroy$};
}

function model(props, actions) {
  const color$ = props.color$.take(1)
    .startWith('#888')
    .concat(actions.changeColor$.map(({color}) => color));
  const width$ = props.width$.take(1)
    .startWith(200)
    .concat(actions.changeWidth$.map(({width}) => width));
  const height$ = props.height$.take(1)
    .startWith(200)
    .concat(actions.changeHeight$.map(({height}) => height));

  return combineLatestObj({color$, width$, height$});
}

function view(state$) {
  return state$.map(({color, width, height}) => {
    const style = {
      // border: '1px solid #000',
      background: 'none repeat scroll 0% 0% ' + color,
      width: width + 'px',
      height: height + 'px',
      display: 'inline-block',
      padding: '20px',
      margin: '10px 10px'
    };
    return div(`.item`, {style}, [
      input('.color-field', {
        type: 'text',
        attributes: {value: color}
      }),
      div('.slider-container', [
        input('.width-slider', {
          type: 'range', min: '200', max: '1000',
          attributes: {value: width}
        })
      ]),
      div('.width-content', String(width)),
      div('.slider-container', [
        input('.height-slider', {
          type: 'range', min: '200', max: '600',
          attributes: {value: height}
        })
      ]),
      div('.height-content', String(height)),
      button('.remove-btn', 'Remove')
    ]);
  });
}

function Item(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(sources.props, actions);
  const vtree$ = view(state$);

  return {
    DOM: vtree$,
    destroy$: actions.destroy$,
  };
}

export default Item;
