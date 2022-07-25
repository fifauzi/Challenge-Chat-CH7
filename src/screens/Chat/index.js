import React, {useState, useCallback, useEffect} from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import {myDb} from '../../helpers/Db';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {generateRoomId} from '../../helpers/generateRoomId';

export default function Chat({navigation}) {
  const [user, setUser] = useState({messages: []});
  const {_user} = useSelector(state => state.login);
  const {_choosenUser} = useSelector(state => state.dash);

  const createIntialData = useCallback(() => {
    try {
      myDb
        .ref(`chatRooms/${generateRoomId(_user._id, _choosenUser._id)}`)
        .on('value', res => {
          const userData = res.val();
          console.log('======= ', userData);
          console.log(_choosenUser._id);
          if (userData) {
            if (userData.messages) {
              setUser(userData);
            } else {
              setUser(prevState => {
                return {...prevState, ...userData, messages: []};
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [_choosenUser._id, _user._id]);

  useEffect(() => {
    createIntialData();
  }, [createIntialData]);

  const onSend = useCallback(
    async (sendedMessage = []) => {
      await myDb
        .ref(`chatRooms/${generateRoomId(_user._id, _choosenUser._id)}`)
        .update({
          messages: [
            ...user.messages,
            {
              ...sendedMessage[0],
              idx: user.messages?.length + 1,
              sender: _user.displayName,
              createdAt: new Date(),
            },
          ],
        });
    },

    [
      _user._id,
      user.messages,
      _choosenUser._id,
      _user.displayName,
      _choosenUser.notifToken,
    ],
  );
  console.log(user.messages);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 20,
          backgroundColor: '#ffff',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-chevron-back-outline" size={32} color="#0F3D3E" />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1,
            marginLeft: 10,
          }}>
          <Image
            style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
            source={{uri: _choosenUser.photoURL}}
          />
          <Text>{_choosenUser.displayName}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={{marginRight: 10}}>
            <Ionicons name="videocam-outline" size={30} color="#0F3D3E" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ios-call-outline" size={28} color="#0F3D3E" />
          </TouchableOpacity>
        </View>
      </View>
      <GiftedChat
        messages={user.messages?.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })}
        messagesContainerStyle={{backgroundColor: '#0F3D3E'}}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: 'white',
                },
                right: {
                  backgroundColor: '#3bff58',
                },
              }}
            />
          );
        }}
        onSend={sendedMessage => {
          onSend(sendedMessage);
        }}
        user={{
          _id: _user._id,
          name: _user.name,
          bio: _user.bio,
          avatar:
            _user.photoURL ?? 'https://randomuser.me/api/portraits/men/36.jpg',
        }}
      />
    </>
  );
}
