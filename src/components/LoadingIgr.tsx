import Image from "next/image"

const LoadingIgr = () => {
    return (
        <>
            {/* Container untuk spinner dan teks */}
            <div className="flex flex-col justify-center items-center min-h-[80vh]">
                {/* Spinner Animation */}
                <div className="relative flex justify-center items-center">
                    {/* Spinner Background */}
                    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>

                    {/* Logo dengan z-index lebih tinggi */}
                    <Image
                        src="/images/loading.jpg"
                        width={150}
                        height={150}
                        priority
                        alt="IGR Logo"
                        className="rounded-full h-28 w-28 relative z-10"
                    />
                </div>

                {/* Teks Animasi */}
                <div className="flex justify-center items-center mt-8"> {/* mt-8 untuk memberikan jarak */}
                    {["C", "I", "P", "I", "N", "A", "N", "G"].map((char, index) => (
                        <span
                            key={index}
                            className="px-1 bg-gradient-to-b from-blue-500 to-red-500 text-white rounded-full animate-ping text-6xl font-bold items-center"
                            style={{ animationDelay: `${index * 0.2}s`, animationDuration: "2s" }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}

export default LoadingIgr
