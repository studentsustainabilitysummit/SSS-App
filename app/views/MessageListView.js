import { FlatList, Keyboard } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  const ref = useRef();
  const fireclient = FireClient.getInstance();

  const scrollToBottom = (animated=true) => {
    if(messages.length > 0) {
      ref.current.scrollToEnd({animated});
    }
  }

  useEffect(() => {
    if(ref.current.offset < 70 || (messages.length > 0 && messages[messages.length - 1].sender === fireclient.user.email)) {
      scrollToBottom();
    }

  });

  return (
    <FlatList
      style={style}
      ref={ref}
      data={messages} 
      renderItem={({item}) => <MessageView message={item} event={event}/>}
      onScroll={(e) => {ref.current.offset = e.nativeEvent.contentOffset.y}}
      onContentSizeChange={() => {scrollToBottom(false)}}
    />
  )
}