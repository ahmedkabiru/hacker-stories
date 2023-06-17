import './App.css';
import React from "react";

const  title = 'React';
const  welcome = {
    greeting : 'Hey',
    title : 'React'
};



function  getTitle(title){
    return title;
}

const useSemiPersistentState = (key,initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );
    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value,key]);
    return [value, setValue]
};

const App = () => {
     console.log('App Renders')
    const  initialStories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0,
        }, {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ]
     const  [searchTerm, setSearchTerm] = useSemiPersistentState('search','');
     const  [stories, setStories] = React.useState(initialStories);
     const  handleSearch= (event) => {
        setSearchTerm(event.target.value);
    }
    const handleRemoveStory= (item) => {
         const  newStories = stories.filter((story) => {
            return  item.objectID !== story.objectID
         })
        setStories(newStories);
    }
    const  searchStories = stories.filter((story) =>{
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
  return (
    <div>
      <h1> My Hacker Stories</h1>
       <InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={handleSearch} >
           <strong>Search:</strong>
       </InputWithLabel>
      <h1> {welcome.greeting} { welcome.title }</h1>
       {/*<Search search = {searchTerm} onSearch = {handleSearch}/>*/}
      <hr/>
        <List list = {searchStories} onRemoveItem  = {handleRemoveStory}/>
    </div>
  );
}

const Search =  ({search, onSearch}) => {
    console.log('Search Renders')
   // const {search, onSearch} = props;

    // const  handleChange = (event) =>{
    //    //setSearchTerm(event.target.value);
    //    props.onSearch(event);
    // }
    return(
         <>
            <label htmlFor="search"> Search: </label>
            <input id="search" type="text" value={search}  onChange={onSearch}/>
        </>
    )
}


const  InputWithLabel = ({id, value, type ='text', isFocused, onInputChange, children}) =>{

    const  inputRef = React.useRef();

    React.useEffect(() => {
        if(isFocused && inputRef.current){
            inputRef.current.focus()
        }
    }, [isFocused])

    return(
        <>
            <label htmlFor={id}>{children}</label>
            <input  ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />
        </>
        )


};

function  List({list,onRemoveItem}){
    console.log('List Renders')
    return (<ul>
        {list.map(  (item)  => {
            return (
                <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
            )
        })}
    </ul>
    );
}

const Item = ({item, onRemoveItem}) => {
    // const  handleRemoveItem =() =>{
    //     onRemoveItem(item)
    // }
    return(
        <li>
                    <span>
                            <a href={item.url}>{title}</a>
                    </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
                <button type="button" onClick={() => onRemoveItem(item)}>
                    Dismiss
                </button>
            </span>
        </li>
);
}


export default App;
