function About() {
    return (
        <section className="bg-[#f8f9fa] py-40 relative overflow-hidden" id="about">
            <div className="max-w-[1400px] mx-auto px-8">
                <h2 className="text-center mb-16 relative font-['Playfair_Display'] text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.015em] leading-[1.2] text-[#2d3436] after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-[#0984e3] after:to-[#74b9ff] after:rounded-sm">
                    Our Mission
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="font-['Arvo']">
                        <p className="text-[1.375rem] leading-[1.7] font-[450] tracking-[-0.01em] text-[#2d3436] mb-4 font-['Arvo'] text-[1.1rem] leading-[1.8]">
                            At Code For All, we believe that technology should be accessible to everyone, regardless of their background or circumstances. Our mission is to empower communities by providing free coding education, digital literacy programs, and technology resources.
                        </p>
                        <p className="text-[1.125rem] text-[#2d3436] mb-4 leading-[1.75] font-normal tracking-[-0.005em] font-['Arvo'] text-[1.1rem] leading-[1.8]">
                            We work with local organizations, schools, and community centers to bring technology education directly to underserved communities. Through hands-on workshops, mentorship programs, and collaborative projects, we're building a more inclusive digital future.
                        </p>
                        <a 
                            href="#impact" 
                            className="inline-flex items-center justify-center px-8 py-4 font-['Work_Sans'] font-semibold text-[0.9375rem] uppercase tracking-[0.08em] border-2 border-[rgba(255,255,255,0.3)] rounded-xl cursor-pointer no-underline transition-all duration-300 leading-none bg-gradient-to-br from-[#1a2332] to-[#2c3e50] text-white shadow-[0_8px_25px_rgba(26,35,50,0.4)] hover:bg-gradient-to-br hover:from-[#2c3e50] hover:to-[#1a2332] hover:shadow-[0_15px_40px_rgba(26,35,50,0.6)] hover:-translate-y-0.5 hover:outline hover:outline-2 hover:outline-white hover:outline-offset-2 focus:outline-[3px] focus:outline-white focus:outline-offset-2 active:translate-y-px"
                        >
                            Discover Our Impact
                        </a>
                    </div>
                    <div className="relative transition-transform duration-[0.6s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] hover:-translate-y-[5px]">
                        <img 
                            src="/photos/coding_classroom.jpg" 
                            alt="Students learning to code" 
                            className="w-full rounded-xl shadow-[0_8px_40px_rgba(26,35,50,0.12)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
