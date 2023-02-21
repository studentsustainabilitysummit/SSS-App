import { StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useRef, useState,  } from 'react'
import FireClient from '../FireClient';
import MessageView from './MessageView';

export default function MessageListView({style, messages, event}) {

  return (
    <FlatList
    style={style}
    inverted
    data={[...messages].reverse()} 
    renderItem={({item}) => <MessageView message={item} event={event}/>}
    />
  )
}