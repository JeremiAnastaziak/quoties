import React, { Component } from 'react';
import firebase from 'firebase';
import Snackbar from 'material-ui/Snackbar';
import uuid from 'uuid/v1';
import Router from '../Router/Router';
import Login from '../Login/Login';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import hideBottomNav from '../../lib/hideBottomNav';

const extractAuthors = quotes =>
  Object.values(quotes || {})
    .reduce((curr, next) =>
      (curr.includes(next.quoteAuthor) ? curr : curr.concat(next.quoteAuthor)), [])
    .sort((a, b) => a[0] > b[0]);

class App extends Component {
    state = {
      quotes: {},
      authors: [],
      activePage: 0,
      checkingActiveSession: true,
      notification: {
        text: '',
        open: false,
      },
    };

    componentDidMount() {
      this.getQuotesFromLocalStorage();
      window.addEventListener('resize', hideBottomNav);

      new firebase.auth()
        .onAuthStateChanged((user) => {
          this.setState({
            checkingActiveSession: false,
            user,
            ref: `users/${(user && user.uid) || null}/quotes/`,
          });

          if (user) {
            firebase
              .database()
              .ref(this.state.ref)
              .on('value', (snapshot) => {
                const quotes = snapshot.val();
                this.setState({
                  authors: extractAuthors(quotes),
                  quotes,
                });
              });
          }
        });
    }

    componentDidUpdate() {
      window.localStorage.setItem('quoties', JSON.stringify(this.state));
    }

    getQuotesFromLocalStorage() {
      const storageDate = window.localStorage.getItem('quoties');
      if (storageDate) {
        const { quotes } = JSON.parse(storageDate);
        this.setState({
          quotes,
        });
      }
    }

    notify = (text, open = true) => {
      this.setState({
        notification: { text, open },
      });
    }

    submitQuote = (quoteId, quote) => {
      firebase
        .database()
        .ref(this.state.ref.concat(quoteId || uuid()))
        .set({ ...quote })
        .then(() => this.notify('Quote submitted'))
        .catch(console.error);
    };

    deleteQuote = (quoteId) => {
      firebase
        .database()
        .ref(this.state.ref.concat(quoteId))
        .remove()
        .then(() => this.notify('Quote deleted'))
        .catch(console.error);
    };

    render() {
      return (
        <div>
          {this.state.checkingActiveSession && <LoadingScreen /> }
          {
            !this.state.user ?
              <Login /> :
              <Router
                quotes={this.state.quotes}
                authors={this.state.authors}
                submitQuote={this.submitQuote}
                deleteQuote={this.deleteQuote}
              />
            }
          <Snackbar
            open={this.state.notification.open}
            message={this.state.notification.text}
            autoHideDuration={3000}
            onRequestClose={() => this.notify('', false)}
          />
        </div>
      );
    }
}

export default App;
