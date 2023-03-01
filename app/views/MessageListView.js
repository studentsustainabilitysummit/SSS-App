import { FlatList, Keyboard } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  const flatListRef = useRef();
  const offsetRef = useRef(Number.MAX_VALUE);
  
  const fireclient = FireClient.getInstance();

  const scrollToBottom = (animated=true) => {
    if(messages.length > 0) {
      flatListRef.current.scrollToEnd({animated});
    }
  }

  useEffect(() => {
    if(flatListRef.current.offset < 70 || (messages.length > 0 && messages[messages.length - 1].sender === fireclient.user.email)) {
      scrollToBottom();
    }

  });

  return (
    <FlatList
      style={style}
      ref={flatListRef}
      data={messages} 
      renderItem={({item}) => <MessageView message={item} event={event}/>}
      onScroll={(e) => {offsetRef.current = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentOffset.y}}
      onContentSizeChange={() => {scrollToBottom(false)}}
    />
  )
}