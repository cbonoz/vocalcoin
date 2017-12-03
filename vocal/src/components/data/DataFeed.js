/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import StackGrid, { transitions, easings } from 'react-stack-grid';
import helper from '../../utils/helper';

const itemModifier = [
  'gray'
];

export default class DataFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: 480,
      columnWidth: "100%",
      gutter: 5,
      easing: easings.quartOut,
      transition: 'fadeDown',
    };
  }
  
  render() {
    const {
      items,
      duration,
      columnWidth,
      gutter,
      easing,
      transition: transitionSelect,
    } = this.state;

    const transition = transitions[transitionSelect];
    const self = this;
    
    const blockHtml = self.props.blocks.map((item, index) =>
        (<div
          key={index}
          className={`item item--${item.modifier} feed-item`}
          style={{ height: 75 }}
        ><span className='transaction bold'>{item.name}<br/></span><span>
          - {helper.formatDateTimeMs(parseInt(item.time))}</span>
        {/* <img className="check-icon" src={checkmark}/> */}
        </div>)
    );

    return (
      <div>
        {/* <h4 className="centered feed-heading">Activity Feed</h4> */}
        <StackGrid
          duration={duration}
          columnWidth={columnWidth}
          gutterWidth={gutter}
          gutterHeight={gutter}
          easing={easing}
          appear={transition.appear}
          appeared={transition.appeared}
          enter={transition.enter}
          entered={transition.entered}
          leaved={transition.leaved}
        >
        {blockHtml}
        </StackGrid>
      </div>
    );
  }
}