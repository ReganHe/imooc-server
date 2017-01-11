'use strict'

var Router=require('koa-router')
var User=require('../app/controllers/User')
var App=require('../app/controllers/app')

module.exports=function(){
	var router=new Router({
		prefix:'/api/1'
	})

	////User
	router.get('/u/signup',User.signup)
	router.post('/u/verify',User.verify)
	router.post('/u/update',User.update)
	////App
	router.post('/u/signature',App.signature)

	return router
}
