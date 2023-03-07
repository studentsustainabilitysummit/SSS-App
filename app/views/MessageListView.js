import { FlatList, Keyboard, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  const flatListRef = useRef();
  const offsetRef = useRef(Number.MAX_VALUE);
  const keyboardDidShowRef = useRef();
  const keyboardDidHideRef = useRef();
  const scrollOnContentSizeChangeRef = useRef(true);
  const prevMessagesRef = useRef(messages);
  
  const fireclient = FireClient.getInstance();

  const scrollToBottom = (animated=true) => {
    if(messages.length > 0) {
      flatListRef.current.scrollToEnd({animated});
    }
  }

  useEffect(() => {
    if(prevMessagesRef.current.length != 0 && (flatListRef.current.offset < 70 || (messages.length > 0 && messages[messages.length - 1].sender === fireclient.user.email))) {
      scrollOnContentSizeChangeRef.current = false;
      scrollToBottom();
    }

    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      scrollOnContentSizeChangeRef.current = false;
      keyboardDidShowRef.current = setTimeout(() => {scrollToBottom(false)}, Platform.OS === 'ios' ? 1 : 100);
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', (e) => {
      if(Platform.OS === 'android') {
        keyboardDidHideRef.current = setTimeout(() => {scrollToBottom(false)}, 400);
      }
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
      clearTimeout(keyboardDidShowRef.current);
      clearTimeout(keyboardDidHideRef.current);
      prevMessagesRef.current = messages;
    }

  }, [messages]);

  return (
    <FlatList
      style={style}
      ref={flatListRef}
      data={messages} 
      renderItem={({item}) => <MessageView message={item} event={event}/>}
      onScroll={(e) => {offsetRef.current = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentOffset.y}}
      onContentSizeChange={() => {if(scrollOnContentSizeChangeRef.current){scrollToBottom(false);}}}
    />
  )
}