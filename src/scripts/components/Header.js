import React from 'react';

export default class Header extends React.Component{
	constructor(){
		super();
		this.state = {
			showForm:'',
			email:'',
			password:'',
			confirm:''
		};
		this.showForm = this.showForm.bind(this);
		this.trackChange = this.trackChange.bind(this);
		this.signUp = this.signUp.bind(this);
		this.login = this.login.bind(this);
	}
	showForm(e){
		e.preventDefault();
		this.setState({
			showForm:e.target.className
		})
	}
	trackChange(e){
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	signUp(e){
		//needs to holds if statement
		e.preventDefault();
		console.log('signing up');
		console.log(this.state.email, this.state.password, this.state.confirm);
		if(this.state.password === this.state.confirm){ firebase.auth()
			.createUserWithEmailAndPassword(
				this.state.email, this.state.password).then((userData) => {
					console.log(userData);
				})
		}else{
			console.log('please ensure passwords match')
		}
	}
	login(e){
		e.preventDefault();
		firebase.auth()
		.signInWithEmailAndPassword(this.state.email, this.state.password).then((userData)=>{
			console.log(userData);
		});
	}
	render(){
		//holds empty object where the selected form will go into
		let loginForm = (
				<div className="imgContainer">
					<img src="../../../images/project6Browser.png" alt="Photo of populated blog"/>
				</div>
			);
		if (this.state.showForm === 'signUp'){
			// sign up form
			loginForm = (
			<form onSubmit={this.signUp} className="userForm">
				<label htmlFor="email">Email:</label>
				<input type="email" name="email" onChange={this.trackChange} />
				<label htmlFor="password">Password:</label>
				<input type="password" name="password" onChange={this.trackChange} />
				<label htmlFor="confirm">Confirm:</label>
				<input type="password" name="confirm" onChange={this.trackChange} />
				<button className="button button__submit">CREATE ACCOUNT</button>
			</form>
			);
		} else if (this.state.showForm === 'login'){
			// login form
			loginForm =(
			<form onSubmit={this.login} className="userForm">
				<label htmlFor="email">Email:</label>
				<input type="email" name="email" onChange={this.trackChange} />
				<label htmlFor="email">Password:</label>
				<input type="password" name="password" onChange={this.trackChange} />
				<button className="button button__submit" >LOG IN</button>
			</form>
			);
		} else {
			// console.log('error');
		}
		return (
			<header className="header__signIn">
				<h1>FLASHBACK</h1>
				<p className="tagline">Create personal sticky notes for places you want to remember.</p>
				<ul>
					<li><a href="" className="signUp" onClick={this.showForm}>CREATE ACCOUNT</a></li>
					<li><a href="" className="login" onClick={this.showForm}>LOG IN</a></li>
				</ul>
				{loginForm}
			</header>
		)
	}
}