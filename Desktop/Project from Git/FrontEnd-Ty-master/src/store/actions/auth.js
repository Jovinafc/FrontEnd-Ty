import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};


export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


export const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId'); 
      return {
          type: actionTypes.AUTH_LOGOUT
        
      };
  };
  
  export const logoutSucceed = () => {
      return {
          type: actionTypes.AUTH_LOGOUT
      }
  };
  
  export const checkAuthTimeout = (expirationTime) => {
      return {
          type: actionTypes.AUTH_CHECK_TIMEOUT,
          expirationTime: expirationTime  
      };
  };
  
  export const auth = (email, password) => {
        return dispatch => {
          dispatch(authStart()); 
          const users = {
              email: email,
              password: password,
          }
          
          axios.post('http://localhost:3001/sign-in', {users: users})
          .then(response => {
              console.log(response.data);
              const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('expirationDate', expirationDate);
              localStorage.setItem('userId', response.data.user_id);
              dispatch(authSuccess(response.data.token, response.data.user_id));
              dispatch(checkAuthTimeout(response.data.expiresIn));
          })
          .catch(err => {
              dispatch(authFail(err.response.data.error));
          });
        };
  }
  
 // export const auth = (email, password, isSignup) => {
 //     return {
 //         type: actionTypes.AUTH_USER,
 //         email: email,
 //         password: password,
 //         isSignup: isSignup
 //     }
 // };
  
  export const setAuthRedirectPath = (path) => {
      return {
          type: actionTypes.SET_AUTH_REDIRECT_PATH,
          path: path
      };
  };
  
  export const authCheckState = () => {
      return dispatch => {
          const token = localStorage.getItem('token');
          if(!token){
              dispatch(logout());
          }else {
              const expirationDate = new Date(localStorage.getItem('expirationDate'));
              if(expirationDate > new Date()) {
                  const userId = localStorage.getItem('userId');
                  dispatch(authSuccess(token, userId));
                  dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime() )/ 1000));
              }else{
                 dispatch(logout());
              }
              
          }
      };
  };
  
//  export const authCheckState = () => {
//      return {
//          type: actionTypes.AUTH_CHECK_STATE   
//      }
//  };