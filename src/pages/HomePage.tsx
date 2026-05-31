import { useNavigate } from "react-router-dom";

function HomePage () {
    const navigate = useNavigate();

    const handleSelect = (level: string) => {
        // 1. Simpan ke lemari browser (Kunci: 'quiz_difficulty', Nilai: level)
        localStorage.setItem('quiz_difficulty', level);
        
        // 2. Baru pindah halaman
        navigate('/quiz');
      };


    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-4xl w-full flex flex-col items-center">
            
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                Welcome to <span className="text-blue-600">DOT Quiz!</span>
                </h1>
                <p className="mt-4 text-lg text-slate-600 font-medium">
                Challenge yourself. Please choose your difficulty:
                </p>
            </div>

            {/* Difficulty Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                
                {/* Easy Card */}
                <div onClick={() => handleSelect("easy")} className="group cursor-pointer p-8 bg-white border-b-8 border-green-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
                <div  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                    <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Easy</h3>
                <p className="text-sm text-slate-500 text-center mt-2">Perfect for beginners</p>
                </div>

                {/* Medium Card */}
                <div onClick={() => handleSelect("medium")} className="group cursor-pointer p-8 bg-white border-b-8 border-amber-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                    <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Medium</h3>
                <p className="text-sm text-slate-500 text-center mt-2">Test your knowledge</p>
                </div>

                {/* Hard Card */}
                <div onClick={() => handleSelect("hard")} className="group cursor-pointer p-8 bg-white border-b-8 border-red-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                    <span className="text-2xl">💀</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Hard</h3>
                <p className="text-sm text-slate-500 text-center mt-2">Only for true masters</p>
                </div>

            </div>
            </div>
        </div>

    )
    

}

export default HomePage