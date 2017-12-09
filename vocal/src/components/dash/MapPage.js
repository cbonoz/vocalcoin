import React, { Component } from 'react'
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
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          const self = this;
          const currBounds = refs.map.getBounds();
          this.setState({
            center: refs.map.getCenter(),
            bounds: currBounds
          });
          const sw_lat = currBounds.getSouthWest().lat();
          const sw_lon = currBounds.getSouthWest().lng();
          const ne_lat = currBounds.getNorthEast().lat();
          const ne_lon = currBounds.getNorthEast().lng();
          console.log(`New bounds: ${JSON.stringify(currBounds)}`);

          api.getIssuesForRegion(sw_lat, sw_lon, ne_lat, ne_lon).then((data) => {
            const issues = data.issues;
            self.setState( {issues: issues, error: null} );

          }).catch((err) => {
            const issues = [];
            self.setState( {issues: issues, error: err} );
            // toast(<div><b>There was a problem fulfilling your request: {err}</b></div>);
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
      onPlacesChanged={props.onPlacesChanged}
    >
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
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
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
