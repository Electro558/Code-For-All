function Testimonials() {
    return (
        <section className="bg-[#f8f9fa] py-40 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8">
                <h2 className="text-center mb-16 relative font-['Playfair_Display'] text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.015em] leading-[1.2] text-[#2d3436] after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-[#0984e3] after:to-[#74b9ff] after:rounded-sm">
                    Voices of Transformation
                </h2>
                <div className="bg-gradient-to-br from-[#74b9ff] to-[#0984e3] text-white text-center px-8 py-24">
                    <p className="text-2xl italic mb-16 text-white max-w-[800px] mx-auto">
                        "Code For All transformed my perspective on technology and opened doors I never knew existed. From having zero coding experience to landing my dream job as a web developer, this community provided not just education, but genuine mentorship and unwavering support."
                    </p>
                    <div className="flex items-center justify-center gap-8">
                        <img 
                            src="/photos/IMG_0142.JPG" 
                            alt="Sarah Johnson" 
                            className="w-[60px] h-[60px] rounded-full border-[3px] border-[rgba(255,255,255,0.3)]"
                        />
                        <div className="text-left">
                            <h4 className="text-white mb-1 font-['Playfair_Display'] text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-[1.2]">
                                Sarah Johnson
                            </h4>
                            <p className="text-[rgba(255,255,255,0.8)] text-sm m-0">
                                Senior Web Developer, TechCorp
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
