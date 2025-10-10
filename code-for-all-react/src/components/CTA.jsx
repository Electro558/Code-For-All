function CTA() {
    return (
        <section className="bg-gradient-to-br from-[#1a2332] to-[#2c3e50] text-white py-40 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8 text-center">
                <h2 className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-['Playfair_Display'] text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.015em] leading-[1.2] mb-8">
                    Ready to Transform Lives Through Technology?
                </h2>
                <p className="text-[rgba(255,255,255,0.95)] text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] text-[1.125rem] leading-[1.75] font-normal tracking-[-0.005em] mb-8 max-w-[800px] mx-auto">
                    Join our exclusive community of innovators, mentors, and changemakers. Together, we can bridge the digital divide and create unprecedented opportunities for everyone.
                </p>
                <a 
                    href="/events.html" 
                    className="inline-flex items-center justify-center px-8 py-4 font-['Work_Sans'] font-semibold text-[0.9375rem] uppercase tracking-[0.08em] border-2 border-[rgba(255,255,255,0.3)] rounded-xl cursor-pointer no-underline transition-all duration-300 leading-none bg-white text-[#1a2332] shadow-[0_8px_25px_rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.95)] hover:text-black hover:shadow-[0_15px_40px_rgba(255,255,255,0.6)] hover:border-[#0984e3] hover:-translate-y-0.5 focus:outline-[3px] focus:outline-[#1a2332] focus:outline-offset-2 active:translate-y-0"
                >
                    Begin Your Journey
                </a>
            </div>
        </section>
    );
}

export default CTA;
