import { css, jsx } from '@emotion/react'
import { curry } from 'ramda'
import { Button as RawButton } from 'rebass'
import {
  Radio as RawRadio,
  Input as RawInput,
  Label as RawLabel
} from '@rebass/forms'
import styled from '@emotion/styled'

import { SENTIMENTAL_COLORS } from './constants'

export const Button = styled(RawButton)(`
  background-color: #0c8217;
  font-weight: bold;
  margin: 1rem;
`)

export const Options = styled.ul(`
  display: flex;
  opacity: ${({ active }) => (active ? 1 : 0)};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 3rem;
  min-height: 3rem;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
  background-color: rgba(0,0,0,0.2);
`)

export const Option = styled.li(`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 50%;
  padding: 0;
  min-height: 2rem;
  list-style: none;
  &:first-of-type {
    border-right: 1px solid #aaa;
  }
  &:last-of-type {
    border-left: 1px solid #ddd;
  }
`)

export const Game = styled.section(`
  display: flex;
  width: calc(100% - 2rem);
  height: calc(100% - 2rem);
  flex-direction: column;
  padding: 1rem;
  background-color: ${({ sentiment }) => 'sentiment' || '#ff0000'};
  table {
    display: inline-table;
    border: 1px solid black;
    width: width(100% - 4rem);
    margin: 2rem;
    min-width: 30rem;
    tr {
      background-color: #fff;
      border: 1px dashed blue;
    }
    td {
      padding: 0.5rem;
      text-align: center;
      &:first-of-type {
        text-align: left;
      }
    }
  }
`)

export const Message = styled.p(`
  padding: 1rem;
  margin: 3rem auto;
`)

const labelStyle = ({ active }) =>
  css`
    justify-content: center;
    cursor: pointer;
    min-width: 8rem;
    border-radius: 0.5rem;
    background-color: ${active ? 'purple' : 'transparent'};
    justify-content: space-around;
    color: ${active ? 'white' : '#ccc'};
    padding: 0.75rem;
    svg {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
    &:hover {
      background-color: purple;
      color: white;
      svg {
        fill: white;
      }
    }
  `

export const TryAgain = styled(RawLabel)(`
  ${labelStyle};
  padding-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`)

export const SubmitScore = styled(RawLabel)(`
  ${labelStyle};
  padding-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`)
export const SendScore = styled.aside(`
  justify-content: center;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
`)

export const UserLabel = styled.label(`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  font-weight: bold;
`)

export const UserName = styled.input(`
  margin: 0 1rem;
  font-size: 1rem;
  display: block;
  padding: 0.5rem;
  width: 40%;
`)

export const AttemptButton = styled.button(`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: space-around;
  justify-content: space-around;
  width: 15%;
  min-width: 12rem;
  max-width: 16rem;
  cursor: pointer;
  margin: 1rem 0;
  color: white;
  background-color: #0c8217;
  border: none;
  border-radius: 0.5rem;
  align-self: center;
  transition: background 0.3s ease-out, color 0.4s ease-out;
  
  &::before {
    content: "🎲";
    display: inline-block;
    margin-right: 0.5rem;
    transition: transform 0.2s ease-out;
  }
  &:hover {
    background-color: #17531d;
    color: #8c8;
    text-shadow: 0 1px 1px rgba(0,0,0,0.4);
    &::before {
      transform: scale(1.9);
      transition: transform 0.1s ease-in;
    }
  }
`)
