import {useState} from "react"
import {Button, StyleSheet} from "react-native"

import {Text, View} from "../components/Themed"
import {sync, SyncStats} from "../db"
import {RootTabScreenProps} from "../types"

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [syncResults, setSyncResults] = useState<SyncStats | null>(null)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        onPress={async () => {
          try {
            setSyncResults(await sync())
          } catch (e) {
            console.log(e)
          }
        }}
        title="Sync"
      />
      <Text style={{marginTop: 16}}>{JSON.stringify(syncResults)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
