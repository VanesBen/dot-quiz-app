import { useState, useEffect } from "react";
import decodeHTML  from '../utils/DecodeHtml'

interface QuizQuestion {
    type: string,
    difficulty: string,
    category: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[], 
    all_answers: string[]
  }

interface APIResponse {
    response_code: number;
    results: QuizQuestion[];
}

function QuizPage () {
  // State for question dan load question
  const [currentDifficulty, setCurrentDifficulty] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<String[]>([]);
  const [timeleft, setTimeLeft] = useState(200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // state for progress
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [haveAnswered, setHaveAnswered] = useState(false);
  const [answer, setAnswer] = useState("");
  const isFinished = questions.length > 0 && indexQuestion >= questions.length || timeleft === 0;
  const currentQuestion = questions[indexQuestion];
  const [score, setScore] = useState(0);

  // Load for question and answer
  // if(currentQuestion) {
  //   useEffect(() => {
  //     if (timeleft === 0) {
  //       return;
  //     }
    
  //     // 2. Pasang interval
  //     const timer = setInterval(() => {
  //       setTimeLeft((prev) => prev - 1); 
  //     }, 1000);
    
  //     // 3. CLEANUP (Wajib!) - Matiin mesin pas re-render atau unmount
  //     return () => clearInterval(timer);
  //   }, [timeleft, currentQuestion]); // Timer bakal "re-sync" setiap kali timeLeft berubah
  
    
  // }

  useEffect(() => {
    if (timeleft === 0 || !currentQuestion) {
      return;
    }
  
    // 2. Pasang interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1); 
    }, 1000);
  
    // 3. CLEANUP (Wajib!) - Matiin mesin pas re-render atau unmount
    return () => clearInterval(timer);
  }, [timeleft,currentQuestion]); // Timer bakal "re-sync" setiap kali timeLeft berubah

  useEffect(() => {
    const initQuiz = async () => {
      // Pertama kita get dificulty nya dulu dari local storage
      // kalo quiz_dificulty nya = null -> maka diganti ke "easy" sebagai default value dari savedDif
      const savedDifficulty = localStorage.getItem('quiz_difficulty') || "easy";
      setCurrentDifficulty(savedDifficulty);
  
      try {
        setLoading(true);
        setError(null);
  
        const response = await fetch(
          `https://opentdb.com/api.php?amount=10&category=18&difficulty=${savedDifficulty}&type=multiple`
        );
  
        if (!response.ok) throw new Error("Gagal konek ke server!");

        /*
          Ini maksudnya data ini tipe data nya APIResponse (sesuai interface yang kita buat)
          response.json() itu ngasi objek promise yang isinya status sama result
          property di interface harus sama kek yang ada di resul nya biar ga error -> dan otomatis ini udah auto mapped karena sama nama key nya yang ada di result nya

          dia bisa ga error karena ada keyword await -> asyncronus -> tipe data nya masih any atau ibarat nya ngutang dulu nih nanti baru dikasi tau pas datanya ada
        */
        const data: APIResponse = await response.json();
  

        if (data.response_code === 0) {
          // masukin ke state dari object APIResponse
          const rawData: QuizQuestion[] = data.results;

          // 2. Mapping data: Isi property all_answers yang sudah lo buat
          const processedQuestions: QuizQuestion[] = rawData.map((q: QuizQuestion) => {
            const combined = [q.correct_answer, ...q.incorrect_answers];
            // duplikasi object nya
            return {
              ...q, // Tetap wajib pake spread (...) biar question & category nggak ilang
              all_answers : randomizeAnswer(combined) // Ngisi property all_answers yang dimana udah pake fungsi randomize buat acak2 pertanyaan + jawaban nya
            };

          });
  
          // 3. Update state dengan data yang sudah "matang"
          setQuestions(processedQuestions);
        } else {
          throw new Error("API Limit reached atau soal tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error kuis:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
  
    initQuiz();
  }, []);


  function randomizeAnswer(arrayChoosen: string[]) {
    for(var i = 0; i < arrayChoosen.length; i++) {
        var j = Math.floor(Math.random() * arrayChoosen.length);
        [arrayChoosen[i], arrayChoosen[j]] = [arrayChoosen[j], arrayChoosen[i]];
        //arrayChoosen[i] = arrayChoosen[j]
    }
    return arrayChoosen
}

   // fungsi progress
  function handleAnswer() {
    if(answer == currentQuestion.correct_answer) {
      setScore(score+10)
    }

    if(indexQuestion < questions.length) {
        var index = indexQuestion;
        setIndexQuestion(index += 1);
      }
    setAnswer("");
  } 
  
  function lockAnswer(element: HTMLElement) {
    setAnswer(element.innerHTML)
  }

  function backAction() {
    if(indexQuestion < questions.length) {
      if(answer == currentQuestion.correct_answer) {
        setScore(() => score-10)
      }
      setIndexQuestion(() => indexQuestion - 1);
      setAnswer("");
    }
  }
    
    // display
  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold text-blue-600">Quiz Done! 🏁</h2>
          <p className="mt-4 text-slate-600 text-lg">Congratulation you have completed your quiz</p>
          <div className="text-5xl font-extrabold my-8 text-slate-800">{score}/100</div>

          <button 
            onClick={() => {
              window.location.href = '/Homepage'
              setScore(0);
            }}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all"
          >
            Play Again
          </button>
        </div>
      );  
  }

    return(
        <div className="">
            <div className="bg-amber-50 border-x-4  p-5 flex flex-row justify-between items-end shadow-inner mb-2">
              <div className="space-y-1">
                <p className="text-amber-800 text-xs font-black uppercase">Remaining Time</p>
                <div className={`text-4xl font-mono font-bold ${timeleft <= 5 ? 'text-red-600' : 'text-amber-900'}`}>
                  00:{timeleft < 10 ? `0${timeleft}` : timeleft}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-4 py-2 bg-amber-500 text-amber-950 rounded-xl font-black transform-rotate-2 shadow-md">
                  {currentDifficulty.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              {currentQuestion ? (
                <>
                  <button onClick={backAction} className="p-2 border-2 border-gray-300 rounded-md hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 font-medium">Back
                  </button>
                  <h3 className="font-black text-2xl">{decodeHTML(currentQuestion.question)}</h3>
                  <ul className="flex sm:flex-col flex-col lg:flex-row lg:justify-center">
                    <li onClick={(e) => lockAnswer(e.currentTarget)} className={`m-2 cursor-pointer p-4 rounded-xl transition-all ${
                        answer === currentQuestion.all_answers[0]
                          ? "bg-blue-400 shadow-lg scale-101" // Class tambahan kalau terpilih
                          : "bg-amber-400"                  // Class default
                        }`} >{decodeHTML(currentQuestion.all_answers[0])}</li>
                    <li onClick={(e) => lockAnswer(e.currentTarget)} className={`m-2 cursor-pointer p-4 rounded-xl transition-all ${
                        answer === currentQuestion.all_answers[1]
                          ? "bg-blue-400 shadow-lg scale-101" 
                          : "bg-amber-400"                  
                        }`} >{decodeHTML(currentQuestion.all_answers[1])}</li>
                    <li onClick={(e) => lockAnswer(e.currentTarget)} className={`m-2 cursor-pointer p-4 rounded-xl transition-all ${
                        answer === currentQuestion.all_answers[2]
                          ? "bg-blue-400 shadow-lg scale-101" 
                          : "bg-amber-400"                  
                        }`} >{currentQuestion.all_answers[2]}</li>
                    <li onClick={(e) => lockAnswer(e.currentTarget)} className={`m-2 cursor-pointer p-4 rounded-xl transition-all ${
                        answer === currentQuestion.all_answers[3]
                          ? "bg-blue-400 shadow-lg scale-101" 
                          : "bg-amber-400"                  
                        }`} >{currentQuestion.all_answers[3]}</li>
                  </ul>
                  <button onClick={handleAnswer} className="p-2 border-2 border-gray-300 rounded-md hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200 font-medium">Answer
                  </button>
                </>
              ) : (
                <p className="animate-pulse">Loading...</p>
              )}
             </div>
        </div>
    )
}

export default QuizPage