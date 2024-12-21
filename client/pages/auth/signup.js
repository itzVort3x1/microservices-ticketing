import { useState } from "react";
import axios from "axios";

const signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/users/signup", {
                email,
                password,
            });

            console.log(response.data);
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};

export default signup;
