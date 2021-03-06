import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import {Switch, Route} from 'react-router-dom'; 
import MainRandomQuote from "./components/MainRandomQuote";
import Header from "./components/Header";
import Character from "./components/Character";

//App is the main component in charge to contain all the components used in this project
class App extends Component {
  constructor(props) {
    super(props);
    this.timer="";
    this.state = {
      allNames: [],
      mainRandomQuote:[],
      allData:[],
      newCharacter:true,
      clicked:false
    };
  }
  //getMainRandomQuote is in charge to get fetch data form the Random quote endpoint
  //from the Game of thrones API
  getMainRandomQuote = () =>{
    axios.get("https://game-of-thrones-quotes.herokuapp.com/v1/random",
    {
        headers: {
          Accept: "application/json",
        },
      }
    ).then((response) => {
      this.setState({
        mainRandomQuote: response.data,
      });
    });
  }
  //compoenenDidMount is in chage to download data to get the characters info
  componentDidMount = () => {
    axios.get("https://game-of-thrones-quotes.herokuapp.com/v1/random/10",
      {
          headers: {
            Accept: "application/json",
          },
        }
      ).then((response) => {
        let names=[];
        response.data.map((obj)=>{
          if(names.length>0){
              let load=true;
              for(let i=0;i<names.length;i++)
                  if(names[i]===obj.character.name){
                      load=false;
                      break;
                  }
              if(load) names.push(obj.character.name);  
          }else names.push(obj.character.name);
        })
        this.setState({
          allNames: names,
          allData: response.data
        });
      });
      this.getMainRandomQuote();
      this.time = setInterval(this.getMainRandomQuote,6000)
  }
  //Change character is a "bell" function that indicates App the single player
  //is changing on Character component.
  changeCharacter = (value) =>{
    this.setState({
      newCharacter:value,
      clicked:!this.state.clicked
    })
  }
  render() {
    return (
      <div className="App">
        <Header allNames={this.state.allNames} selectedCharacter={this.selectedCharacter} getMainRQ={this.getMainRandomQuote} changeCharacter={this.changeCharacter} />
        <main className ="mainContainer">
          <banner className="banners" id="b1"></banner>
          <Switch>
            <Route exact path="/" render={(routerProps)=><MainRandomQuote {...this.state}{...routerProps}/>}/>
            <Route path="/character/:name" render={(routerProps)=><Character {...this.state}changeCharacter={this.changeCharacter}{...routerProps}/>}/>
          </Switch>
          <banner className="banners" id="b2"></banner>
        </main>
        <footer className="footer">
          <p className="sign">Inspirational GOT Quotes, by Edgar and Sachin.</p>
        </footer>
      </div>
    );
  }
}

export default App;