/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native"
import {NativeStackScreenProps} from "@react-navigation/native-stack"

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  Modal: undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>

export type RootTabParamList = {
  TabOne: undefined
  TabTwo: undefined
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >

export interface MarkdownEntry {
  type: "markdown"
  id: string
  date: string

  time: string
  content: string
}

export interface ScannedEntry {
  type: "scanned"
  id: string
  date: string

  sequenceNumber: number
  fileUrl: string
  averageColor: string
  width: number
  height: number
  headings?: string[]
}

export interface AudioEntry {
  type: "audio"
  id: string
  date: string

  time: string
  fileUrl: string
}

export type Entry = MarkdownEntry | ScannedEntry | AudioEntry

export type LayerData = Record<string, number | undefined>
