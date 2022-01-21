import React from "react";

function initUserInfo(token) {
  var payload = parseToken(token)
  window.localStorage.setItem("token", token)
  window.localStorage.setItem("account", payload.account)
  window.localStorage.setItem("name", payload.name)
  window.localStorage.setItem("icon", payload.icon)
}

function setUserInfo(key, val) {
  window.localStorage.setItem(key, val)
}

function getUserInfo(key) {
  return window.localStorage.getItem(key)
}

function parseToken(token) {
  var tokenArr = token.split(".")
  var payload = JSON.parse(atob(tokenArr[1]))
  return payload
}

function getUserInfoFromLocal() {
  var token = window.localStorage.getItem("token")
  if (!token) {
    return null
  }


  var payload = parseToken(token)
  var expiredat = new Date(payload.expiredat)
  var currentTime = new Date()

  if (currentTime > expiredat) {
    return null
  }

  var name = payload.name
  var icon = payload.icon
  var account = payload.account
  if (!account) {
    return null
  }

  return {account: account, name: name, icon: icon}
}

export {getUserInfoFromLocal, setUserInfo, getUserInfo, initUserInfo}