import { FlatList, Keyboard } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  const flatListRef = useRef();
  const offsetRef = useRef(Number.MAX_VALUE);
  const timerRef = useRef();
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
      timerRef.current = setTimeout(() => {scrollToBottom(false)}, Platform.OS === 'ios' ? 1 : 100);
    });

    return () => {
      keyboardDidShow.remove();
      clearTimeout(timerRef.current);
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