import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Impact from '../components/Impact';
import FeaturedInitiative from '../components/FeaturedInitiative';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

function Home() {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Impact />
            <FeaturedInitiative />
            <Testimonials />
            <CTA />
            <Footer />
        </>
    );
}

export default Home;
