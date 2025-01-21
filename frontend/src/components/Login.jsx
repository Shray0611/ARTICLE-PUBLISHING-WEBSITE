import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/createarticle");
    }
  }, [navigate]);

  const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(true);
    }
    console.log(`${baseURL}/login`);
    
    let user = await fetch(`${baseURL}/login`, {
      method:"post",
      body:JSON.stringify({email,password}),
      headers:{
          "Content-Type":"application/json"
      }
  });
  user = await user.json();
  console.log(user);
  
  if(user.auth){
      localStorage.setItem("user", JSON.stringify(user.user));
      localStorage.setItem("token", JSON.stringify(user.auth));
      navigate("/");
  } else{
      alert("Enter correct details");
  }
  };

  const notregister = () => {
    navigate("/signup")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Login to Create Article
        </h2>
        <form onSubmit={handleSubmit}>
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
            className="w-full mt-5 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
        <button
            className="w-full mt-5 px-4 py-2 font-medium text-red bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none hover:text-white focus:ring-4 focus:ring-blue-500"
            onClick={notregister}
          >
            Not Registered?
          </button>
      </div>
    </div>
  );
};

export default Login;
