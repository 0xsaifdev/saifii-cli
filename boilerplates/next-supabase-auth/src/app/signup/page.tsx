"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    // create user profile
    await supabase.from("users").insert({
      id: data.user.id,
    });

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col gap-3 p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Sign Up</h1>

      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup} className="bg-black text-white p-2">
        Create Account
      </button>
    </div>
  );
}
