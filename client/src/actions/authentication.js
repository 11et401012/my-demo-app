import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';

export const registerUser = (user, history) => dispatch => {
    axios.post('/api/users/register', user)
            .then(res => history.push('/login'))
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                });
            });
}

export const loginUser = (user) => dispatch => {
    axios({
        url: 'http://127.0.0.1:3001/users/login', 
        data: user,
        method: 'post',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(res => {
            if(res.data.status){
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                console.log(decoded)
                dispatch(setCurrentUser(decoded));
            }else{
                dispatch({
                    type: GET_ERRORS,
                    payload: res.data.message
                });    
            }
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: GET_ERRORS,
                payload: err
            });
        });
}

export const getUserData = (user) => dispatch => {
    let token= localStorage.getItem('jwtToken')
    axios({
        url: 'http://127.0.0.1:3001/users/list', 
        method: 'post',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer '+ token ;
        }
    })
    .then(res => {
           console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
}
