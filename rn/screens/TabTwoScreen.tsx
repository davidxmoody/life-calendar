import React, {useEffect, useState} from "react"
import {FlatList, StyleSheet, View} from "react-native"

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
      style={styles.container}
      renderItem={({item, index}) => {
        return (
          <View key={index}>
            <Text>{JSON.stringify(item)}</Text>
          </View>
        )
      }}
      data={entries ?? []}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
