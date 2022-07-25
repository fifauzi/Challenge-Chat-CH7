import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';

import {ms} from 'react-native-size-matters';

export const EmptyComponent = ({navigation}, {search}) => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>{search ? 'Search' : 'Add your Friend'} </Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  text: {
    top: ms(-20),
    color: 'black',
    fontSize: ms(16),
  },
  container: {
    height: ms(60),
    backgroundColor: 'white',
    alignItems: 'baseline',
    justifyContent: 'space-around',
    flex: 1,
    flexDirection: 'row',
  },
});
