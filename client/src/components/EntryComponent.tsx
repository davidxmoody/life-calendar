import * as React from "react"
import styled from "styled-components"
import ReactMarkdown from "react-markdown"
import {Entry} from "../helpers/useWeekEntries"

interface Props {
  entry: Entry
}

export default function EntryComponent(props: Props) {
  return (
    <Container>
      <DateContainer>{props.entry.date}</DateContainer>
      <ReactMarkdown>{props.entry.content}</ReactMarkdown>
    </Container>
  )
}

const Container = styled.div`
  padding: 8px;
  border: 1px solid grey;
`

const DateContainer = styled.div`
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid grey;
`
