import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../services/authApi";
import BrutalistCard from "@/components/ui/BrutalistCard";
import { showToast } from "@/components/SystemToast";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "User",
    });

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRoleChange = (role) =>
        setFormData({ ...formData, role });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await register(formData).unwrap();
            const userId = userData._id || userData.id || userData.user?._id;
            navigate(userId ? `/user/${userId}` : "/");
            showToast({
                message: 'Account created successfully!',
                type:'success'
            })
        } catch (err) {
            showToast({
                message:'Registration failed',
                type:'error'
            })
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4 mt-10 mb-24">
            <BrutalistCard
                color="bg-white"
                shadowSize="8px"
                className="w-full max-w-md"
            >
                <h2 className="mb-10 text-center text-4xl font-black tracking-tighter uppercase italic text-black">
                    CREATE{" "}
                    <span className="bg-black px-2 text-white not-italic">
                        ACCOUNT
                    </span>
                </h2>

                {error && (
                    <div className="mb-8 border-2 border-black bg-[#fca5a5] p-3 text-[11px] font-black uppercase tracking-widest text-black">
                        {error.data?.message || "Registration Failed"}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-black">
                            Registering As
                        </label>
                        <div className="flex gap-2">
                            {["User", "Admin"].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleChange(role)}
                                    className={`
                                        shadow-[3px_3px_0px_0px]
                                        border-2 border-black
                                        flex-1 py-3
                                        text-[10px] font-black uppercase tracking-widest
                                        transition-all
                                        ${formData.role === role
                                            ? "bg-yellow-400 text-black translate-x-[3px] translate-y-[3px] shadow-none"
                                            : "bg-yellow-100 text-black hover:bg-yellow-200"
                                        }
  `}
                                >
                                    {role === "User" ? "Builder" : "Organizer"}
                                </button>

                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-black">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                    bg-green-200 text-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:bg-green-300 hover:text-black
                    active:shadow-none
                    active:translate-x-[4px]
                    active:translate-y-[4px]
                  `
                            }
            `}
                    >
                        {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
                    </button>
                </form>

                <div className="mt-10 border-t-2 border-black pt-6 text-center">
                    <p className="text-[10px] font-semibold font-black uppercase tracking-widest text-black">
                        Already a member?
                        <Link
                            to="/login"
                            className="ml-2 font-bold hover:underline cursor-pointer transition-transform"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </BrutalistCard>
        </div>
    );
};

export default RegisterPage;
