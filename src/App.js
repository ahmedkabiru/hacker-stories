//import './App.css';
import React from "react";
import axios from "axios";
import styles from  "./App.module.css"
import cs from "classnames"

const  API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );
    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);
    return [value, setValue]
};

const  storiesReducer = (state, action) =>{
    switch (action.type){
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter((story) => {
                    return action.payload.objectID !== story.objectID
                })
            }
        default:
            throw  new Error();
    }
};
const App = () => {
    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );
    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

   const  handleFetchStories = React.useCallback(async () => {
        //if(!searchTerm) return;
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        try{
            const  result =  await axios.get(url);
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });

        }catch{
            dispatchStories({ type: 'STORIES_FETCH_FAILURE'});
       }

    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSearchSubmit = (event) =>{
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();
    }
    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.headlinePrimary}> My Hacker Stories</h1>

            <SearchForm  searchTerm={searchTerm}
                         handleSearchInput={handleSearchInput}
                         handleSearchSubmit={handleSearchSubmit}
            />

            <hr/>
            {stories.isError && <p> Something went wrong </p>}
            { stories.isLoading ? (
                <p>Loading...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory}/>
            )}
        </div>
    );
}

const SearchForm = ({searchTerm,handleSearchInput,handleSearchSubmit}) => {

    return(
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={handleSearchInput}>
                <strong>Search:</strong>
            </InputWithLabel>

            <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.button_large}`}>Submit</button>
        </form>
    )
}
const Search = ({search, onSearch}) => {
    console.log('Search Renders')
    return (
        <>
            <label htmlFor="search"> Search: </label>
            <input id="search" type="text" value={search} onChange={onSearch}/>
        </>
    )
}


const InputWithLabel = ({id, value, type = 'text', isFocused, onInputChange, children}) => {

    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isFocused])

    return (
        <>
            <label htmlFor={id} className={styles.label}>{children}</label>
            <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} className={styles.input}/>
        </>
    )


};

function List({list, onRemoveItem}) {
    console.log('List Renders')
    return (<ul>
            {list.map((item) => {
                return (
                    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
                )
            })}
        </ul>
    );
}

const Item = ({item, onRemoveItem}) => {
    return (
        <li className={styles.item}>
                    <span style={{ width: '40%' }}>
                            <a href={item.url}>{item.title}</a>
                    </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
                <button type="button" onClick={() => onRemoveItem(item)} className={cs(styles.button,styles.button_small)}>
                    Dismiss
                </button>
            </span>
        </li>
    );
}


export default App;
