import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import BrutalistCard from "@/components/ui/BrutalistCard";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [login, { isLoading, error }] = useLoginMutation();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(formData).unwrap();
            dispatch(setCredentials(userData));
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <BrutalistCard
                color="bg-white"
                shadowSize="8px"
                className="w-full max-w-md"
            >

                {/* Heading */}
                <h2 className="mb-10 text-center text-4xl font-black tracking-tighter uppercase italic text-black">
                    USER{" "}
                    <span className="bg-black px-2 text-white not-italic">
                        LOGIN
                    </span>
                </h2>

                {/* Error */}
                {error && (
                    <div className="mb-8 border-2 border-black bg-[#fca5a5] p-3 text-[11px] font-black uppercase tracking-widest text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        {error.data?.message || "Access Denied: Invalid Credentials"}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-black">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="
                w-full bg-gray-50 p-3 font-bold
                border-2 border-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                focus:outline-none
                focus:bg-gray-200
                focus:shadow-none
                focus:translate-x-[4px]
                focus:translate-y-[4px]
                transition-all
              "
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="
                w-full bg-gray-50 p-3 font-bold
                border-2 border-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                focus:outline-none
                focus:bg-gray-200
                focus:shadow-none
                focus:translate-x-[4px]
                focus:translate-y-[4px]
                transition-all
              "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
              w-full py-4 font-black text-sm uppercase tracking-widest
              border-2 border-black transition-all
              ${isLoading
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : `
                    bg-blue-100 text-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:bg-blue-300 hover:text-black
                    active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px]
                  `
                            }
            `}
                    >
                        {isLoading ? "AUTHENTICATING..." : "Login →"}
                    </button>
                </form>

                <div className="mt-10 border-t-2 border-black pt-6 text-center">
                    <p className="text-[10px] font-semibold font-black uppercase tracking-widest text-black">
                        New to hackster?
                        <Link
                            to="/register"
                            className="ml-2 font-bold hover:underline cursor-pointer transition-transform"
                        >
                            Register Now
                        </Link>
                    </p>
                </div>
            </BrutalistCard>
        </div>
    );
};

export default LoginPage;
