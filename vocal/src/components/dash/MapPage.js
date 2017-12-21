import React, { Component } from 'react'
import {Button} from 'react-bootstrap';
import IssueModal from './../modals/IssueModal';
import Geolocation from "react-geolocation";
import maputil from '../../utils/maputil';
import api from '../../utils/api';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import _ from "lodash";
import { compose, withProps, lifecycle } from "recompose";
import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
const google = window.google

const MapWithASearchBox = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${maputil.apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `800px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        error: null,
        showModal: false,
        enableRefreshButton: false,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        toggleModal: () => {
          const isOpen = this.state.showModal;
          this.setState({showModal: !isOpen})
        },
        onBoundsChanged: () => {
          const self = this;
          const currBounds = refs.map.getBounds();
          self.setState({
            center: refs.map.getCenter(),
            bounds: currBounds,
            enableRefreshButton: true
          });
          
          // console.log(`New bounds: ${JSON.stringify(currBounds)}`);
        },
        getIssuesForRegion: () => {
          const self = this;
          self.setState({enableRefreshButton: false});
          const currBounds = refs.map.getBounds();
          const sw_lat = currBounds.getSouthWest().lat();
          const sw_lon = currBounds.getSouthWest().lng();
          const ne_lat = currBounds.getNorthEast().lat();
          const ne_lon = currBounds.getNorthEast().lng();
          api.getIssuesForRegion(sw_lat, sw_lon, ne_lat, ne_lon).then((data) => {
            const issues = data.issues;
            self.setState( {issues: issues, error: null} );
          }).catch((err) => {
            const issues = [];
            toast(<div><b>Error retrieving issues: Server Offline</b></div>);
            self.setState( {issues: issues, error: err} );
          });
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });

          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <div>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}>
      <div>
        <input
          type="text"
          placeholder="Jump to a Location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />

        <Button bsStyle="success" className="start-button" onClick={props.toggleModal}>
          Create New Issue
        </Button>
        {<Button disabled={!props.enableRefreshButton} bsStyle="danger" className="start-button" onClick={props.getIssuesForRegion}>
          Redo Search in Area
        </Button>}
        
      </div>
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
    </GoogleMap>
    <IssueModal toggleModal={props.toggleModal} showModal={props.showModal}/>
  </div>
);


// TODO: retrieve markers near user location programmatically
export default class MapPage extends Component {
  render() {
    return (
      <div>
        <MapWithASearchBox />
      </div>
    )
  }
}
