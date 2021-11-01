import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postRemove, selectAllPosts, postsLength } from "./STORE/postsSlice";
import { selectUserById, selectAllUsers } from "./STORE/usersSlice";
import './CSS/loader.css';
import './CSS/main.scss';

// const Author = ({id}) => {
//   const author = useSelector(state => selectUserById(state, id));
//   return <span>{author.name}</span>;
// }

const funcSort = {
  byId: {
    up: (a, b) => a.id - b.id,
    down: (a, b) => b.id - a.id
  },
  byTitle: {
    up: (a, b) => {
      const x = a.title.toLowerCase();
      const y = b.title.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    },
    down: (a, b) => {
      const x = a.title.toLowerCase();
      const y = b.title.toLowerCase();
      if (x < y) {return 1;}
      if (x > y) {return -1;}
      return 0;
    }
  },
  byAuthorName: {
    up: (a, b) => {
      const x = a.author.toLowerCase();
      const y = b.author.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    },
    down: (a, b) => {
      const x = a.author.toLowerCase();
      const y = b.author.toLowerCase();
      if (x < y) {return 1;}
      if (x > y) {return -1;}
      return 0;
    }
  }
}

export default function App() {
  const {status: statusPosts, error: errorPosts} = useSelector(state => state.posts);
  const {status: statusUsers, error: errorUsers} = useSelector(state => state.users);
  const posts = useSelector(selectAllPosts);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const length = useSelector(postsLength);
  const pagesAmount = useMemo(() => length ? Math.ceil(length / perPage) : 0, [length, perPage]);
  const [sort, setSort] = useState({by: 'byId', dir: 'up'});
  const users = useSelector(selectAllUsers);
  const author = id => users.find(val => val.id === id).name;

  const handlePerPage = ev => {
    const value = Number(ev.currentTarget.value);
    setPerPage(value <= 1 ? 1 : Math.min(value, 100));
    setPage(0);
  }
  const handlePage = ev => {
    const value = Number(ev.currentTarget.value) - 1;
    setPage(value <= 0 ? 0 : Math.min(value, pagesAmount -1));
  }
  const handleSort = ev => {
      setSort(prev => ev.target.tagName === 'SELECT' ? ({...prev, by: ev.target.value}) : 
      prev.dir === 'up' ?  ({...prev, dir: 'down'}) : ({...prev, dir: 'up'})
      );
      setPage(0);
  }
  const handleMoreClick = ev => {
    let whiteSpace, text;
    if(ev.target.parentElement.style.whiteSpace === 'initial'){
      whiteSpace = 'nowrap';
      text = 'more...';
    } else {
      whiteSpace = 'initial';
      text = 'less...'
    }
    ev.target.parentElement.style.whiteSpace = whiteSpace;
    ev.target.innerText = text;
  }
  if (statusPosts === 'loadung' || statusUsers === 'loading') return <div className = 'loader'>...loading</div>
  if (statusPosts === 'error' || statusUsers === 'error') {
    return <div>{errorPosts ? errorPosts : errorUsers}</div>;
  }    
  if (statusPosts === 'complete' && statusUsers === 'complete'){
    const renderedPostst = posts.map(val => ({...val, author: author(val.userId)}))
    .sort(funcSort[sort.by][sort.dir]).map((val, index) => {
      if (val)
        return (
          <div key = {index}>
            <p>{val.title}</p>
            <div className = 'postBody'>
              {val.body}
              <div onClick = {handleMoreClick}>more...</div>
            </div>
            <p>by {val.author}</p>
            <button onClick = {() => dispatch(postRemove(val.id))}>delete</button>
            <br/>
          </div>
        );
      return null;
    });
    return (
      <div className = 'mainContainer'>
        <div className = 'header'>
          <div>
            <label>
              Posts per page:&nbsp;
              <input type = 'number' value = {perPage} onChange = {handlePerPage}/>
            </label>
            <label className = 'pagination'>
              <span onClick = {() => setPage(0)}>{'\u00ab '}</span>
              <span onClick = {() => setPage(prev => Math.max(prev-1, 0))}>{' \u2039 '}</span>
              &nbsp;Page:&nbsp;
              <input type = 'number' value = {page + 1} onChange = {handlePage}/>
              &nbsp;of {pagesAmount}&nbsp;
              <span onClick = {() => setPage(prev => Math.min(prev + 1, pagesAmount -1))}>{' \u203a '}</span>
              <span onClick = {() => setPage(pagesAmount-1)}>{' \u00bb '}</span>
            </label>
          </div>
          <div>
            <label>
              sort by:&nbsp;
              <select value = {sort.by} onChange = {handleSort}>
                <option value = 'byId'> id</option>
                <option value = 'byTitle'> title</option>
                <option value = 'byAuthorName'> author name</option>
              </select>
              &nbsp;
              <span onClick = {handleSort}>{sort.dir === 'up' ? '\u2191' : '\u2193'}</span>
            </label>
          </div>
          <hr/>
        </div>
        <br/>
        <div className = 'postsContainer'>
          {renderedPostst.slice(page * perPage, page * perPage + perPage)}
        </div>
      </div>
    );
  } 
  return 'Undefinite error...';
}