import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import IssueModal from './../modals/IssueModal';
import VoteModal from './../modals/VoteModal';
import {geolocated} from 'react-geolocated';
import maputil from '../../utils/maputil';
import api from '../../utils/api';
import helper from '../../utils/helper';

import { firebaseAuth } from '../../utils/fire';

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
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

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

      console.log('coords', this.props.coords);
      let latitude = 41.9;
      let longitude = -87.624;
      if (this.props.coords) {
        latitude = this.props.coords.latitude;
        longitude = this.props.coords.longitude;
      }

      this.setState({
        bounds: null,
        error: null,
        showIssueModal: false,
        showVoteModal: false,
        currentIssue: {},
        enableRefreshButton: false,
        lastLocation: null,
        center: {
          lat: latitude, lng: longitude
        },
        markers: [],
        issues: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        triggerVoteModal: (issue) => {
          this.setState( {currentIssue: issue});
          this.toggleVoteModal();
        },
        toggleVoteModal: () => {
          const isOpen = this.state.showVoteModal;
          this.setState({ showVoteModal: !isOpen })
        },
        toggleIssueModal: () => {
          const isOpen = this.state.showIssueModal;
          this.setState({ showIssueModal: !isOpen })
        },
        onBoundsChanged: () => {
          const self = this;
          const currBounds = refs.map.getBounds();
          self.setState({
            center: refs.map.getCenter(),
            bounds: currBounds,
            enableRefreshButton: true
          });
            // lastLocation: "Map moved since last search"

          // console.log(`New bounds: ${JSON.stringify(currBounds)}`);
        },
        getIssuesForRegion: () => {
          const self = this;
          self.setState({ enableRefreshButton: false });
          const currBounds = refs.map.getBounds();
          const sw_lat = currBounds.getSouthWest().lat();
          const sw_lon = currBounds.getSouthWest().lng();
          const ne_lat = currBounds.getNorthEast().lat();
          const ne_lon = currBounds.getNorthEast().lng();
          api.getIssuesForRegion(sw_lat, sw_lon, ne_lat, ne_lon).then((data) => {
            const issues = data.issues;
            self.setState({ issues: issues, error: null });
          }).catch((err) => {
            const issues = [];
            toast(<div><b>Error retrieving issues: Server Offline</b></div>);
            self.setState({ issues: issues, error: err });
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
          let nextLocation = null;

          places.map((place) => {
              if (place.geometry.location === nextCenter) {
                nextLocation = place.name;
              }
          });

          console.log('nextLocation', JSON.stringify(nextLocation));

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            lastLocation: nextLocation
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

          <Button bsStyle="success" className="start-button" onClick={props.toggleIssueModal}>
            Create New Issue
        </Button>
          {<Button disabled={!props.enableRefreshButton} bsStyle="danger" className="start-button" onClick={props.getIssuesForRegion}>
            Redo Search in Area
        </Button>}

        </div>
      </SearchBox>

      <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}>
        {props.markers.map((marker, index) =>
          <Marker
            key={index}
            position={marker.position} />
        )}
        {props.issues.map((issue, index) => {

          const position = {lat: issue.lat, lng: issue.lng};

          // TODO: determine if DblClick should have different behavior from single.
          return (<Marker
            label={issue.title}
            onClick={props.triggerVoteModal(issue)}
            onDblClick={props.triggerVoteModal(issue)}
            key={index}
            position={position} />
          )
        })}
      </MarkerClusterer>
      <IssueModal
        currentUser={props.currentUser}
        lastLocation={props.lastLocation}
        center={props.center}
        toggleIssueModal={props.toggleIssueModal}
        showIssueModal={props.showIssueModal} />
      <VoteModal
        currentUser={props.currentUser}
        issue={props.currentIssue}
        center={props.center}
        toggleVoteModal={props.toggleVoteModal}
        showVoteModal={props.showVoteModal} />
    </GoogleMap>
  </div>
  );

// TODO: retrieve markers near user location programmatically
class MapPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUser: null
    }
  }


  componentDidMount() {
    const self = this;
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      self.setState({ currentUser: user });
    })
  }

  componentWillUnmount() {
    this.removeListener();
  }
  
  render() {
    return (
      <div>
        <MapWithASearchBox currentUser={this.state.currentUser} />
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  },
  userDecisionTimeout: null,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation
})(MapPage);

