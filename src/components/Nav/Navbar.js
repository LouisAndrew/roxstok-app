import React, { Component } from 'react'
import styled from 'styled-components'
import SymbolContext from '../../SymbolContext'
import { ReactComponent as Logo } from './roxstok2.svg'
import Search from './Search'

export default class Navbar extends Component {
    static contextType = SymbolContext

    state = {
        data: [],
        isLoading: false,
        severalResults: false,
        dataFetched: false
    }

    submitSym = async sym => {
        await this.props.load(false)
        
        let result = await this.findSym(sym)
        console.log(result)
        
        if (result) {
            console.log('if result...')
            if (result.length < 2 && result.length > 0) {
                this.context.setSym(result[0].symbol)
            } else {
                this.props.setShowResult(result)
            }
        } else {
            //will result in error page
            this.context.setSym(sym)
        }
        await this.props.load(true)
    }

    getFullData = ( ) => {
        fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=bpiirp7rh5rbgl0lb84g')
        .then(rsp => rsp.ok ? rsp.json() : false)
        .then(data => this.setData(data))
    }

    setData = data => {
        
        console.log(data)
        this.setState(prev => {
          let temp = prev
          temp.data = data
          temp.dataFetched = true
          return temp
        })
    }

    findSym = async sym => {

        let result = [ ]
  
        this.state.data.forEach(x => {
          if (x.description.toUpperCase().search(sym) !== -1 || sym === x.symbol) {
            result = [...result, x]
          } else {
            console.log('not found')
          }
        })
  
        return result ? result: false
    }

    componentDidMount = () => {
        this.getFullData()
    }

    render() {
        return (
            <Container>
                <Logo id='logo-top' />
                {this.state.dataFetched && <Search submitSym={this.submitSym} />}
            </Container>
        )
    }
}

const Container = styled.div`
  ${({ theme }) => theme.fitContainer()};
  padding: 0 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  #logo-top {
      transform: scale(1.4);
  }

  #logo-top path {
      fill: #fff;
  }

  @media only screen and ( min-width: 3000px ) {
      #logo-top {
          transform: scale(5);
          left: 3em;
          position: relative;
      }
  }
`
const Wr = styled.div`
  background-color: #fff;
  ${({ theme }) => theme.fitContainer()};
`