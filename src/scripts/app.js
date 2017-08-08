import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import Header from './components/Header';
import Searchbar from './components/Searchbar';
import Blogcard from './components/Blogcard';
import Autocomplete from 'react-google-autocomplete';

const apiKey ='AIzaSyB1EIPG-WkM1tGCOP_sLE57sxcuz8DE-Vg';

const config = {
   apiKey: "AIzaSyBCiX2kJEHBw3hq54L3OY6mb-tDg75E8ro",
   authDomain: "places-blog-2ddc9.firebaseapp.com",
   databaseURL: "https://places-blog-2ddc9.firebaseio.com",
   storageBucket: "places-blog-2ddc9.appspot.com",
   messagingSenderId: "639937116022"
 };
 firebase.initializeApp(config);

class App extends React.Component{
	constructor(){
		super();
		this.state = {
			posts:[],
			filteredPosts: [],
			search: '',
			blogPage: true,
			newPostShow: false
		}
		this.addPost = this.addPost.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.trackChange = this.trackChange.bind(this);
		this.searchToState = this.searchToState.bind(this);
		this.searchPosts = this.searchPosts.bind(this);
		this.showForm = this.showForm.bind(this);
		this.signOut = this.signOut.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}
	componentDidMount(){
		const dbRef = firebase.database().ref();

		firebase.auth().onAuthStateChanged((user) => {
			if(user){
				dbRef.on('value', (data) => {
				const databaseData = data.val();
				const postArray = [];

				for(let itemKey in databaseData){
					const postKey = databaseData[itemKey];
					postKey.key = itemKey;
					postArray.push(databaseData[itemKey]);
				}
				this.setState({
				posts:postArray,
				blogPage: false
				});
			});
		}
	})
	}
	showForm(e){
	e.preventDefault();
	this.overlayForm.classList.add('show');
		this.setState({
		newPostShow: true
		});
	}
	hideModal(e){
	this.overlayForm.classList.remove('show');
		this.setState({
			newPostShow: false
		})
	}
	hideBlogPage(e){
		const currentUser = firebase.auth().currentUser;
		if(currentUser) {
		}
		this.setState({
			blogPage: false
		})
	}
	trackChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	uploadPhoto(e) {
		let file = e.target.files[0];
		console.log(file.name);
		const storageRef = firebase.storage().ref('userPhotos/' + file.name)
		const task = storageRef.put(file).then(() => {
			const urlObject = storageRef.getDownloadURL().then((data) => {
				this.setState ({photo: data })
			})
		});
	}
	addPost(e){
		e.preventDefault();
		this.overlayForm.classList.remove('show');

		console.log(this.state.photo);
		let photo = this.state.photo || undefined
		//submit information to firebase
		//close form modal and hide
		//add new post tile to the home page

		const post = {
			title: this.state.title,
			location: this.state.location,
			note: this.state.note,
			photo: photo,
			};
			const dbRef = firebase.database().ref();
			dbRef.push(post);
			this.setState({
				newPostShow: false
			})
	}
	searchToState(e){
		this.setState({
			search: e.target.value
		})
	}
	searchPosts(e){
		e.preventDefault();
		//join takes all of blogcards object properties and combines into a string to be able to search the whole card versus one element
		//includes looks for the value within that string 
		const filtered = this.state.posts.filter(post => {
		  return Object.values(post).join(',').toLowerCase().includes(this.state.search.toLowerCase());
		})
		this.setState({
		 filteredPosts: filtered
		})
	}
	removePost(postToRemove){
		const dbRef = firebase.database().ref(postToRemove.key);
		dbRef.remove();
	}
	signOut(e){
		firebase.auth().signOut();
		this.setState({
		 blogPage: true
		})
	}
	render(){
		let newPostForm = '';
		if(this.state.newPostShow === true){
			newPostForm = (
				<form className="form__post" htmlFor="postForm" onSubmit={this.addPost}>
					<button className="button button__exitForm" onClick={this.hideModal}>
						<i className="fa fa-times" aria-hidden="true"></i>
					</button>
					<h2>ADD A NEW PLACE:</h2>
					<label htmlFor="title">Title *</label>
					<input placeholder="Enter a title" type="text" name="title" className="form__post--input" onChange={this.trackChange}/>
					<label htmlFor="location">Location *</label>
					<Autocomplete name="location" className="autocompleteInput form__post--input" style={{display: 'flex'}}  onPlaceSelected={(place) => {
						console.log(place);
						this.setState({
							location: place.formatted_address})}}  types={['establishment','geocode'] } />
					<label htmlFor="photo">Image</label>
					<input type="file" name="photo" className=" form__post--input" accept="image/*" onChange={this.uploadPhoto} />
					<label htmlFor="title">Note *</label>
					<textarea placeholder="Enter a quick note (max 200 characters)" maxLength="200" type="text" name="note" className="form__post--input" rows="4" cols="50" onChange={this.trackChange}></textarea>
					<button className="button button__submit">ADD POST</button>
				</form>
			)
		}else{
			// 	console.log('no form showing');
		}
// SETTING THE LOGIN PAGE
		let postView ='';
		if (this.state.search === ""){
			postView = (
				<ul className="blogMason">
					{this.state.posts.map((item) => {
						return <Blogcard data={item} remove={this.removePost} key={item.key} />
					})}
				</ul>
		)} else {
			postView = ( 
				<ul className="blogMason">
					{this.state.filteredPosts.map((item) => { return <Blogcard data={item} remove={this.removePost} key={item.key} />
						})}
				</ul>
		)}
		let account = (
			<Header />
		);
		let blogPage = (
			<div>
				<header className="header__blogPage">
					<div className="flexWrapper">
						<button className="button button--header" onClick={this.showForm}><i className="fa fa-plus" aria-hidden="true"></i> Add  Post</button>
						<button className="button button--header" onClick={this.signOut}><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out
						</button>
					</div>
					<h1>FLASHBACK</h1>
				</header>
				{newPostForm}
				<Searchbar searchToState ={this.searchToState} searchPosts = {this.searchPosts}/>
				<section className="blogPage">
				{postView}
				</section>
			</div>
		)
		return (
			<div>
				<div className="overlayForm" ref={ ref => this.overlayForm = ref}></div>
				{this.state.blogPage === false ? blogPage : account}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));