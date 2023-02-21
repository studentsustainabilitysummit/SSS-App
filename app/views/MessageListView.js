import { StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useRef, useState,  } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({event, style}) {

    const fireclient = FireClient.getInstance();
    const [messages, setMessages] = useState([]);
    const listRef = useRef();

    useEffect(() => {
        listRef.current.scrollToEnd({animated: false});
        return fireclient.registerMessagesCallback(event, setMessages);
    });

  return (
    <FlatList
    style={style}
    data={messages} 
    renderItem={({item}) => <MessageView message={item} event={event}/>}
    ref={listRef}
    />
  )
}