function Impact() {
    return (
        <section className="bg-gradient-to-br from-[#1a2332] to-[#2c3e50] text-white py-40 relative overflow-hidden" id="impact">
            <div className="max-w-[1400px] mx-auto px-8">
                <h2 className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-center mb-16 relative font-['Playfair_Display'] text-[clamp(2.25rem,4.5vw,4rem)] font-bold tracking-[-0.015em] leading-[1.2] after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-[#0984e3] after:to-[#74b9ff] after:rounded-sm">
                    Our Impact
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="text-center p-16 bg-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-[10px] border border-[rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer hover:-translate-y-[10px] hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                        <i className="fas fa-users text-5xl text-[#74b9ff] mb-4"></i>
                        <h3 className="text-[2.5rem] font-bold text-white mb-2 font-['Playfair_Display']">
                            500+
                        </h3>
                        <p className="text-[rgba(255,255,255,0.8)] text-base">
                            Students Empowered
                        </p>
                    </div>
                    <div className="text-center p-16 bg-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-[10px] border border-[rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer hover:-translate-y-[10px] hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                        <i className="fas fa-graduation-cap text-5xl text-[#74b9ff] mb-4"></i>
                        <h3 className="text-[2.5rem] font-bold text-white mb-2 font-['Playfair_Display']">
                            50+
                        </h3>
                        <p className="text-[rgba(255,255,255,0.8)] text-base">
                            Workshops Delivered
                        </p>
                    </div>
                    <div className="text-center p-16 bg-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-[10px] border border-[rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer hover:-translate-y-[10px] hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                        <i className="fas fa-laptop-code text-5xl text-[#74b9ff] mb-4"></i>
                        <h3 className="text-[2.5rem] font-bold text-white mb-2 font-['Playfair_Display']">
                            25+
                        </h3>
                        <p className="text-[rgba(255,255,255,0.8)] text-base">
                            Community Partners
                        </p>
                    </div>
                    <div className="text-center p-16 bg-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-[10px] border border-[rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer hover:-translate-y-[10px] hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                        <i className="fas fa-heart text-5xl text-[#74b9ff] mb-4"></i>
                        <h3 className="text-[2.5rem] font-bold text-white mb-2 font-['Playfair_Display']">
                            1000+
                        </h3>
                        <p className="text-[rgba(255,255,255,0.8)] text-base">
                            Lives Transformed
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Impact;
