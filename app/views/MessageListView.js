import { StyleSheet, FlatList, ScrollView, Text } from 'react-native'
import React, { useEffect, useRef, useState,  } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  const ref = useRef();

  return (
    <ScrollView 
      style={style}
      ref={ref}
      onContentSizeChange={() => {ref.current.scrollToEnd({animated: 'true'})}}
    >
      {messages.map(message => {
        return <MessageView message={message} event={event} key={message.id}/>;
      })}
    </ScrollView>
  )
}