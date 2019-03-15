var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(router, afs) {
        this.router = router;
        this.afs = afs;
        this.connecting = false;
        /*Init user object*/
        this.userObj = { uid: 'init', name: 'init', phoneNumber: 'init' };
        var that = this;
        that.user$ = new Observable();
    }
    AuthenticationService.prototype.loginWithPhoneNumber = function (phoneNumber) {
        var that = this;
        that.connecting = true;
        cordova.plugins.firebase.auth.verifyPhoneNumber(phoneNumber, 30000).then(function (verificationId) {
            console.log('verificationId', verificationId);
            that.verificationID = verificationId;
            that.router.navigateByUrl("/verification");
        });
    };
    AuthenticationService.prototype.verifSmsCode = function (verificationId, smsCode, firstName) {
        var that = this;
        var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, smsCode);
        console.log('signInCredential: ', signInCredential);
        cordova.plugins.firebase.auth.signInWithVerificationId(verificationId, smsCode).then(function (userInfo) {
            console.log('userinfo', userInfo);
            that.userObj.uid = userInfo.uid;
            that.userObj.phoneNumber = userInfo.phoneNumber;
            that.userObj.name = firstName;
            that.user$ = of(that.userObj);
            that.updateUserData(that.user$);
            that.router.navigateByUrl("/tabs/conversations/" + userInfo.uid);
        });
    };
    AuthenticationService.prototype.updateUserData = function (user) {
        // Sets user data to firestore on login
        var userRef = this.afs.doc("users/" + user.value.uid);
        var data = {
            uid: user.value.uid,
            phoneNumber: user.value.phoneNumber,
            name: user.value.name
        };
        return userRef.set(data, { merge: true });
    };
    AuthenticationService.prototype.logout = function () {
        var that = this;
        that.user$ = of(null);
    };
    AuthenticationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [Router, AngularFirestore])
    ], AuthenticationService);
    return AuthenticationService;
}());
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map