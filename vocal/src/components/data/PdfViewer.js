import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination } from 'react-bootstrap';

import vocalPDF from './vocal.pdf'

export default class PdfViewer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      numPages: 1,
      pageNumber: 1,
      width: 768,
      height: '0'
    }
    this.onDocumentLoad = this.onDocumentLoad.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleSelect(eventKey) {
    this.setState({
      pageNumber: eventKey,
    });
  }

  onDocumentLoad({ numPages }) {
    this.setState({ numPages });
  }

  render() {
    const self = this;

    return (
      <div>
        <Document file={vocalPDF} onLoadSuccess={self.onDocumentLoad}>
          <Page pageNumber={self.state.pageNumber} width={Math.min(768, self.state.width)}/>
        </Document>

        <Pagination
          bsSize="large"
          items={self.state.numPages}
          activePage={this.state.pageNumber}
          onSelect={this.handleSelect}
        />

        <p className="centered page-value">Page <b>{self.state.pageNumber}</b> of <b>{self.state.numPages}</b></p>

        <div className="centered paper-download-link bold">
          {/* TODO: fix url */}
          <a href={vocalPDF} download>Download PDF</a>
        </div>
      </div>
    );
  }
}