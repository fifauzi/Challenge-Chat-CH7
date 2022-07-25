import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';

export default function ChatComp(props) {
  const {name, email, photo, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}>
        <View style={{marginRight: 10}}>
          <Image
            source={{uri: photo}}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
        </View>
        <View
          style={{
            borderBottomColor: '#d1d1d1',
            borderTopWidth: 0,
            borderBottomWidth: 1,
            flex: 1,
          }}>
          <Text>{name}</Text>
          <Text>{email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
