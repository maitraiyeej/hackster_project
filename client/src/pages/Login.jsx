import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2>Login Page</h2>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={()=>alert("Login working")}>Login</button>
    </div>
  );
}