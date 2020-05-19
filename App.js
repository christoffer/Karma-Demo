import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  StyleSheet,
} from 'react-native';

import { getLocations } from './data/api';
import { LocationsList } from './ui/LocationList';

const LOAD_STATUS_NONE = 0;
const LOAD_STATUS_LOADING = 1;
const LOAD_STATUS_ERROR = 2;

const originLoc = { latitude: 59.330596, longitude: 18.0560967 };

const LoadingLabel = ({loadStatus}) => {
  let text = null;
  if (loadStatus == LOAD_STATUS_LOADING) {
    text = 'Loading...';
  } else if (loadStatus == LOAD_STATUS_ERROR) {
    text = 'Error while loading data. Offline?';
  } else {
    return null; // nothing to display
  }

  return <Text style={styles.loadingText}>{text}</Text>;
}

const App = () => {
  const [locationItems, setLocationItems] = useState(null);
  const [followedLocationIds, setFollowedLocationIds] = useState({});
  const [loadStatus, setLoadStatus] = useState(LOAD_STATUS_NONE);

  if (locationItems == null && loadStatus == LOAD_STATUS_NONE) {
    setLoadStatus(LOAD_STATUS_LOADING);
    getLocations(originLoc).then((locationItems) => {
      // The server is the authority on the follow state for locations, so make sure to update 
      // the local state to mirror any changes. 
      const updatedLocationFollows = locationItems.reduce((res, locData) => {
        if (locData.isFollowed) {
          res[locData.id] = true;
        } else {
          delete res[locData.id];
        }
        return res;
      }, Object.assign({}, followedLocationIds));

      setLocationItems(locationItems);
      setFollowedLocationIds(updatedLocationFollows);
      setLoadStatus(LOAD_STATUS_NONE);
    })
      .catch((reason) => {
        console.log(`Error while retriving location data: ${reason}`);
        setLoadStatus(LOAD_STATUS_ERROR);
      });
  }

  const handleLocationFollowChange = ({ id, isFollowed }) => {
    setFollowedLocationIds((followedLocationIds) => {
      // NOTE(christoffer) Return new object instance to make React trigger re-render
      return Object.assign({}, followedLocationIds, { [id]: isFollowed });
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <LoadingLabel loadStatus={loadStatus} />
        <LocationsList
          locations={locationItems}
          followedLocationIds={followedLocationIds}
          onLocationFollowChange={handleLocationFollowChange}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: '25%',
  },
});

export default App;
