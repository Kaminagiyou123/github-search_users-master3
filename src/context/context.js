import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';



const GithubContext=React.createContext();

const GithubProvider=({children})=>{
    const [githubUser,setGithubUser]=useState(mockUser)
    const[repos,setRepos]=useState(mockRepos)
    const [followers,setFollowers]=useState(mockFollowers)
    const[requests,setRequests]=useState(0)
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState({show:false,msg:''})
    //error
const rootUrl = 'https://api.github.com';

const searchGithubUser=async(user)=>{
    toggleError(false,'')
    setLoading(true)
    const response= await axios.get(`${rootUrl}/users/${user}`).catch(error=>console.log(error))
if (response)
   { setGithubUser(response.data)
    const {login,followers_url}=response.data
    axios(`${rootUrl}/users/${login}/repos?per_page=100`).then(
        response=> setRepos(response.data)
    )
    axios(`${followers_url}?per_page=100`).then(
        response=> setFollowers(response.data)
    )
   //https://api.github.com/users/john-smilga/repos?per_page=100
   //https://api.github.com/users/john-smilga/followers

   }

else{
    toggleError(true,'there is no user under this user name')
}
setLoading(false)
}



const checkRequests= async()=>{
    const {data}= await axios.get(`${rootUrl}/rate_limit`)
        const {rate:{remaining}}=data
      
        setRequests(remaining)
        if (remaining===0){
            toggleError(true,'hourly rate limit exceeded')           
        }
    }
const toggleError=(show,msg)=>{
    setError({show,msg})       
    }


    useEffect(()=>{
       checkRequests()
        
    },[])
    return <GithubContext.Provider value={{
        githubUser,repos,followers,requests,error,searchGithubUser,loading
    }}>
        {children}
    </GithubContext.Provider>
}

export { GithubProvider,GithubContext}