import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './STORE/store';
import App from './App';
import { fetchPosts } from './STORE/postsSlice';
import { fetchUsers } from './STORE/usersSlice';

store.dispatch(fetchPosts());
store.dispatch(fetchUsers());
ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>
  ,document.querySelector('#root')
);