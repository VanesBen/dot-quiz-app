import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LandingPage () {
    const navigate = useNavigate();
    const accounts = [
        {
            username: "admin",
            pass: "admin123"
        },
        {
            username: "user",
            pass: "user123"
        }
    ]
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setusernameValue(e.target.value);
    };

    const handleInputChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpasswordValue(e.target.value);
    };

    const [usernameValue, setusernameValue] = useState("");
    const [passwordValue, setpasswordValue] = useState("");
    const [isLogin, setisLogin] = useState(false);

    
    function whenClick (username: string, password:string) {
        if(usernameValue !== "") {
            setusernameValue(username)
            setpasswordValue(password)
            const userDitemukan = accounts.find(element => 
                element.username === username && element.pass === password
            );
            if(userDitemukan) {
                navigate('/Homepage');
            } else {
                console.log("Helo")
                // alert("User Tidak Ditemukan!")
            }
        }
        
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white p-8 border-b-8 flex flex-col gap-4 shadow-xl rounded-[4%] border-b-blue-500">
                
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">Login</h1>
                
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700" htmlFor="username">Username</label>
                    <input 
                        id="username" 
                        value={usernameValue} 
                        className="p-2 border-2 border-gray-300 rounded-md focus:border-amber-400 outline-none transition-all" 
                        type="text" 
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700" htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        value={passwordValue}
                        className="p-2 border-2 border-gray-300 rounded-md focus:border-amber-400 outline-none transition-all" 
                        type="password" 
                        onChange={handleInputChangePass}
                    />
                </div>

                <button 
                    onClick={() => whenClick(usernameValue,passwordValue)} 
                    className="mt-4  cursor-pointer py-3 bg-amber-400 hover:bg-amber-500 font-bold rounded-md transition-all active:scale-95 shadow-md"
                >
                    Login
                </button>
                
            </div>
        </div>
    )
}

export default LandingPage;