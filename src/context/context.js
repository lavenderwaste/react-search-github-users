import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider or .Consumer

const GithubProvider = ({ children }) => {

  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  
  // request and loading
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // error
  const [error, setError] = useState({
    show:false,
    msg:"",
  });

  // search Github users
  const searchGithubUser = async (user) => {
    
    toggleError() //we call it again, since we have the show=false to remove the alert if new search is required.
    setLoading(true)
    
    const response = await axios(`${rootUrl}/users/${user}`)
    .catch((err) => console.log(err))
    // console.log(response);
    
    if(response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      //fetch with axios repos and followers
      //wait for everything to load before displaying the results with Promise
      await Promise.allSettled(
        [
          axios(`${rootUrl}/users/${login}/repos?per_page=100`),
          axios(`${followers_url}?per_page=100`),
        ]
      ).then((results) => {
        const [repos, followers] = results;
        const status = 'fulfilled';
        if(repos.status === status) {
          setRepos(repos.value.data); //console.log(results) so you can see both objects of repos and followers and distructure the status and data
        }
        if(followers.status === status) {
          setFollowers(followers.value.data); //same but for followers
        }
      }).catch(err => console.log(err));

    } else {
      toggleError(true, 'no user found with that username');
    }
    checkRequests()
    setLoading(false)
  };

  //check rate requests
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data })=>{
        let {rate:{remaining}} = data;
        setRequests(remaining);
        if(remaining === 0) {
          //throw error
          toggleError(true,'Sorry you have exceeded the hourly request');
        }
      })
      .catch((err)=>console.log(err));
  };

  function toggleError(show = false, msg = '') { //we establish false and empty string to deactivate the error after it activates.
    setError({show,msg}) //we establish the parameters for then using them in any function.
  }

  useEffect(checkRequests, [])

  return (
    <GithubContext.Provider value={{
      githubUser, 
      repos,
      followers,
      requests,
      error,
      searchGithubUser,
      loading,
    }}>
      {children}
    </GithubContext.Provider>
  )
}

export {GithubProvider, GithubContext};