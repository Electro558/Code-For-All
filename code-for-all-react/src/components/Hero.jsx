function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#1a2332] via-[#2c3e50] to-[#0984e3] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/coding_classroom.jpg')] bg-center bg-cover bg-no-repeat opacity-10"></div>
            <div className="max-w-[1400px] mx-auto px-8 relative z-[2] text-center text-white">
                <h1 className="text-white mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-['Raleway'] text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.02em] leading-[1.05]">
                    Empowering Communities Through Technology
                </h1>
                <p className="font-['Source_Serif_Pro'] text-[1.375rem] font-normal leading-[1.7] text-[rgba(255,255,255,0.95)] mb-16 max-w-[600px] mx-auto tracking-[-0.01em]">
                    Join us in bridging the digital divide and creating opportunities for everyone to learn, grow, and succeed in the digital age.
                </p>
                <div className="flex gap-8 justify-center flex-wrap">
                    <a 
                        href="#about" 
                        className="inline-flex items-center justify-center px-8 py-4 font-['Work_Sans'] font-semibold text-[0.9375rem] uppercase tracking-[0.08em] border-2 border-[rgba(255,255,255,0.3)] rounded-xl cursor-pointer no-underline transition-all duration-300 leading-none bg-white text-[#1a2332] shadow-[0_8px_25px_rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.95)] hover:text-black hover:shadow-[0_15px_40px_rgba(255,255,255,0.6)] hover:border-[#0984e3] hover:-translate-y-0.5 focus:outline-[3px] focus:outline-[#1a2332] focus:outline-offset-2 active:translate-y-0 active:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                    >
                        Discover Our Mission
                    </a>
                    <a 
                        href="/events.html" 
                        className="inline-flex items-center justify-center px-8 py-4 font-['Work_Sans'] font-semibold text-[0.9375rem] uppercase tracking-[0.08em] border-2 border-[rgba(116,185,255,0.3)] rounded-xl cursor-pointer no-underline transition-all duration-300 leading-none bg-white text-black shadow-[0_8px_25px_rgba(255,255,255,0.4)] hover:bg-black hover:text-white hover:border-[#0984e3] hover:shadow-[0_15px_40px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 focus:outline-[3px] focus:outline-[#2c3e50] focus:outline-offset-2 active:translate-y-0"
                    >
                        Join Our Events
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Hero;
