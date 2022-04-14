import React, {useEffect, useState} from "react"
import {FlatList, View} from "react-native"
import Markdown from "@flowchase/react-native-markdown-display"

import {Text} from "../components/Themed"
import {getEntries} from "../db"
import {Entry} from "../types"

export default function TabTwoScreen() {
  const [entries, setEntries] = useState<null | Entry[]>(null)

  useEffect(() => {
    getEntries().then(setEntries)
  }, [])

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      renderItem={({item, index}) => {
        return (
          <View key={index}>
            {item.type === "markdown" ? (
              <View style={{backgroundColor: "white"}}>
                <Text>Hello {item.date}</Text>
                <Markdown>{item.content}</Markdown>
              </View>
            ) : (
              <Text>{JSON.stringify(item)}</Text>
            )}
          </View>
        )
      }}
      data={entries ?? []}
    />
  )
}
