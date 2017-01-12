'use strict'

var xss=require('xss')
var mongoose=require('mongoose')
var User=mongoose.model('User')
var url=require('url')
var uuid=require('uuid')
var sms=require('../services/sms')

exports.signup=function * (next) {
	////get
	// var urlParas=url.parse(this.request.url,true).query;
	// console.log('urlParas.phoneNumber:'+urlParas.phoneNumber)
	// var phoneNumber = xss(urlParas.phoneNumber)	
	////post
	var phoneNumber=this.request.body.phoneNumber
	console.log('phoneNumber:'+phoneNumber)
	var user=yield User.findOne({
		phoneNumber:xss(phoneNumber)
	}).exec()
	var verifyCode=sms.getCode()
	console.log('verifyCode:'+verifyCode)
	if(!user){
		var accessToken=uuid.v4()
		user=new User({
			nickName:'小狗宝',
			avatar:'http://img1.sc115.com/uploads/sc/jpg/144/18660.jpg',
			phoneNumber:xss(phoneNumber),
			verifyCode:verifyCode,
			accessToken:accessToken
		})
	}
	else{
		user.verifyCode=verifyCode
	}

	console.log('user before save :'+ user)
	try{
		user=yield user.save()
	}
	catch(e){
		console.log(e)
		this.body={
			success: false
		}
		return next
	}

	console.log('user after save :'+ user)
	var msg='您的注册码是:'+user.verifyCode
	try{
		sms.send(user.phoneNumber,msg)	
	}
	catch(e){
		this.body = {
		    success: false,
		    err: '短信服务异常'
		}
		return next
	}
	

}

exports.verify=function * (next) {
	var verifyCode=this.request.body.verifyCode
	var phoneNumber=this.request.body.phoneNumber
	if(!verifyCode ||!phoneNumber){
		this.body={
			success: false,
			err: '验证未通过'
		}
		return next
	}

	var user=yield user.findOne({
		phoneNumber:phoneNumber,
		verifyCode:verifyCode
	}).exec()
	if(user){
		user.verified=true
		user= yield user.save()
		this.body={
			success: true,
			data:{
				nickName:user.nickName,
				accessToken:user.accessToken,
				avatar:user.avatar
			}
		}
	}
	else{
		this.body={
			success:false,
			err: '验证未通过'
		}
	}

	this.body={
		success:true
	}

}

exports.update=function * (next) {
	this.body={
		success:true
	}

}