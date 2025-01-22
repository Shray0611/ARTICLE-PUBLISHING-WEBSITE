import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () =>{
    const [name,setName] = useState("");
    const [authorName,setAuthorName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/createarticle");
    }
  }, [navigate]);

  // const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "";

  const signup = async () => {
    const baseURL = "https://easyarticle.vercel.app";
    if(!name || !authorName || !email || !password) {
      setError(true);
      return false;
    }
    let result = await fetch(`${baseURL}/register`, {
        method:"post",
        body:JSON.stringify({name, authorName, email, password}),
        headers:{
            'Content-Type':'application/json'
        }
    })
    result = await result.json();
    console.log(result);
     if(result){
        navigate('/')
        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("token",JSON.stringify(result.auth));
    } 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signup();
  }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          SignUp to Create Article
        </h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="email"
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iamanauthor@creative"
            />
            <span className="mt-2 text-sm text-red-600">{error && !name && <p>Enter valid name!!</p>}</span>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Author Name
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              id="email"
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iamanauthor@creative"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="iamanauthor@creative"
            />
             <span className="mt-2 text-sm text-red-600">{error && !email && <p>Enter valid email!!</p>}</span>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="article"
            />
            <span className="mt-2 text-sm text-red-600">{error && !password && <p>Enter valid password!!</p>}</span>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
    )
}
export default SignUp;
