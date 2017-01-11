'use strict'

var xss=require('xss')
var mongoose=require('mongoose')
var User=mongoose.model('User')
var url=require('url')

exports.signup=function * (next) {
	var urlParas=url.parse(this.request.url,true).query;
	console.log('urlParas.phoneNumber:'+urlParas.phoneNumber)
	var phoneNumber = xss(urlParas.phoneNumber)	
	console.log('phoneNumber:'+phoneNumber)
	var user=yield User.findOne({
		phoneNumber:phoneNumber
	}).exec()

	console.log('phoneNumber:'+phoneNumber)
	if(!user){
		user=new User({
			phoneNumber:xss(phoneNumber)
		})
	}
	else{
		user.verifyCode='1212'
	}
	console.log(user)

	try{
		user=yield user.save()
	}
	catch(e){
		console.log(e)
		this.body={
			success:true
		}
		return next
	}

	console.log(user)
	this.body = {
	    success: true
	}

}

exports.verify=function * (next) {
	this.body={
		success:true
	}

}

exports.update=function * (next) {
	this.body={
		success:true
	}

}