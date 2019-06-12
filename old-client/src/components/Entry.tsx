import * as React from "react"
import {Entry} from "src/types"
import styled from "styled-components"
import * as ReactMarkdown from "react-markdown"

interface Props {
  entry: Entry
}

export default class EntryComponent extends React.PureComponent<Props> {
  public render() {
    return (
      <Container>
        <DateContainer>{this.props.entry.date}</DateContainer>
        <MarkdownContainer>
          <ReactMarkdown>{this.props.entry.content}</ReactMarkdown>
        </MarkdownContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid grey;
`

const DateContainer = styled.div`
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid grey;
`

const MarkdownContainer = styled.div``
