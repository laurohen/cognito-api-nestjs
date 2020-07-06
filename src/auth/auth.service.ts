import { AuthConfig } from './auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {

  private userPool: CognitoUserPool;
  private sessionUserAttributes: {};
  
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }
  
  registerUser(registerRequest: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) {
      const { name, username, email, password } = registerRequest;
      var attributeList = [];

      attributeList.push({Name:"name",Value: name});
      attributeList.push({Name:"email",Value: email});


      return new Promise((resolve, reject) => {
        return this.userPool.signUp(
          username,
          password,
          attributeList,
          null,
          (err, result) => {
            if (!result) {
              reject(err);
            } else {
              resolve(result.user);
            }
          },
        );
        
      });
  }

  resendCodeUser(user: { username: string; }) {
    const { username } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        return newUser.resendConfirmationCode( (err, result) => {
          if (err) {
             reject(err);
          }
          if (!err) {
             resolve(result);
          }
        });
    });
  }
  
  confirmUser(user: { username: string; code: string }) {
    const { username, code } = user;

    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        return newUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
             console.log(err);
             reject(err);
          }
          if (!err) {
             console.log(err);
             resolve(result);
          }
        });
    });
  }

  authenticateUser(user: { username: string; password: string }) {
    const { username, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          console.log('id token + ' + result.getIdToken().getJwtToken());
          console.log('refresh token + ' + result.getRefreshToken().getToken());
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  }

}
