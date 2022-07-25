import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {moderateScale} from 'react-native-size-matters';

export default function LoadingIndicator() {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator
        style={{marginBottom: moderateScale(8)}}
        color={'blue'}
        size={moderateScale(32)}
      />
      <Text>Loading ...</Text>
    </View>
  );
}
