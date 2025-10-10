function Footer() {
    return (
        <footer className="bg-[#1a2332] text-white py-24 pb-8">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
                    <div className="flex flex-col items-start mb-8">
                        <h3 className="text-white mb-8 font-['Playfair_Display'] font-semibold text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.2]">
                            Code For All
                        </h3>
                        <p className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter'] mt-0">
                            Making coding accessible for everyone
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white mb-8 font-['Playfair_Display'] font-semibold text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.2]">
                            Quick Links
                        </h4>
                        <ul className="list-none">
                            <li className="mb-2">
                                <a 
                                    href="/" 
                                    className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter'] hover:text-[#74b9ff] transition-colors duration-300"
                                >
                                    Home
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    href="/events.html" 
                                    className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter'] hover:text-[#74b9ff] transition-colors duration-300"
                                >
                                    Events
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    href="/team.html" 
                                    className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter'] hover:text-[#74b9ff] transition-colors duration-300"
                                >
                                    Our Team
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                    href="/contact.html" 
                                    className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter'] hover:text-[#74b9ff] transition-colors duration-300"
                                >
                                    Get Involved
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white mb-8 font-['Playfair_Display'] font-semibold text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.2]">
                            Contact Us
                        </h4>
                        <p className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter']">
                            <i className="fas fa-envelope"></i> zhu47578@sas.edu.sg
                        </p>
                        <p className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter']">
                            <i className="fas fa-phone"></i> +65 8647 2776
                        </p>
                        <p className="text-[rgba(255,255,255,0.8)] no-underline leading-[1.8] font-['Inter']">
                            <i className="fas fa-map-marker-alt"></i> 40 Woodlands Street 41, Singapore 738547
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a 
                                href="https://www.instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-full text-white transition-all duration-300 no-underline hover:bg-[rgba(255,255,255,0.2)] hover:-translate-y-[3px] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] focus:outline-2 focus:outline-[rgba(255,255,255,0.5)] focus:outline-offset-2 active:-translate-y-px active:scale-105"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a 
                                href="https://www.twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-full text-white transition-all duration-300 no-underline hover:bg-[rgba(255,255,255,0.2)] hover:-translate-y-[3px] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] focus:outline-2 focus:outline-[rgba(255,255,255,0.5)] focus:outline-offset-2 active:-translate-y-px active:scale-105"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a 
                                href="https://www.facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 bg-[rgba(255,255,255,0.1)] rounded-full text-white transition-all duration-300 no-underline hover:bg-[rgba(255,255,255,0.2)] hover:-translate-y-[3px] hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] focus:outline-2 focus:outline-[rgba(255,255,255,0.5)] focus:outline-offset-2 active:-translate-y-px active:scale-105"
                            >
                                <i className="fab fa-facebook"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-[rgba(255,255,255,0.1)]">
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">
                        &copy; 2025 Code For All. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
