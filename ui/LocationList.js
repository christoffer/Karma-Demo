import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';

import { formatDistanceForHumans } from '../utils/formatters';

// Add a smidge of visual identity to the list items by cycling a colorized dot
// next to the title.
const ITEM_COLORS = [
  '#d88c9a99',
  '#f2d0a999',
  '#f1e3d399',
  '#99c1b999',
  '#8e7dbe99',
  '#4c545499',
  '#ff715b99',
  '#1ea89699',
  '#523f3899',
  '#fe5f5599',
];

const FollowButton = ({ isFollowed, ...rest }) => {
  const title = isFollowed ? 'Following' : 'Follow';
  const color = isFollowed ? styles.followActive.color : styles.followInactive.color;
  const props = {title, color, ...rest};
  return <Button {...props} />
};

const LocationsList = ({ locations, followedLocationIds, onLocationFollowChange }) => {
  const renderItem = ({ item, index }) => {
    const color = ITEM_COLORS[index % ITEM_COLORS.length];
    const dotStyle = { ...styles.dot, backgroundColor: color };
    const isFollowed = !!followedLocationIds[item.id];
    const handleFollowPressed = () => onLocationFollowChange({ id: item.id, isFollowed: !isFollowed });
    const displayDistance = `ca ${formatDistanceForHumans(item.distance)}`; // FIXME(christoffer) translations

    return (
      <View style={styles.item}>
        <View style={dotStyle} />
        <View>
          <Text>{item.name}</Text>
          <Text style={styles.subtext}>{displayDistance}</Text>
        </View>
        <View style={styles.followButtonContainer}>
          <FollowButton isFollowed={isFollowed} onPress={handleFollowPressed} />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      renderItem={renderItem}
      data={locations}
      keyExtractor={(loc) => loc.name}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  followButtonContainer: {
    marginLeft: 'auto',
  },
  followActive: {
    color: '#29ba80',
  },
  followInactive: {
    color: '#555',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#fea',
    marginTop: 5,
    marginEnd: 5,
    borderRadius: 10,
  },
  subtext: {
    color: '#00000088',
  },
});

export {
  LocationsList,
};
