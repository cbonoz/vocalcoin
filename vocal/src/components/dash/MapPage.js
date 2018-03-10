import React, {Component} from 'react'
import {Button} from 'react-bootstrap';
import IssueModal from './../modals/IssueModal';
import VoteModal from './../modals/VoteModal';
import {geolocated} from 'react-geolocated';
import maputil from '../../utils/maputil';
import api from '../../utils/api';
import helper from '../../utils/helper';

import {firebaseAuth} from '../../utils/fire';

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";

import _ from "lodash";
import {compose, withProps, lifecycle} from "recompose";
import {toast} from 'react-toastify';

import {SearchBox} from "react-google-maps/lib/components/places/SearchBox";
import {MarkerClusterer} from "react-google-maps/lib/components/addons/MarkerClusterer";

import {MarkerWithLabel} from "react-google-maps/lib/components/addons/MarkerWithLabel";

const google = window.google;
// https://github.com/googlemaps/v3-utility-library/issues/393 (use fixed api version).
// https://console.developers.google.com/apis/credentials/key/39?authuser=0&project=vocal-1514420086329&pli=1
const MapWithASearchBox = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${maputil.apiKey}&v=3.31&libraries=geometry,drawing,places`,
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `800px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {};
            // console.log('coords', this.props.coords);
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
                hasVoted: false,
                lastCenter: null,
                center: {
                    lat: latitude, lng: longitude
                },
                markers: [],
                issues: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                triggerVoteModal: (issue, trigger) => {
                    const self = this;
                    if (trigger) {
                        const isOpen = this.state.showVoteModal;
                        self.setState({showVoteModal: !isOpen});
                    }

                    self.setState({currentIssue: issue, hasVoted: false});
                    if (self.state.showVoteModal) {
                        const userId = self.props.currentUser.uid;
                        const issueId = issue.id;
                        self.setState({error: null});

                        // console.log('check voted', userId, issueId);
                        api.getHasVoted(userId, issueId).then((res) => {
                            // console.log('hasVoted', res);
                            self.setState({hasVoted: res});
                        }).catch((err) => {
                            self.setState({hasVoted: false, error: err});
                        });
                    }
                },
                toggleVoteModal: () => {
                    const isOpen = this.state.showVoteModal;
                    this.setState({showVoteModal: !isOpen})
                },
                toggleIssueModal: () => {
                    const isOpen = this.state.showIssueModal;
                    this.setState({showIssueModal: !isOpen})
                },
                onBoundsChanged: () => {
                    const self = this;
                    const currBounds = refs.map.getBounds();
                    self.setState({
                        center: refs.map.getCenter(),
                        bounds: currBounds,
                        enableRefreshButton: true
                    });
                },
                getIssuesForRegion: () => {
                    const self = this;
                    self.setState({enableRefreshButton: false, error: null});
                    const currBounds = refs.map.getBounds();
                    const sw_lat = currBounds.getSouthWest().lat();
                    const sw_lon = currBounds.getSouthWest().lng();
                    const ne_lat = currBounds.getNorthEast().lat();
                    const ne_lon = currBounds.getNorthEast().lng();
                    api.getIssuesForRegion(sw_lat, sw_lon, ne_lat, ne_lon).then((issues) => {
                        // console.log('issues', JSON.stringify(issues));
                        self.setState({issues: issues, error: null});
                    }).catch((err) => {
                        toast(<div><b>Error retrieving issues: Server Offline</b></div>);
                        self.setState({issues: [], error: err});
                    });
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const self = this;
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

                    // console.log('nextLocation', JSON.stringify(nextLocation));

                    this.setState({
                        center: nextCenter,
                        lastCenter: nextCenter,
                        markers: nextMarkers,
                        lastLocation: nextLocation
                    });
                    self.state.getIssuesForRegion();
                    // refs.map.fitBounds(bounds);
                },
            });
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
            onBoundsChanged={props.onBoundsChanged}>

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
                    {<Button disabled={!props.enableRefreshButton} bsStyle="danger" className="start-button"
                             onClick={props.getIssuesForRegion}>
                        Redo Search in Area
                    </Button>}

                </div>
            </SearchBox>

            {/* gridSize={60}> */}
            <MarkerClusterer
                onClick={props.onMarkerClustererClick}
                icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "blue",
                    scale: 3
                }}
                averageCenter
                enableRetinaIcons
                gridSize={120}>

                {/* From places search */}
                {props.markers.map((marker, index) =>
                    <MarkerWithLabel
                        key={index}
                        position={marker.position}
                        labelAnchor={new google.maps.Point(125, 0)}
                        labelStyle={{
                            backgroundColor: "#fff",
                            fontSize: "16px",
                            padding: "5px",
                            width: "250px",
                            margin: "0 auto"
                        }}>
                        <div>
                            Creating an issue will appear here.
                        </div>
                    </MarkerWithLabel>
                )}

                {/* From issues in region */}
                {props.issues.map((issue, index) => {
                    const position = {lat: issue['lat'], lng: issue['lng']};
                    const createdAt = helper.formatDateTimeMs(issue['time']);
                    const title = helper.capitalize(issue['title']);

                    return (<MarkerWithLabel
                        key={index}
                        position={position}
                        onClick={() => props.triggerVoteModal(issue, true)}
                        onDblClick={() => props.triggerVoteModal(issue, true)}
                        labelAnchor={new google.maps.Point(125, 80)}
                        labelStyle={{
                            backgroundColor: "#fff",
                            color: "#3b5998",
                            fontSize: "12px",
                            'padding-left': "8px",
                            'padding-right': "8px",
                            width: "250px"
                        }}>
                        {/* Label content */}
                        <div>
                            Active Issue:<br/><b>{title}</b><br/>
                            Started: <b>{createdAt}</b>

                        </div>

                    </MarkerWithLabel>)
                })}
            </MarkerClusterer>

            <IssueModal
                currentUser={props.currentUser}
                lastLocation={props.lastLocation}
                center={props.lastCenter || props.center}
                toggleIssueModal={props.toggleIssueModal}
                showIssueModal={props.showIssueModal}/>

            <VoteModal
                hasVoted={props.hasVoted}
                currentUser={props.currentUser}
                issue={props.currentIssue}
                center={props.center}
                triggerVoteModal={(issue) => props.triggerVoteModal(issue, false)}
                toggleVoteModal={props.toggleVoteModal}
                showVoteModal={props.showVoteModal}/>

        </GoogleMap>
    </div>
);

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
            self.setState({currentUser: user});
        })
    }

    componentWillUnmount() {
        this.removeListener();
    }

    render() {
        return (
            <div>
                <MapWithASearchBox currentUser={this.state.currentUser}/>
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

