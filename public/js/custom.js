const headerArea = document.querySelector(".site-heading");






// show posts
showPosts();




// check if token is set or is valid (if authenticated)
if(!localStorage.hasOwnProperty('token') || !localStorage.hasOwnProperty('userId')) {
	renderLogin();


	// login script
	document.querySelector('#btn-login').addEventListener('click', () => {
		const email = document.querySelector('[name="email"]').value;
		const password = document.querySelector('[name="password"]').value;


		fetch('http://localhost:3000/login', {
			method : 'POST',
			headers : {
			'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
			email : email,
			password : password
			})
		})
		.then(data => {
			return data.json();
		})
		.then(resData => {

			alert(resData.message);
			if(resData.status === 200) {
			

				localStorage.setItem('userId', resData.userId);
				localStorage.setItem('token', resData.token);


				window.location.reload();

			
			}
		})
		.catch(err => {
			console.log(err);
		})

	});



} else {
	renderPost();

	// logout script (basically removing the token and userId in localStorage)
	document.querySelector('#logout').addEventListener('click', (e) => {
		e.preventDefault();
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		window.location.reload();
	});




	// post status script
	document.querySelector('#post-status-btn').addEventListener('click', () => {

		const postEl = document.querySelector('[name="post"]');
		const post = postEl.value;
		
		// validate post status field
		if(post.trim() === '') {
			alert('Post shouldn\'t be empty!');
		} else {


			fetch('http://localhost:3000/create-post', {
				method : 'POST',
				headers : {
					'Authorization' : 'Bearer: ' + localStorage.getItem('token'),
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify({
					post : post
				})
			})
			.then(data => data.json())
			.then(resData => {
				if(resData.status === 201) {
					postEl.value = '';
				} else {
					alert(resData.message);
				}
				
			})
			.catch(err => {
				console.log(err);
			});


		}



		



	});


}



function showPosts() {

}






function renderLogin() {
	headerArea.innerHTML = `

		<p>You need to be logged in to post something</p>

		<form id="login">
			<div class="row">
			<div class="col">
				<input type="email" name="email" class="form-control" placeholder="E-Mail">
			</div>
			<div class="col">
				<input type="password" name="password" class="form-control" placeholder="Password">
			</div>
			<div class="col-3">
				<button type="button" id="btn-login" class="btn btn-primary btn-sm">Log In</button>
			</div>
			</div>
		</form>
	`;
}





function renderPost() {
	headerArea.innerHTML = `

		<form id="post-status">
			<div class="row">
			<div class="col">
				<input type="text" name="post" class="form-control" placeholder="Post anything!">
			</div>
			<div class="col-3">
				<button type="button" id="post-status-btn" class="btn btn-primary btn-sm">Post</button>
			</div>
			</div>
		</form>
	`;

	document.querySelector('#navbarResponsive ul li').innerHTML = `
	<a class="nav-link" id="logout" href="#">Log Out</a>
	`;

}